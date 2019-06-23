import graphene


class Query(graphene.ObjectType):
    me = graphene.String()

    def resolve_me(self, info, **kwargs):
        return 'hello world'


schema = graphene.Schema(query=Query)
