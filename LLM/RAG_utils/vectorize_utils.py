import json
import pickle
from os import listdir
from os.path import isfile, join

from haystack import Document
from haystack.components.embedders import SentenceTransformersDocumentEmbedder
from haystack.document_stores.in_memory import InMemoryDocumentStore


def vectorized_storage(
    rag_docs_path='LLM/RAG_docs'
) -> InMemoryDocumentStore:
    documents: list[Document] = []

    # Files for RAG should be .txt with one json at one line
    # jsons with args [id, contents]
    rag_files = [f for f in listdir(rag_docs_path) if isfile(join(rag_docs_path, f))]
    for rag_filename in rag_files:
        with open(f'{rag_docs_path}/{rag_filename}', 'r') as rag_file:
            for line in rag_file.readlines():
                doc = json.loads(line)
                documents.append(
                    Document(
                        id=doc['id'],
                        content=doc['contents'],
                        # embedding=
                    )
                )
                # print(f'{rag_filename} id={doc["id"]} loaded')

    # print("Start embedding process")
    document_embedder = SentenceTransformersDocumentEmbedder()
    document_embedder.warm_up()

    documents_with_embeddings = document_embedder.run(documents)["documents"]
    # embeddings = [item.embedding for item in documents_with_embeddings]

    document_store = InMemoryDocumentStore(embedding_similarity_function="cosine")
    document_store.write_documents(documents_with_embeddings)
    # document_store.save_to_disk(join(rag_docs_path, "vectorized"))
    with open(join(rag_docs_path, "vectorized.pkl"), "wb") as f:
        pickle.dump(documents_with_embeddings, f)

    return document_store


if __name__ == "__main__":
    vectorized_storage()
