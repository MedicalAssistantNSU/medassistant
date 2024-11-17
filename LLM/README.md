Preparations:
* Install Ollama from https://github.com/ollama/ollama?tab=readme-ov-file
* Import model from .gguf: command from the root og the project `ollama create phi -f LLM/llm_gguf/Modelfile`


To run the model:
* Specify the host with env: `OLLAMA_HOST=127.0.0.1:11435`
* `ollama serve` to start ollama server
* Prev command can be merged: `OLLAMA_HOST=127.0.0.1:11435 ollama serve`
* Then in request from ChatLLM the model `phi` will be called

If Ollama server still running, you need to stop the whole Ollama (MacOS): `osascript -e 'tell app "Ollama" to quit'`
