import React from 'react'
import { graphql } from 'react-relay'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import { AppQuery } from 'scane/__generated__/AppQuery.graphql'
import Header from 'scane/components/Header'
import Error from 'scane/pages/Error'
import Home from 'scane/pages/Home'
import LoginForm from 'scane/pages/LoginForm'
import LoadingPage from 'scane/pages/Loading'
import NotFound from 'scane/pages/NotFound'
import withQueryRenderer, { OuterProps } from 'scane/relay/withQueryRenderer'

import './styles/styles.scss'

interface IProps extends OuterProps<AppQuery, {}> {}

const App = (props: IProps) => {
  if (props.relayLoading) {
    return <LoadingPage />
  } else if (props.error) {
    return <Error />
  }
  const isLoggedIn = !!(props.me && props.me.isLoggedIn)
  return (
    <Router>
      <Switch>
        {isLoggedIn ? (
          <>
            <Header me={props.me as any} />
            <Route component={Home} path="/" />
          </>
        ) : (
          <Route path="/login" component={LoginForm} />
        )}
        <Route component={NotFound} />
      </Switch>
    </Router>
  )
}

export default withQueryRenderer<AppQuery>({
  query: graphql`
    query AppQuery {
      me {
        isLoggedIn
        ...Header_me
      }
    }
  `,
})(App)
