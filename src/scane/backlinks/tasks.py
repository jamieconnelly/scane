from celery import shared_task

from . import backlinks as backlinks_helpers


@shared_task
def get_backlinks(data):
    backlinks_helpers.get_backlinks(data)
