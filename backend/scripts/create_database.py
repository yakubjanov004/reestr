import os
import sys
from pathlib import Path

import psycopg2
from dotenv import load_dotenv
from psycopg2 import sql


BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(BASE_DIR / ".env")


def getenv(name, default=None):
    value = os.getenv(name, default)
    if value in (None, ""):
        raise RuntimeError(f"{name} is required in backend/.env")
    return value


def main():
    db_name = getenv("POSTGRES_DB")
    db_user = getenv("POSTGRES_USER")
    db_password = getenv("POSTGRES_PASSWORD")
    host = getenv("POSTGRES_HOST", "127.0.0.1")
    port = getenv("POSTGRES_PORT", "5432")
    admin_db = os.getenv("POSTGRES_ADMIN_DB", "postgres")
    admin_user = os.getenv("POSTGRES_ADMIN_USER", db_user)
    admin_password = os.getenv("POSTGRES_ADMIN_PASSWORD", db_password)

    try:
        connection = psycopg2.connect(
            dbname=admin_db,
            user=admin_user,
            password=admin_password,
            host=host,
            port=port,
        )
    except UnicodeDecodeError as exc:
        raise RuntimeError(
            "PostgreSQL ulanishida xatolik. "
            "backend/.env ichidagi POSTGRES_USER va "
            "POSTGRES_PASSWORD qiymatlarini tekshiring."
        ) from exc
    connection.autocommit = True

    with connection.cursor() as cursor:
        cursor.execute("SELECT 1 FROM pg_roles WHERE rolname = %s", [db_user])
        if cursor.fetchone():
            cursor.execute(
                sql.SQL("ALTER ROLE {} WITH LOGIN PASSWORD %s").format(sql.Identifier(db_user)),
                [db_password],
            )
        else:
            cursor.execute(
                sql.SQL("CREATE ROLE {} WITH LOGIN PASSWORD %s").format(sql.Identifier(db_user)),
                [db_password],
            )

        cursor.execute("SELECT 1 FROM pg_database WHERE datname = %s", [db_name])
        if not cursor.fetchone():
            cursor.execute(
                sql.SQL("CREATE DATABASE {} OWNER {} ENCODING 'UTF8'").format(
                    sql.Identifier(db_name),
                    sql.Identifier(db_user),
                )
            )

        cursor.execute(
            sql.SQL("GRANT ALL PRIVILEGES ON DATABASE {} TO {}").format(
                sql.Identifier(db_name),
                sql.Identifier(db_user),
            )
        )

    connection.close()
    print(f"Database {db_name!r} and user {db_user!r} are ready.")


if __name__ == "__main__":
    try:
        main()
    except Exception as exc:
        print(f"Database creation failed: {exc}", file=sys.stderr)
        sys.exit(1)
