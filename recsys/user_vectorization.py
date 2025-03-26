import numpy as np

from recsys.vectorization_utils import bert_embed


def embed_user(new_history: str, old_embedding: str):
    new_embedding = bert_embed(new_history)

    old_embedding = np.fromstring(old_embedding, dtype=float, sep=",")
    assert new_embedding.shape == old_embedding.shape

    return (new_embedding + old_embedding) / 2


def test_embed():
    old_embedding = ",".join(["0"] * 312)
    new_history = "some history"
    print(f"embedding of a new history: {bert_embed(new_history)[:10]}")

    new_embedding = embed_user(new_history, old_embedding)
    print(f"new embedding of a user: {new_embedding[:10]}")


if __name__ == "__main__":
    test_embed()
