import json
import argparse
# import pickle
import sys
import time
import logging
from haystack.document_stores.in_memory import InMemoryDocumentStore
from haystack import Pipeline, Document
from haystack.components.retrievers.in_memory import InMemoryBM25Retriever
from haystack.components.builders import PromptBuilder
from haystack_integrations.components.generators.ollama import OllamaGenerator
# from os.path import isfile, join

# from haystack.components.embedders import SentenceTransformersTextEmbedder
# from haystack.components.retrievers import InMemoryEmbeddingRetriever
# from haystack.document_stores.in_memory import InMemoryDocumentStore

# from LLM.RAG_utils.vectorize_utils import vectorized_storage


# Set up logging
logger = logging.getLogger("medass")
# logging.basicConfig(
#     level=logging.INFO,
#     format='%(asctime)s - %(levelname)s - %(message)s'
# )

"""
Usage: python3 LLM/ChatLLM.py <url> <username> <message> <history>
Output: None (everything now goes to stdout)
"""


class ChatLLM:
    def __init__(
            self,
            #url: str = 'http://host.docker.internal:11435',
            url: str = 'http://localhost:11435',
            username: str = 'User',
            task='chat',
            # config_file='../LLM/prompts_config.json',
            # rag_docs_path='../LLM/RAG_docs',
            # # For ChatLLM tests:
            config_file='LLM/prompts_config.json',
            rag_docs_path='LLM/RAG_docs',
    ):
        """
        Initialize the ChatLLM class with a task-based system prompt.
        The system prompt is selected based on the task provided.

        :param task: The task for which to load the system prompt (e.g., 'ocr', 'chat').
        :param config_file: Path to the configuration file with system prompts.
        """

        start_time = time.time()
        logger.debug("Initializing ChatLLM...")

        self.base_url = url
        self.context_length = 1024
        self.max_history_length = 5 * self.context_length

        self.generator = OllamaGenerator(
            model="phi",
            url=url,
            # For ChatLLM tests:
            # streaming_callback=lambda chunk: print(chunk.content, file=sys.stderr, end="", flush=True),
            generation_kwargs={"temperature": 0.8},
            timeout=300,
        )

        self.contextualize_generator = OllamaGenerator(
            model="phi",
            url=url,
            # For ChatLLM tests:
            # streaming_callback=lambda chunk: print(chunk.content, file=sys.stderr, end="", flush=True),
            generation_kwargs={"temperature": 0.8},
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
            
            You are talking with a person {{name}} with this profile info: {{info}}

            The previous dialog:
            {{history}}

            Medical document:
            <|start_of_document|>
            {{document}}
            <|end_of_document|>

            Please, answer to this message from {{name}}: {{message}}
            """

        self.prompt_builder = PromptBuilder(
            template=self.prompt_template,
            required_variables=["prompt", "name", "info", "history", "document", "message"]
        )

        self.history_template = """
            {{name}}: {{message}}
            MedAssistant: {{answer}}
            """
        self.history_builder = PromptBuilder(
            template=self.history_template,
            required_variables=["name", "message", "answer"]
        )

        self.contextualize_template = """
            {{contextualize_prompt}}
            Chat history: {{context}}
            """
        self.contextualize_builder = PromptBuilder(
            template=self.contextualize_template,
            required_variables=["contextualize_prompt", "context"]
        )

        # RAG
        # if isfile(join(rag_docs_path, "vectorized.pkl")):
        #     with open(join(rag_docs_path, "vectorized.pkl"), "rb") as f:
        #         documents_with_embeddings = pickle.load(f)
        #     document_store = InMemoryDocumentStore(embedding_similarity_function="cosine")
        #     document_store.write_documents(documents_with_embeddings)
        # else:
        #     document_store = vectorized_storage(rag_docs_path)
        #
        # print(f"STORE: {document_store.count_documents()}", file=sys.stderr)
        self.rag_pipe = Pipeline()
        # self.rag_pipe.add_component(
        #     "text_embedder",
        #     SentenceTransformersTextEmbedder()
        # )
        # self.rag_pipe.add_component(
        #     "retriever",
        #     InMemoryEmbeddingRetriever(
        #         document_store=document_store,
        #         top_k=1
        #     )
        # )
        self.rag_pipe.add_component("prompt_builder", self.prompt_builder)
        self.rag_pipe.add_component("generator", self.generator)

        self.contextualize_pipe = Pipeline()
        self.contextualize_pipe.add_component("context_prompt_builder", self.contextualize_builder)

        self.contextualize_pipe.add_component(
            "contextualize_generator",
            self.contextualize_generator
        )

        # self.rag_pipe.connect("text_embedder.embedding", "retriever.query_embedding")
        # self.rag_pipe.connect("retriever", "prompt_builder.documents")
        self.rag_pipe.connect("prompt_builder", "generator")

        self.contextualize_pipe.connect("context_prompt_builder", "contextualize_generator")

        logger.debug("ChatLLM initialization completed in %.2f seconds", time.time() - start_time)

    def send_message(self, message: str = "", document: str = "", history: str = "", info: str = "") -> dict:
        """
        Method for sending a question from the user to the model.
        Receives both new question and context from previous interactions.
        Parameters will be passed to prompt template and then to the model.

        :param document: OCR result
        :param message: message to the model
        :param history: previous interactions
        :return: the answer and updated history for further interactions
        """

        logger.debug(f"INPUT HISTORY: {history}")
        logger.debug("END OF INPUT HISTORY")
        logger.debug(f"LEN OF HISTORY: {len(history)}")

        start_time = time.time()
        logger.debug("Processing message from user...")

        if len(history) > self.max_history_length:
            logger.debug("Max history length exceeded. Running contextualization.")
            history = self.contextualize(history)

        answer_full = self.rag_pipe.run({
            "prompt_builder": {
                "prompt": self.system_prompt,
                "history": history,
                "info": info,
                "document": "There is no medical document for this question" if document is None else document,
                "name": self.username,
                "message": message,
                # "query": message
            },
            # "text_embedder": {
            #     "text": message,
            # }
        })
        answer = answer_full['generator']['replies'][0]

        if document is None or len(document) == 0:
            new_history = (history + self.history_builder.run(message=message, name=self.username, answer=answer)['prompt'])
        else:
            new_history = (
                    f"Medical document: {document}\n{history}\n" + self.history_builder.run(message=message, name=self.username, answer=answer)['prompt']
            )

        if len(new_history) > self.max_history_length:
            logger.debug("After generating, max history length exceeded. Running contextualization.")
            new_history = self.contextualize(new_history)

        logger.debug("Message processed in %.2f seconds", time.time() - start_time)
        return {'answer': answer, 'history': new_history}

    def contextualize(self, context: str):
        start_time = time.time()
        logger.debug("Contextualizing history...")

        answer_full = self.contextualize_pipe.run({
            "context_prompt_builder": {
                "contextualize_prompt": self.contextualize_prompt,
                "context": context,
            }
        })
        answer = answer_full['contextualize_generator']['replies'][0]

        logger.debug("Contextualization completed in %.2f seconds", time.time() - start_time)
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
