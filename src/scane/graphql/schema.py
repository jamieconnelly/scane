import graphene
from graphene.relay import Node


class Query(graphene.ObjectType):
    node = Node.Field()  # required by Relay spec
    me = graphene.String()

    def resolve_me(self, info, **kwargs):
        return 'hello world'


schema = graphene.Schema(query=Query)
