import React from 'react'
import { graphql, QueryRenderer } from 'react-relay'

import { AppQuery } from './__generated__/AppQuery.graphql'
import environment from './environment'

const App = () => {
  return (
    <QueryRenderer
      environment={environment}
      query={graphql`
        query AppQuery {
          me
        }
      `}
      variables={{}}
      render={({ error, props }: any) => {
        if (error) {
          return <div>Error!</div>
        }
        if (!props) {
          return <div>Loading...</div>
        }
        return <div>ME: {props.me}</div>
      }}
    />
  )
}

export default App
