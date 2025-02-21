import json
import pandas as pd
import nltk
from nltk.corpus import stopwords
from razdel import tokenize
from sklearn.feature_extraction.text import TfidfVectorizer

nltk.download('stopwords')


def read_json(file_path):
    with open(file_path, 'r') as file:
        data = json.load(file)
    return data


def tokenize_sentence(sentence):
    return [token.text for token in list(tokenize(sentence))]


def vectorize_titles(titles):
    vectorizer = TfidfVectorizer(
        # tokenizer=lambda x: [tokenize],
        stop_words=stopwords.words('russian')
    )
    vectors = vectorizer.fit_transform(titles)
    print(f"dims: {vectors[0].shape}")

    return vectors


def save_vectors_to_json(vectors, ids, output_file):
    vectors_dict = {
        str(ids[i]): vectors[i].toarray().flatten().tolist() for i in range(len(ids))
    }
    with open(output_file, 'w') as file:
        json.dump(vectors_dict, file, indent=4)


def main(input_file, output_file):
    data = read_json(input_file)

    titles = [entity['title'] for entity in data]
    ids = [entity['id'] for entity in data]

    print(f"Before tokenization: {len(titles[0].split(' '))}")
    print(titles[0])
    tokens = [" ".join(tokenize_sentence(title)) for title in titles]
    print(f"After tokenization: {len(tokens[0].split(' '))}")
    print(tokens[0])

    vectors = vectorize_titles(tokens)
    save_vectors_to_json(vectors, ids, output_file)


if __name__ == "__main__":
    input_file = 'data/medical_articles.json'
    output_file = 'vectorized_data/medical_articles_vectors.json'
    main(input_file, output_file)
