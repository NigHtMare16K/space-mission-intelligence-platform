"""Build the FAISS index for the chatbot RAG pipeline.

Usage:
    python -m app.services.chatbot.build_index
"""
from app.services.chatbot.index_builder import build_faiss_index, INDEX_DIR


def main():
    print("Building FAISS index (this may take a few minutes on first run)...")
    path = build_faiss_index(force=True)
    print(f"Index saved to: {path}")


if __name__ == "__main__":
    main()
