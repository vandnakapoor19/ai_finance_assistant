from fastapi import FastAPI, HTTPException
from openai import (
    APIConnectionError,
    APIStatusError,
    AuthenticationError,
    RateLimitError,
)
from pydantic import BaseModel, Field
from typing import Literal

from src.agents.finance_qa import answer_finance_question

app = FastAPI(title="Finnie API")


class FinanceQuestion(BaseModel):
    question: str = Field(
        min_length=1,
        max_length=4000,
    )


class FinanceAnswer(BaseModel):
    answer: str


@app.get("/api/health")
def health_check():
    return {
        "status": "ok",
        "message": "Finnie backend is running",
    }


@app.post("/api/finance-qa", response_model=FinanceAnswer)
def finance_qa(request: FinanceQuestion):
    question = request.question.strip()

    if not question:
        raise HTTPException(
            status_code=422,
            detail="Please enter a question.",
        )

    try:
        answer = answer_finance_question(question)
        return FinanceAnswer(answer=answer)

    except AuthenticationError:
        raise HTTPException(
            status_code=503,
            detail="OpenAI authentication failed. Check the backend API key.",
        ) from None

    except RateLimitError:
        raise HTTPException(
            status_code=429,
            detail="OpenAI usage or rate limit reached. Check API quota or retry later.",
        ) from None

    except APIConnectionError:
        raise HTTPException(
            status_code=503,
            detail="Unable to reach OpenAI. Please try again.",
        ) from None

    except (APIStatusError, ValueError) as error:
        if isinstance(error, APIStatusError):
            print("OpenAI status:", error.status_code)
            print("OpenAI error:", error.body)
        else:
            print("Response error:", str(error))

        raise HTTPException(
            status_code=502,
            detail="Unable to generate an answer. Check the backend terminal.",
        ) from None