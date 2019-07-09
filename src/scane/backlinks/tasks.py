from celery import task

from . import backlinks as backlinks_helpers


@task(acks_late=True, reject_on_worker_lost=True)
def get_backlinks(data):
    backlinks_helpers.get_backlinks(data)
