import json
import argparse
import pickle
import sys
from os.path import isfile, join

from haystack.components.embedders import SentenceTransformersTextEmbedder
from haystack.components.retrievers import InMemoryEmbeddingRetriever
from haystack.document_stores.in_memory import InMemoryDocumentStore
from haystack import Pipeline
from haystack.components.builders import PromptBuilder
from haystack_integrations.components.generators.ollama import OllamaGenerator

from LLM.RAG_utils.vectorize_utils import vectorized_storage

"""
Usage: python3 LLM/ChatLLM.py <url> <username> <message> <history>
Output: None (everything now goes to stdout)
"""


class ChatLLM:
    def __init__(
            self,
            url: str = 'http://host.docker.internal:11435',
            # url: str = 'http://localhost:11435',
            username: str = 'User',
            task='chat',
            config_file='../LLM/prompts_config.json',
            rag_docs_path='../LLM/RAG_docs',
            # # For ChatLLM tests:
            # config_file='LLM/prompts_config.json',
            # rag_docs_path='LLM/RAG_docs',
    ):
        """
        Initialize the ChatLLM class with a task-based system prompt.
        The system prompt is selected based on the task provided.

        :param task: The task for which to load the system prompt (e.g., 'ocr', 'chat').
        :param config_file: Path to the configuration file with system prompts.
        """
        self.base_url = url
        self.context_length = 1024
        self.max_history_length = 5 * self.context_length

        self.generator = OllamaGenerator(
            model="phi",
            url=url,
            # For ChatLLM tests:
            streaming_callback=lambda chunk: print(chunk.content, file=sys.stderr, end="", flush=True),
            generation_kwargs={
                "temperature": 0.8,
            },
            timeout=300,
        )

        self.contextualize_generator = OllamaGenerator(
            model="phi",
            url=url,
            # For ChatLLM tests:
            streaming_callback=lambda chunk: print(chunk.content, file=sys.stderr, end="", flush=True),
            generation_kwargs={
                "temperature": 0.8,
            },
            timeout=300,
        )

        self.username = username

        with open(config_file, 'r') as file:
            prompts = json.load(file)

        self.system_prompt = prompts.get(task)
        self.contextualize_prompt = prompts.get('contextualize')

        self.prompt_template = """
            {{prompt}}

            Also you have these documents:
            {% for doc in documents %}
                {{ doc.content }}
            {% endfor %}

            The previous dialog:
            {{history}}

            Medical document:
            <|start_of_document|>
            {{document}}
            <|end_of_document|>

            Please, answer to this message from {{name}}: {{message}}
            """

        self.prompt_builder = PromptBuilder(template=self.prompt_template)

        self.history_template = """
            {{name}}: {{message}}
            MedAssistant: {{answer}}
            """
        self.history_builder = PromptBuilder(template=self.history_template)

        self.contextualize_template = """
            {{contextualize_prompt}}
            Chat history: {{context}}
            """
        self.contextualize_builder = PromptBuilder(template=self.contextualize_template)

        # RAG
        if isfile(join(rag_docs_path, "vectorized.pkl")):
            with open(join(rag_docs_path, "vectorized.pkl"), "rb") as f:
                documents_with_embeddings = pickle.load(f)
            document_store = InMemoryDocumentStore(embedding_similarity_function="cosine")
            document_store.write_documents(documents_with_embeddings)
        else:
            document_store = vectorized_storage(rag_docs_path)

        print(f"STORE: {document_store.count_documents()}")
        self.rag_pipe = Pipeline()
        self.rag_pipe.add_component(
            "text_embedder",
            SentenceTransformersTextEmbedder()
        )
        self.rag_pipe.add_component(
            "retriever",
            InMemoryEmbeddingRetriever(
                document_store=document_store,
                top_k=1
            )
        )
        self.rag_pipe.add_component("prompt_builder", self.prompt_builder)
        self.rag_pipe.add_component(
            "generator",
            self.generator
        )

        self.contextualize_pipe = Pipeline()
        self.contextualize_pipe.add_component("context_prompt_builder", self.contextualize_builder)
        self.contextualize_pipe.add_component(
            "contextualize_generator",
            self.contextualize_generator
        )

        self.rag_pipe.connect("text_embedder.embedding", "retriever.query_embedding")
        self.rag_pipe.connect("retriever", "prompt_builder.documents")
        self.rag_pipe.connect("prompt_builder", "generator")

        self.contextualize_pipe.connect("context_prompt_builder", "contextualize_generator")

    def send_message(
            self,
            message: str,
            document: str,
            history: str,
    ) -> dict:
        """
        Method for sending a question from the user to the model.
        Receives both new question and context from previous interactions.
        Parameters will be passed to prompt template and then to the model.

        :param document: OCR result
        :param message: message to the model
        :param history: previous interactions
        :return: the answer and updated history for further interactions
        """

        print(f"(ChatLLM) INPUT HISTORY: {history}", file=sys.stderr)
        print("\n", file=sys.stderr)
        print("(ChatLLM) END OF INPUT HISTORY", file=sys.stderr)
        print(f"(ChatLLM) LEN OF HISTORY: {len(history)}", file=sys.stderr)

        if len(history) > self.max_history_length:
            print("(ChatLLM) max history len exceeded, running contextualize", file=sys.stderr)
            history = self.contextualize(history)

        answer_full = self.rag_pipe.run({
            "prompt_builder": {
                "prompt": self.system_prompt,
                "history": history,
                "document": "There is no medical document for this question" if document is None else document,
                "name": self.username,
                "message": message,
                # "query": message
            },
            "text_embedder": {
                "text": message,
            }
        })
        answer = answer_full['generator']['replies'][0]

        new_history = (history + self.history_builder.run(message=message, name=self.username, answer=answer)['prompt'])

        if len(new_history) > self.max_history_length:
            print(
                f"(ChatLLM) After generating max history len exceeded ({len(new_history)}), running contextualize",
                file=sys.stderr
            )
            new_history = self.contextualize(new_history)

        return {'answer': answer, 'history': new_history}

    def contextualize(self, context: str):
        answer_full = self.contextualize_pipe.run({
            "context_prompt_builder": {
                "contextualize_prompt": self.contextualize_prompt,
                "context": context,
            }
        })
        answer = answer_full['contextualize_generator']['replies'][0]
        return answer


def main():
    parser = argparse.ArgumentParser(description="Sending and receiving messages to/from model on localhost")
    parser.add_argument('url', type=str, help="Url that model is hosted on")
    parser.add_argument('username', type=str, help="Username that will be shown in chat")
    parser.add_argument('message', type=str, default='', help="Message from user")
    parser.add_argument('history', type=str, default='', help="History of interactions, fully handled by this script")
    args = parser.parse_args()

    model = ChatLLM(
        url=args.url,
        username=args.username
    )
    model.send_message(args.message, "", args.history)


if __name__ == "__main__":
    main()

# PYTHONPATH=. python3 LLM/ChatLLM.py http://localhost:11435 name "Расскажи анекдот" ""
