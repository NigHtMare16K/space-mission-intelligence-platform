from pathlib import Path
from dotenv import load_dotenv

from langchain_core.prompts import PromptTemplate
from langchain_groq import ChatGroq
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS

from app.services.chatbot.index_builder import INDEX_DIR, build_faiss_index, index_exists

load_dotenv()

BACKEND_DIR = Path(__file__).resolve().parents[3]
EMBEDDING_MODEL = "sentence-transformers/all-MiniLM-L6-v2"

# Simple session memory (LangChain 1.x removed langchain.memory)
_chat_history: list[tuple[str, str]] = []
MAX_HISTORY_TURNS = 20

_llm = None
_retriever = None

prompt = PromptTemplate(
    template="""
You are AstroGuide, an expert AI assistant specializing in space missions.

You are provided with mission documents retrieved from a trusted space mission database.

Rules:

• Use the retrieved context as your primary source.
• Never invent mission facts.
• If the answer is partially available, clearly state what is known.
• If the retrieved context is insufficient, respond:
"I couldn't find enough information in the mission database."

• When appropriate:
- Explain concepts simply.
- Use bullet points.
- Mention mission objectives, agencies, launch year, destination, achievements and mission status.

• If multiple missions are retrieved, compare them logically.

Conversation History:
{chat_history}

Retrieved Context:
{context}

Question:
{question}

Provide a detailed yet concise answer.

At the end include:

Source Missions:
- <mission names from retrieved documents>
""",
    input_variables=["context", "question", "chat_history"],
)


def _get_llm():
    global _llm
    if _llm is None:
        _llm = ChatGroq(
            model="openai/gpt-oss-120b",
            temperature=0,
        )
    return _llm


def _get_retriever():
    global _retriever
    if _retriever is not None:
        return _retriever

    if not index_exists():
        build_faiss_index()

    embeddings = HuggingFaceEmbeddings(model_name=EMBEDDING_MODEL)
    vector_store = FAISS.load_local(
        str(INDEX_DIR),
        embeddings,
        allow_dangerous_deserialization=True,
    )
    _retriever = vector_store.as_retriever(
        search_type="similarity",
        search_kwargs={"k": 4},
    )
    return _retriever


def _format_history() -> str:
    if not _chat_history:
        return "No previous conversation."
    return "\n".join(
        f"Human: {question}\nAssistant: {answer}"
        for question, answer in _chat_history[-MAX_HISTORY_TURNS:]
    )


def chat(question: str):
    retriever = _get_retriever()
    llm = _get_llm()
    history = _format_history()

    retrieved_docs = retriever.invoke(question)

    context_text = "\n\n".join(doc.page_content for doc in retrieved_docs)

    final_prompt = prompt.format(
        context=context_text,
        question=question,
        chat_history=history,
    )

    response = llm.invoke(final_prompt)

    _chat_history.append((question, response.content))

    mission_names = []
    for doc in retrieved_docs:
        if "Mission_Name:" in doc.page_content:
            for line in doc.page_content.split("\n"):
                if line.startswith("Mission_Name:"):
                    mission_names.append(line.replace("Mission_Name:", "").strip())

    return {
        "answer": response.content,
        "source_missions": list(set(mission_names)),
    }
