# monitoring/metrics.py
from prometheus_client import Counter, Histogram

retry_analyse_total = Counter(
    name="retry_analyse_total",
    documentation="Number of times the retry_analyse self-correction loop fired",
    labelnames=["reason"]
)

interrupt_loop_total = Counter(
    name="interrupt_loop_total",
    documentation="Number of times an interrupt loop was triggered",
    labelnames=["loop_type"]  # "spelling_correction" or "clarification"
)

query_type_total = Counter(
    name="query_type_total",
    documentation="Distribution of query types received",
    labelnames=["interaction_type"]  # "drug-drug", "drug-food", "drug-herb"
)

db_checkpoint_failure_total = Counter(
    name="db_checkpoint_failure_total",
    documentation="Number of failed writes to Supabase during interrupt state checkpointing"
)

gemini_call_duration_seconds = Histogram(
    name="gemini_call_duration_seconds",
    documentation="Time taken for Gemini API calls in the formatter node",
    buckets=[0.5, 1, 2, 5, 10, 20, 30]
)

interrupt_resume_duration_seconds = Histogram(
    name="interrupt_resume_duration_seconds",
    documentation="Time between an interrupt firing and the user resuming it",
    labelnames=["loop_type"],
    buckets=[5, 15, 30, 60, 120, 300]
)

cold_start_duration_seconds = Histogram(
    name="cold_start_duration_seconds",
    documentation="Time from first request after Render idle to first successful response",
    buckets=[5, 10, 20, 30, 45, 60, 90]
)