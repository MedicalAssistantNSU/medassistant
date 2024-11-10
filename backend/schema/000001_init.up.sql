CREATE TABLE users
(
    id            serial       not null unique,
    name          varchar(255) not null,
    username      varchar(255) not null unique,
    password_hash varchar(255) not null
);

CREATE TABLE chats
(
    id          serial       not null unique,
    name        varchar(255) not null,
    context     text
);

CREATE TABLE user_chats
(
    id      serial                                           not null unique,
    user_id int references users (id) on delete cascade      not null,
    chat_id int references chats (id) on delete cascade not null
);

CREATE TABLE messages
(
    id          serial       not null unique,
    content     text,
    sender_id   serial       not null, 
    type        varchar(256) not null,
    created_at  varchar(256)
);


CREATE TABLE chat_messages
(
    id          serial                                           not null unique,
    message_id  int references messages (id) on delete cascade not null,
    chat_id     int references chats (id) on delete cascade not null
);