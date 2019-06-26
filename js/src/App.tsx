import React from 'react'
import { graphql } from 'react-relay'
import { RouteProps } from 'react-router'
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom'

import withQueryRenderer, { OuterProps } from 'scane/relay/withQueryRenderer'

import { AppQuery } from 'scane/__generated__/AppQuery.graphql'
import LoginForm from 'scane/LoginForm'

interface IProps extends OuterProps<AppQuery, {}> {}

const Home = () => <div>Home</div>
const NotFound = () => <div>404</div>

interface IRouteProps extends RouteProps {
  isLoggedIn: boolean
}

const PrivateRoute = ({ isLoggedIn, ...props }: IRouteProps) =>
  isLoggedIn ? <Route {...props} /> : <Redirect to="/login" />

const LoginRoute = ({ isLoggedIn, ...props }: IRouteProps) =>
  isLoggedIn ? <Redirect to="/" /> : <Route {...props} />

const App = (props: IProps) => {
  if (props.relayLoading) {
    return <div>Loading</div>
  } else if (props.error) {
    return <div>Error</div>
  }
  const isLoggedIn = !!(props.me && props.me.isLoggedIn)
  return (
    <Router>
      <Switch>
        <PrivateRoute isLoggedIn={isLoggedIn} exact path="/" component={Home} />
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
      }
    }
  `,
})(App)
