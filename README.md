# APDP — DrugRAG System

A FastAPI backend that analyses drug-food, drug-herb, and drug-drug interactions through natural language queries. The system uses a LangGraph-powered multi-agent pipeline to extract interaction entities, retrieve structured data from PostgreSQL, and return clinically formatted responses with a Next.js chat interface for querying drug-food, drug-herb, and drug-drug interactions. Users ask natural language questions and receive clinically formatted responses powered by the APDP backend pipeline. 


## Tech Stack

- **Framework:** FastAPI with async architecture, Next.js 14+ (App Router)
- **Agent Pipeline:** LangGraph with Human-in-the-Loop (HITL) via `interrupt()`
- **LLMs:** Google Gemini 2.5 Flash (query analysis and response formatting)
- **Database:** PostgreSQL via Supabase (interaction data + checkpointing)
- **Observability:** LangSmith for tracing
- **Deployment:** Docker → GitHub Actions → Docker Hub → Render
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Deployment:** Vercel


## Features
- Natural language querying for drug-drug, drug-food, and drug-herb interactions
- Agentic AI pipeline built using LangGraph
- Human-in-the-Loop (HITL) workflow for spelling correction and query confirmation
- Structured retrieval from PostgreSQL knowledge base
- Clinically formatted and user-friendly responses
- Query caching for improved performance
- End-to-end deployment with Docker and CI/CD


## System Architecture
- Client Layer (Next.js) – Chat-based interface for user interaction.
- Backend Layer (FastAPI) – API orchestration and agent execution.
- Agentic AI Layer (LangGraph) – Query analysis, retrieval, and response formatting agents.
- Data Layer (PostgreSQL/Supabase) – Interaction knowledge base and checkpoint storage.
Workflow
- User submits a natural language query.
- Query Analyzer Agent extracts drugs, foods, herbs, and interaction type.
If spelling issues are detected, user confirmation is requested.
Retrieval Agent fetches relevant interaction data from PostgreSQL.
Response Formatter Agent generates a clinically structured response.
Final response is displayed in the chat interface.


## Repository Structure
```
├── drug_detection_rag_chatbot_frontend/      # Next.js application
├── drug_detection_rag_chatbot_backend/       # FastAPI backend and LangGraph agents
├── README.md
└── requirements.txt
```