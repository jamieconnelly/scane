from django.contrib.auth import authenticate, login
from django.contrib.auth.models import User as UserModel
import graphene
from graphene.relay import Node
from graphene_django.types import DjangoObjectType
from graphql import GraphQLError

from scane.backlinks import tasks


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
        if info.context.user.is_authenticated:
            return info.context.user
        else:
            return None


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


class UploadBacklinkFiles(graphene.ClientIDMutation):
    class Input:
        pass

    @classmethod
    def mutate_and_get_payload(cls, root, info, **input):
        if len(info.context.FILES) > 1:
            raise GraphQLError('Cannot upload multiple files')

        name, file = info.context.FILES.popitem()
        urls = [url.decode('utf-8') for url in file[0].read().splitlines()]

        chunk_size = 450
        file_name_urls = []
        for i in range(0, len(urls), chunk_size):
            file_name = name if i == 0 else f'input_{int(i/chunk_size)}_{name}'
            file_name_urls.append((file_name, urls[i : i + chunk_size]))

        if len(file_name_urls) > 1:
            from scane.mails import mails

            mails.send_chunked_txt_files(file_name_urls[1:])

        tasks.get_backlinks.delay(file_name_urls[0])

        return cls()


class Mutation(graphene.ObjectType):
    user_login = LoginMutation.Field()
    upload_backlink_files = UploadBacklinkFiles.Field()


schema = graphene.Schema(query=Query, mutation=Mutation)
