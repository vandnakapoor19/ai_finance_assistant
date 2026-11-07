import os
from pathlib import Path

from dotenv import load_dotenv
from openai import OpenAI

PROJECT_ROOT = Path(__file__).resolve().parents[2]
load_dotenv(PROJECT_ROOT / ".env")

client = OpenAI(
    timeout=30.0,
    max_retries=1,
)

MODEL = os.getenv("OPENAI_MODEL", "gpt-4.1-mini")