import argparse
import json
import numpy as np
from scipy.spatial.distance import cosine


json_file_path = '../recsys/vectorized_data/medical_articles_vectors.json'


def load_embeddings_from_json(file_path):
    with open(file_path, 'r') as file:
        data = json.load(file)
    return data


def calculate_similarity(user_embedding, item_embedding):
    return 1 - cosine(user_embedding, item_embedding)


def get_top_k_recommendations(user_embedding, embeddings, k):
    similarities = {item_id: calculate_similarity(user_embedding, item_embedding)
                    for item_id, item_embedding in embeddings.items()}
    top_k_items = sorted(similarities.items(), key=lambda x: x[1], reverse=True)[:k]

    return top_k_items


def example_run():
    user_embedding = np.array([0.1] * 312)
    k = 5

    item_embeddings = load_embeddings_from_json(json_file_path)

    top_k_recommendations = get_top_k_recommendations(user_embedding, item_embeddings, k)

    print(f"Top {k} Recommendations:")
    for item_id, similarity in top_k_recommendations:
        print(f"Item ID: {item_id}, Similarity Score: {similarity:.4f}, Item Embedding slice: {item_embeddings[item_id][:5]}")


def recommend(user_embedding: np.ndarray, k: int = 5) -> list[(str, float)]:
    item_embeddings = load_embeddings_from_json(json_file_path)
    top_k_recommendations = get_top_k_recommendations(user_embedding, item_embeddings, k)

    return top_k_recommendations


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument('--embedding', type=str, help="User embedding")
    args = parser.parse_args()
    # user_embedding = ", ".join(["0.1"] * 312)  # 312 - размер эмбеддинга пользователя
    # print(user_embedding)
    recs = [item[0] for item in recommend(
        user_embedding=np.fromstring(args.embedding, dtype=float, sep=",")
    )]
    print(*recs, sep=',')
