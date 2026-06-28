import os
import sys
from celery import Celery

# Add api directory to python path for Celery imports
api_dir = os.path.dirname(os.path.abspath(__file__))
if api_dir not in sys.path:
    sys.path.append(api_dir)

# Load Redis URL from environment variables, defaulting to local redis
redis_url = os.environ.get("REDIS_URL", "redis://localhost:6379")

app = Celery(
    'recruiter_x',
    broker=redis_url,
    backend=redis_url,
)

# Register task modules dynamically
import tasks.parse
import tasks.analyze
import tasks.report

app.conf.update(
    task_serializer='json',
    result_serializer='json',
    accept_content=['json'],
    task_acks_late=True,             # Job only removed from queue on success
    task_reject_on_worker_lost=True, # Re-queue if worker crashes mid-job
    task_track_started=True,
    result_expires=3600,             # Job results kept 1 hour
    
    # Priority queues setup
    task_queues={
        'parse':    {'exchange': 'parse',    'routing_key': 'parse'},
        'analyze':  {'exchange': 'analyze',  'routing_key': 'analyze'},
        'report':   {'exchange': 'report',   'routing_key': 'report'},
        'priority': {'exchange': 'priority', 'routing_key': 'priority'},
    },
    task_default_queue='analyze',
    
    # Rate limiting (applies per worker instance)
    task_annotations={
        'tasks.analyze_candidate': {'rate_limit': '30/m'},
    },
)
