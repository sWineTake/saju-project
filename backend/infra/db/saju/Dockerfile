FROM postgres:16-alpine

ENV POSTGRES_DB=sajudb
ENV POSTGRES_USER=sajuuser
ENV POSTGRES_PASSWORD=sajupass

COPY ./init.sql /docker-entrypoint-initdb.d/
