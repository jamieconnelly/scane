import {
  CacheConfig,
  Environment,
  Network,
  RecordSource,
  Store,
  RequestParameters,
  UploadableMap,
  Variables,
} from 'relay-runtime'

const fetchQuery = async (
  operation: RequestParameters,
  variables: Variables,
  _: CacheConfig,
  uploadables: UploadableMap | null | undefined,
) => {
  let request: any = {
    method: 'POST',
  }

  if (uploadables && operation.text) {
    // @ts-ignore: FormData does not exist error
    if (!window.FormData) {
      throw new Error('Uploading files without `FormData` not supported.')
    }
    console.log(uploadables)
    const formData = new FormData()
    formData.append('query', operation.text)
    formData.append('variables', JSON.stringify(variables))

    Object.keys(uploadables).forEach((key) => {
      if (Object.prototype.hasOwnProperty.call(uploadables, key)) {
        console.log(uploadables[key])
        formData.append(key, uploadables[key])
      }
    })

    request.body = formData
  } else {
    request.headers = { 'Content-Type': 'application/json' }
    request.body = JSON.stringify({
      query: operation.text,
      variables,
    })
  }

  const res = await fetch('/graphql', request)
  return res.json()
}

const environment = new Environment({
  network: Network.create(fetchQuery),
  store: new Store(new RecordSource()),
})

export default environment
