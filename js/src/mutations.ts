import { graphql } from 'react-relay'

import {
  LoginMutationInput,
  mutationsLoginMutation,
} from '__generated__/mutationsLoginMutation.graphql'
import mutationPromise from 'scane/relay/mutationPromise'

const login = (input: LoginMutationInput) =>
  mutationPromise<mutationsLoginMutation>({
    mutation: graphql`
      mutation mutationsLoginMutation($input: LoginMutationInput!) {
        userLogin(input: $input) {
          clientMutationId
        }
      }
    `,
    variables: { input },
  })

export default login
