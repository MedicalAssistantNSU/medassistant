import json
import argparse
import sys

from haystack.document_stores.in_memory import InMemoryDocumentStore
from haystack import Pipeline, Document
from haystack.components.retrievers.in_memory import InMemoryBM25Retriever
from haystack.components.builders import PromptBuilder
from haystack_integrations.components.generators.ollama import OllamaGenerator


"""
Usage: python3 LLM/ChatLLM.py <url> <username> <message> <history>
Output: None (everything now goes to stdout)
"""


class ChatLLM:
    def __init__(
            self,
            # url: str = 'http://host.docker.internal:11435',
            url: str = 'http://localhost:11435',
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

        document_store = InMemoryDocumentStore()
        document_store.write_documents([
            Document(content="Medical assistant is a helpful chatbot."),
        ])

        # Files for RAG should be .txt with one json at one line
        # jsons with args [id, contents]
        # rag_files = [f for f in listdir(rag_docs_path) if isfile(join(rag_docs_path, f))]
        # for rag_filename in rag_files:
        #     with open(f'{rag_docs_path}/{rag_filename}', 'r') as rag_file:
        #         for line in rag_file.readlines():
        #             doc = json.loads(line)
        #             document_store.write_documents([
        #                 Document(
        #                     id=doc['id'],
        #                     content=doc['contents'],
        #                     # embedding=
        #                 )
        #             ])
        #             # print(f'{rag_filename} id={doc["id"]} loaded')

        # print("RAG DOCS LOADED")

        self.rag_pipe = Pipeline()
        self.rag_pipe.add_component(
            "retriever",
            InMemoryBM25Retriever(
                document_store=document_store,
                top_k=1,
                # scale_score=True
            )
        )
        self.rag_pipe.add_component("prompt_builder", self.prompt_builder)
        self.rag_pipe.add_component(
            "generator",
            self.generator
        )

        self.rag_pipe.connect("retriever", "prompt_builder.documents")
        self.rag_pipe.connect("prompt_builder", "generator")

        self.contextualize_pipe = Pipeline()
        self.contextualize_pipe.add_component("context_prompt_builder", self.contextualize_builder)
        self.contextualize_pipe.add_component(
            "contextualize_generator",
            self.contextualize_generator
        )
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
            "retriever": {
                "query": message,
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
    model.send_message(args.message, args.history)


if __name__ == "__main__":
    main()

# python3 LLM/ChatLLM.py http://localhost:11435 name "Расскажи анекдот" ""
