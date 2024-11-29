FROM golang:1.23-alpine

RUN mkdir /app

ADD . /app

WORKDIR /app

EXPOSE "8080"

RUN go build -o main cmd/main.go

CMD ["/app/main"]