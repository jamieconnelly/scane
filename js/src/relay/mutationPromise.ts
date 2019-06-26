import { commitMutation } from 'react-relay'
import { MutationConfig, OperationType } from 'relay-runtime'

import environment from './environment'

function mutationPromise<T extends OperationType>(mutationParams: MutationConfig<T>) {
  return new Promise<T['response']>((resolve, reject) => {
    commitMutation(environment, {
      ...mutationParams,
      onCompleted: (response, errors) => {
        if (errors) {
          reject({ message: errors.map(({ message }) => message).join(', ') })
        }
        resolve(response)
      },
      onError: (err) => reject(err),
    })
  })
}

export default mutationPromise
