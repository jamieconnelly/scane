from django.contrib.auth import authenticate, login
from django.contrib.auth.models import User as UserModel
import graphene
from graphene.relay import Node
from graphene_django.types import DjangoObjectType
from graphql import GraphQLError


class User(DjangoObjectType):
    is_logged_in = graphene.Boolean(required=True)

    def resolve_is_logged_in(self, info, **kwargs):
        return info.context.user.is_authenticated

    class Meta:
        model = UserModel
        only_fields = ('username', 'first_name', 'last_name')


class Query(graphene.ObjectType):
    node = Node.Field()  # required by Relay spec
    me = graphene.Field(User)

    def resolve_me(self, info, **kwargs):
        return info.context.user


class LoginMutation(graphene.relay.ClientIDMutation):
    class Input:
        username = graphene.String(required=True)
        password = graphene.String(required=True)

    me = graphene.Field(User)

    @classmethod
    def mutate_and_get_payload(cls, root, info, **input):
        user = authenticate(
            info.context, username=input['username'], password=input['password']
        )

        if user is None:
            raise GraphQLError('Either the username or password is wrong')

        login(info.context, user)
        return cls(me=user)


class Mutation(graphene.ObjectType):
    user_login = LoginMutation.Field()


schema = graphene.Schema(query=Query, mutation=Mutation)
