"""Modular 2D Studio API foundation. Character processing routes belong to Character Engine integration."""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

app = FastAPI(title="Modular 2D Comic Studio API", version="0.1.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=False,
    allow_methods=["GET"],
    allow_headers=["Content-Type"],
)

class HealthResponse(BaseModel):
    status: str = Field(default="ok")
    service: str = Field(default="comic-studio-api")
    version: str = Field(default="0.1.0")

@app.get("/api/health", response_model=HealthResponse)
def health() -> HealthResponse:
    return HealthResponse()

@app.get("/api/capabilities")
def capabilities() -> dict:
    return {
        "product": "static-comic-image-only",
        "api_version": "0.1.0",
        "ready": ["health"],
        "planned": ["asset-registry", "project-storage", "character-processing-adapter"],
        "video": False,
    }
