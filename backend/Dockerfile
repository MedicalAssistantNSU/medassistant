FROM ubuntu:24.04
RUN apt update
RUN apt -y upgrade

RUN apt install -y software-properties-common
RUN add-apt-repository ppa:deadsnakes/ppa
RUN apt -y upgrade
RUN apt update && apt-get install ffmpeg libsm6 libxext6  -y

RUN apt install -y python3.9
RUN apt install -y pip

RUN mkdir -p /app/backend
RUN mkdir -p /app/CV
RUN mkdir -p /app/LLM

ADD backend/ /app/backend

ADD CV/ /app/CV/
ADD LLM/ /app/LLM/
ADD inference.py /app/
ADD requirements.txt /app/

WORKDIR /app


RUN apt install wget

RUN wget https://github.com/JaidedAI/EasyOCR/releases/download/v1.6.1/cyrillic_g2.zip
RUN wget https://github.com/JaidedAI/EasyOCR/releases/download/pre-v1.1.6/craft_mlt_25k.zip
RUN mkdir ~/.EasyOCR
RUN mkdir ~/.EasyOCR/model

RUN apt install unzip

RUN unzip cyrillic_g2.zip -d ~/.EasyOCR/model
RUN unzip craft_mlt_25k.zip -d ~/.EasyOCR/model

RUN apt install -y python3.9-venv
RUN python3.9 -m venv venv
RUN . /app/venv/bin/activate
RUN /app/venv/bin/pip install -r requirements.txt 
RUN ["/bin/bash", "-c", "source venv/bin/activate"]
ENV PATH="/app/venv/bin:$PATH"

RUN apt install -y golang-go

WORKDIR /app/backend/

EXPOSE "8080"

RUN go build -o main cmd/main.go

CMD ["/app/backend/main"]