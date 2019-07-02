import React from 'react'
import { graphql } from 'react-relay'
import { RouteProps } from 'react-router'
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom'

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

interface IRouteProps extends RouteProps {
  isLoggedIn: boolean
}

const PrivateRoute = ({ isLoggedIn, me, ...props }: IRouteProps) =>
  isLoggedIn ? (
    <>
      <Header me={me} />
      <Route {...props} />
    </>
  ) : (
    <Redirect to="/login" />
  )

const LoginRoute = ({ isLoggedIn, ...props }: IRouteProps) =>
  isLoggedIn ? <Redirect to="/" /> : <Route {...props} />

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
        <PrivateRoute
          me={props.me}
          isLoggedIn={isLoggedIn}
          exact
          path="/"
          component={Home}
        />
        <LoginRoute isLoggedIn={isLoggedIn} path="/login" component={LoginForm} />
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
