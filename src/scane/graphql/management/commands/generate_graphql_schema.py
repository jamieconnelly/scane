from django.conf import settings
from django.core.management.base import BaseCommand
from graphql.utils import schema_printer

from scane.graphql.schema import schema


class Command(BaseCommand):
    help = 'Generates graphql schema'

    def handle(self, *args, **options):
        schema_str = schema_printer.print_schema(schema)
        with open(f'{settings.JS_DIR}/schema.graphql', "w") as schema_file:
            schema_file.write(schema_str)
