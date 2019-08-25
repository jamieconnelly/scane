import logging
import os
import shutil

from django.conf import settings
from django.core.mail.message import EmailMessage

logger = logging.getLogger(__name__)


def send_export_email():
    logger.info('Sending exports email')

    email = EmailMessage()
    email.subject = 'Here is your export!'
    email.body = (
        'Hi there 👋,\n\n'
        'We have attached your backlink export results to this email.\n\n'
        'Best,\n'
        'Scane'
    )
    email.from_email = settings.DEFAULT_EMAIL_SENDER
    email.reply_to = settings.REPLY_TO_EMAIL
    email.to = [settings.DEFAULT_EMAIL_RECIEVER]

    exports = shutil.make_archive('exports', 'zip', settings.EXPORTS_DIR)
    email.attach_file(exports)
    email.send()
    shutil.rmtree(settings.EXPORTS_DIR)


def send_chunked_txt_files(data):
    logger.info('Sending chunked txt file email')

    email = EmailMessage()
    email.subject = 'Multiple uploads required'
    email.body = (
        'Hi there 👋,\n\n'
        'Unfortunately we can only process 450 urls per day.'
        ' We have began processing the first 450 urls and have'
        ' split the remaining urls into seperate txt files each'
        ' containing 450 urls or less. Please come back in 24'
        ' hours and upload the next file.\n\n'
        'Best,\n'
        'Scane'
    )
    email.from_email = settings.DEFAULT_EMAIL_SENDER
    email.reply_to = settings.REPLY_TO_EMAIL
    email.to = [settings.DEFAULT_EMAIL_RECIEVER]

    file_names = []
    for file_name, urls in data:
        with open(file_name, 'w') as writer:
            for url in urls:
                writer.write(f'{url}\n')
            file_names.append(file_name)

    for f_n in file_names:
        filepath = os.path.join(settings.PROJECT_ROOT_DIR, f_n)
        email.attach_file(filepath)

    email.send()
