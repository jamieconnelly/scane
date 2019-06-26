import React, { useState } from 'react'
import { Form, Field } from 'react-final-form'

import { LoginMutationInput } from './__generated__/mutationsLoginMutation.graphql'
import login from './mutations'

const LoginForm = () => {
  const [userOrError, setUserOrError] = useState()

  const onSubmit = async (values: LoginMutationInput) => {
    try {
      const { userLogin } = await login(values)
      const name = userLogin && userLogin.user && userLogin.user.firstName
      setUserOrError(`Hello ${name} 👋🏻`)
    } catch (e) {
      setUserOrError(e.message)
    }
  }

  return (
    <>
      <Form
        onSubmit={onSubmit}
        render={({ handleSubmit, submitting, pristine }) => (
          <form onSubmit={handleSubmit}>
            <div>
              <label>Username</label>
              <Field name="username" component="input" type="text" required />
            </div>
            <div>
              <label>Password</label>
              <Field name="password" component="input" type="password" required />
            </div>
            <div>
              <button type="submit" disabled={submitting || pristine}>
                Login
              </button>
            </div>
          </form>
        )}
      />
      {userOrError}
    </>
  )
}

export default LoginForm
