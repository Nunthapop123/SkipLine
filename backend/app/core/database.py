import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv

# Load the environment variables from your .env file
load_dotenv()

# Get the Postgres URL
SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL")

# Create the SQLAlchemy Engine 
engine = create_engine(SQLALCHEMY_DATABASE_URL)

# Create a Session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create a Base class
Base = declarative_base()

# Dependency to get the DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()