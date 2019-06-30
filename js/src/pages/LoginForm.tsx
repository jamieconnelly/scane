import React, { useState } from 'react'
import { Form, Field } from 'react-final-form'

import { LoginMutationInput } from '__generated__/mutationsLoginMutation.graphql'
import login from 'scane/mutations'

import styles from './LoginForm.scss'

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
    <div className={styles.container}>
      <Form
        onSubmit={onSubmit}
        render={({ handleSubmit, submitting, pristine }) => (
          <form onSubmit={handleSubmit} className={styles.loginForm}>
            <h3>Login to your account</h3>
            <Field
              name="username"
              component="input"
              placeholder="Username"
              type="text"
              required
            />
            <Field
              name="password"
              component="input"
              placeholder="Password"
              type="password"
              required
            />
            <button type="submit" disabled={submitting || pristine}>
              Login
            </button>
            {error && <div className={styles.error}>{error}</div>}
          </form>
        )}
      />
    </div>
  )
}

export default LoginForm
