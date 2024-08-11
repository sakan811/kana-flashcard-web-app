#!/usr/bin/env bash

host="$1"
shift
cmd="$*"

until pg_isready -h "$host"; do
  echo "Postgres is unavailable - sleeping"
  sleep 1
done

echo "Postgres is up - executing command"
exec "$cmd"