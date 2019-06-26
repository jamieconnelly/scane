import { graphql } from 'react-relay'

import mutationPromise from './relay/mutationPromise'
import {
  LoginMutationInput,
  mutationsLoginMutation,
} from './__generated__/mutationsLoginMutation.graphql'

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
