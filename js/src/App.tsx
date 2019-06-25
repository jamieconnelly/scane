import React, { useState } from 'react'
import { graphql } from 'react-relay'

import withQueryRenderer, { OuterProps } from './relay/withQueryRenderer'

import { AppQuery } from './__generated__/AppQuery.graphql'
import login from './mutations'

interface IProps extends OuterProps<AppQuery, {}> {}

const LoginForm = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const onSetUsername = (evt: React.SyntheticEvent) => {
    const target = evt.target as HTMLInputElement
    setUsername(target.value)
  }
  const onSetPassword = (evt: React.SyntheticEvent) => {
    const target = evt.target as HTMLInputElement
    setPassword(target.value)
  }

  const [userOrError, setUserOrError] = useState()

  const onSubmit = async () => {
    try {
      const { userLogin } = await login({ password, username })
      const name = userLogin && userLogin.user && userLogin.user.firstName
      setUserOrError(`Hello ${name} 👋🏻`)
    } catch (e) {
      if (e instanceof Array) {
        setUserOrError(e.map(({ message }) => message).join(', '))
      } else {
        setUserOrError(e.message)
      }
    }
  }

  return (
    <div>
      Login Form
      <div>
        <label htmlFor="username">Username</label>
        <input
          type="text"
          id="username"
          required
          name="username"
          value={username}
          onChange={onSetUsername}
        />
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          required
          name="password"
          value={password}
          onChange={onSetPassword}
        />
        <button onClick={onSubmit}>Login</button>
      </div>
      {userOrError}
    </div>
  )
}

const App = (props: IProps) => {
  if (props.relayLoading) {
    return <div>Loading</div>
  } else if (props.error) {
    return <div>Error</div>
  } else {
    return props.isLoggedIn ? <div>logged in!</div> : <LoginForm />
  }
}

export default withQueryRenderer<AppQuery>({
  query: graphql`
    query AppQuery {
      isLoggedIn
    }
  `,
})(App)
