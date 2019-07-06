import { graphql } from 'react-relay'

import { uploadBacklinkFilesMutation } from '__generated__/uploadBacklinkFilesMutation.graphql'
import mutationPromise from 'scane/relay/mutationPromise'

type Uploadables = { [key: string]: File }

const uploadBacklinkTargetFiles = (uploadables: Uploadables) =>
  mutationPromise<uploadBacklinkFilesMutation>({
    mutation: graphql`
      mutation uploadBacklinkFilesMutation($input: UploadBacklinkFilesInput!) {
        uploadBacklinkFiles(input: $input) {
          clientMutationId
        }
      }
    `,
    uploadables,
    variables: { input: {} },
  })

export default uploadBacklinkTargetFiles
