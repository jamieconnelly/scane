import React, { useState } from 'react'
import { Form, Field } from 'react-final-form'

import { LoginMutationInput } from '__generated__/mutationsLoginMutation.graphql'
import login from 'scane/mutations'

const LoginForm = () => {
  const [error, setError] = useState()

  const onSubmit = async (values: LoginMutationInput) => {
    try {
      await login(values)
      window.location.href = '/'
    } catch (e) {
      setError(e.message)
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
      {error}
    </>
  )
}

export default LoginForm
