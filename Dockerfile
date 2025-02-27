# Use the official Postgres image
FROM postgres:latest

# Set environment variables for Postgres
ENV POSTGRES_DB=credential
ENV POSTGRES_USER=test
ENV POSTGRES_PASSWORD=test

# Copy initialization scripts
COPY init.sql /docker-entrypoint-initdb.d/

# Expose the Postgres port
EXPOSE 5432