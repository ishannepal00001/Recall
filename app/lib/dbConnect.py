from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from .settings import get_env

config = get_env()

engine = create_engine(
    str(config.database_url), connect_args={"check_same_thread": False}
)
sessionLocal = sessionmaker(bind=engine, autoflush=False)

base = declarative_base()


def get_db():
    try:
        db = get_db()
        yield db
    finally:
        db.close()
