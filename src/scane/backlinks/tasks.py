from celery import task

from . import backlinks as backlinks_helpers


@task(
    autoretry_for=(Exception,),
    default_retry_delay=60,
    max_retries=5,
    acks_late=True,
    reject_on_worker_lost=True,
)
def get_backlinks(data):
    backlinks_helpers.get_backlinks(data)
