#!/bin/sh

LOCAL_DATABASE_URL=postgres://postgres@localhost:5432/petition
psql "$LOCAL_DATABASE_URL" < "./sql/users.sql"
psql "$LOCAL_DATABASE_URL" < "./sql/signatures.sql"
psql "$LOCAL_DATABASE_URL" < "./sql/profiles.sql"

RUN apt-get update && apt-get install -y curl

ENV SUPERCRONIC_URL=https://github.com/aptible/supercronic/releases/download/v0.1.9/supercronic-linux-amd64 \
    SUPERCRONIC=supercronic-linux-amd64 \
    SUPERCRONIC_SHA1SUM=5ddf8ea26b56d4a7ff6faecdd8966610d5cb9d85

RUN curl -fsSLO "$SUPERCRONIC_URL" \
 && echo "${SUPERCRONIC_SHA1SUM}  ${SUPERCRONIC}" | sha1sum -c - \
 && chmod +x "$SUPERCRONIC" \
 && mv "$SUPERCRONIC" "/usr/local/bin/${SUPERCRONIC}" \
 && ln -s "/usr/local/bin/${SUPERCRONIC}" /usr/local/bin/supercronic
