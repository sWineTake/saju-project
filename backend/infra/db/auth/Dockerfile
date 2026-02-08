FROM postgres:16-alpine

ENV POSTGRES_DB=authdb
ENV POSTGRES_USER=authuser
ENV POSTGRES_PASSWORD=authpass

COPY ./init.sql /docker-entrypoint-initdb.d/
