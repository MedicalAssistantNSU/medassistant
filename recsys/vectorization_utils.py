import json
import torch
from transformers import AutoTokenizer, AutoModel


def read_json(file_path):
    with open(file_path, 'r') as file:
        data = json.load(file)
    return data


def save_vectors_to_json(vectors, ids, output_file):
    vectors_dict = {str(ids[i]): vectors[i].tolist() for i in range(len(ids))}
    with open(output_file, 'w') as file:
        json.dump(vectors_dict, file)


def bert_embed(text, model, tokenizer):
    t = tokenizer(text, padding=True, truncation=True, return_tensors='pt')
    with torch.no_grad():
        model_output = model(**{k: v.to(model.device) for k, v in t.items()})
    embeddings = model_output.last_hidden_state[:, 0, :]
    embeddings = torch.nn.functional.normalize(embeddings)
    return embeddings[0].cpu().numpy()


def main(input_file, output_file):
    tokenizer = AutoTokenizer.from_pretrained("cointegrated/rubert-tiny")
    model = AutoModel.from_pretrained("cointegrated/rubert-tiny")

    data = read_json(input_file)

    print(f'Data size: {len(data)}')
    titles = [entity['title'] for entity in data]
    ids = [entity['id'] for entity in data]

    vectors = [bert_embed(title, model, tokenizer) for title in titles]

    print(f'Vectors size: {len(vectors)}')
    print(f'Vectors dim: {vectors[0].shape}')
    save_vectors_to_json(vectors, ids, output_file)


if __name__ == "__main__":
    input_file = 'data/medical_articles.json'
    output_file = 'vectorized_data/medical_articles_vectors.json'
    main(input_file, output_file)
