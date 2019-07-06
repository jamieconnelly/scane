import { graphql } from 'react-relay'

import { LoginMutationInput, loginMutation } from '__generated__/loginMutation.graphql'
import mutationPromise from 'scane/relay/mutationPromise'

const login = (input: LoginMutationInput) =>
  mutationPromise<loginMutation>({
    mutation: graphql`
      mutation loginMutation($input: LoginMutationInput!) {
        userLogin(input: $input) {
          clientMutationId
        }
      }
    `,
    variables: { input },
  })

export default login
