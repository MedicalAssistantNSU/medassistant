Preparations:
* llamafile.exe: https://github.com/Mozilla-Ocho/llamafile/releases (just download the latest release)
* Make llamafile.exe executable
* Download .gguf model file from here: https://huggingface.co/bartowski/Phi-3.5-mini-instruct-GGUF/tree/main (Phi-3.5-mini-instruct-Q8_0.gguf)

To run the code:
* Start the model in server mode (specify the ip and the port): `llamafile.exe -m Phi-3.5-mini-instruct-Q8_0.gguf --server --host ip.ip.ip.ip:port --nobrowser`
* Run `test.py` ot call methods from `ChatLLM` from your own script