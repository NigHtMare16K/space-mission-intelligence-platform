from pathlib import Path

import pandas as pd
from langchain_core.documents import Document
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS

BACKEND_DIR = Path(__file__).resolve().parents[3]
PROJECT_DIR = BACKEND_DIR.parent
DATASET_PATH = PROJECT_DIR / "Dataset" / "Space_Missions_Dataset.csv"
INDEX_DIR = BACKEND_DIR / "faiss_index"
EMBEDDING_MODEL = "sentence-transformers/all-MiniLM-L6-v2"


def index_exists() -> bool:
    return (INDEX_DIR / "index.faiss").exists() and (INDEX_DIR / "index.pkl").exists()


def build_faiss_index(force: bool = False) -> Path:
    """Build and save the FAISS vector index from the missions dataset."""
    if index_exists() and not force:
        return INDEX_DIR

    if not DATASET_PATH.exists():
        raise FileNotFoundError(f"Dataset not found: {DATASET_PATH}")

    df = pd.read_csv(DATASET_PATH)
    df["Launch_Year"] = df["Launch_Date"].str.split("-").str[0]

    documents = []
    for _, row in df.iterrows():
        content = "\n".join(f"{col}: {row[col]}" for col in df.columns)
        documents.append(
            Document(
                page_content=content,
                metadata={
                    "mission_name": row["Mission_Name"],
                    "agency": row["Agency"],
                    "launch_year": row["Launch_Year"],
                },
            )
        )

    embeddings = HuggingFaceEmbeddings(model_name=EMBEDDING_MODEL)
    vector_store = FAISS.from_documents(documents, embeddings)

    INDEX_DIR.mkdir(parents=True, exist_ok=True)
    vector_store.save_local(str(INDEX_DIR))

    return INDEX_DIR
