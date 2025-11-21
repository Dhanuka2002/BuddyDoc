from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import health
from .orchestrator import router as orchestrator_router
from .clients.neo4j_client import close_neo4j_client

app = FastAPI(title="BuddyDoc Backend - FastAPI with Orchestrator")

# CORS - adjust origins for production
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # TODO: restrict to your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router, prefix="/health", tags=["health"])
app.include_router(orchestrator_router, prefix="/orchestrator", tags=["orchestrator"])


@app.get('/')
def root():
    return {"message": "BuddyDoc FastAPI backend with orchestrator is running"}


@app.on_event("shutdown")
async def shutdown_event():
    """Close database connections on shutdown."""
    await close_neo4j_client()
