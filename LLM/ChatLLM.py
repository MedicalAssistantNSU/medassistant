import json
import argparse

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
            url: str = 'http://localhost:11435',
            username: str = 'User',
            task='chat',
            config_file='LLM/prompts_config.json'):
        """
        Initialize the ChatLLM class with a task-based system prompt.
        The system prompt is selected based on the task provided.

        :param task: The task for which to load the system prompt (e.g., 'ocr', 'chat').
        :param config_file: Path to the configuration file with system prompts.
        """
        self.base_url = url
        self.context_length = 131072
        self.max_history_length = 3 * self.context_length

        self.generator = OllamaGenerator(
            model="phi",
            url=url,
            streaming_callback=lambda chunk: print(chunk.content, end="", flush=True),
            generation_kwargs={
                "temperature": 0.8,
            }
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
            Document(content="My name is Jean and I live in Paris."),
            Document(content="My name is Mark and I live in Berlin."),
            Document(content="My name is Giorgio and I live in Rome.")
        ])

        self.rag_pipe = Pipeline()
        self.rag_pipe.add_component("retriever", InMemoryBM25Retriever(document_store=document_store))
        self.rag_pipe.add_component("prompt_builder", self.prompt_builder)
        self.rag_pipe.add_component(
            "generator",
            self.generator
        )

        self.rag_pipe.connect("retriever", "prompt_builder.documents")
        self.rag_pipe.connect("prompt_builder", "generator")

    def send_message(self, message: str, history: str) -> dict:
        """
        Method for sending a question from the user to the model.
        Receives both new question and context from previous interactions.
        Parameters will be passed to prompt template and then to the model.

        :param message: message to the model
        :param history: previous interactions
        :return: the answer and updated history for further interactions
        """

        if len(history) > self.max_history_length:
            history = self.contextualize(history)

        answer = self.rag_pipe.run({
            "prompt_builder": {
                "prompt": self.system_prompt,
                "history": history,
                "name": self.username,
                "message": message,
                # "query": message
            },
            "retriever": {
                "query": message,
            }
        })['generator']['replies'][0]

        # print(self.history_builder.run(message=message, name=self.username, answer=answer)['prompt'])
        new_history = (history + self.history_builder.run(message=message, name=self.username, answer=answer)['prompt'])

        if len(new_history) > self.max_history_length:
            new_history = self.contextualize(new_history)

        # print({'answer': answer, 'history': new_history})
        return {'answer': answer, 'history': new_history}

    def contextualize(self, context: str):
        formatted_prompt = self.contextualize_builder.run(
            contextualize_prompt=self.contextualize_prompt,
            context=context,
        )['prompt']
        return self.generator.run(formatted_prompt)


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
