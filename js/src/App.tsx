import React from 'react'
import { graphql } from 'react-relay'

import withQueryRenderer, { OuterProps } from './relay/withQueryRenderer'

import { AppQuery } from './__generated__/AppQuery.graphql'

interface IProps extends OuterProps<AppQuery, {}> {}

const App = (props: IProps) => {
  if (props.relayLoading) {
    return <div>Loading</div>
  } else if (props.error) {
    return <div>Error</div>
  } else {
    return <div>{props.me}</div>
  }
}

export default withQueryRenderer<AppQuery>({
  query: graphql`
    query AppQuery {
      me
    }
  `,
})(App)
