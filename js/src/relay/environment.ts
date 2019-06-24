import {
  Environment,
  Network,
  RecordSource,
  Store,
  RequestParameters,
  Variables,
} from 'relay-runtime'

const fetchQuery = async (operation: RequestParameters, variables: Variables) => {
  const res = await fetch('/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: operation.text,
      variables,
    }),
  })
  return res.json()
}

const environment = new Environment({
  network: Network.create(fetchQuery),
  store: new Store(new RecordSource()),
})

export default environment
