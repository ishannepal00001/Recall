from dotenv import load_dotenv
import os
from functools import cache

print(load_dotenv())


class config:
    database_url = os.getenv("DATABASE_URL")


@cache
def get_env():
    settings = config()
    return settings
