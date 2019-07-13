import React from 'react'
import { Form, Field } from 'react-final-form'
import { FORM_ERROR } from 'final-form'

import { LoginMutationInput } from '__generated__/LoginMutation.graphql'
import Button from 'scane/components/Button'
import login from 'scane/mutations/login'

import styles from './LoginForm.scss'

const LoginForm = () => {
  const onSubmit = async (values: LoginMutationInput) => {
    try {
      await login(values)
      window.location.href = '/'
    } catch (e) {
      return { [FORM_ERROR]: `Login failed: ${e.message}` }
    }
  }

  return (
    <div className={styles.container}>
      <Form
        onSubmit={onSubmit}
        render={({ handleSubmit, submitting, pristine, submitError }) => (
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
            <Button type="submit" disabled={submitting || pristine}>
              Login
            </Button>
            {submitError && <div className={styles.error}>{submitError}</div>}
          </form>
        )}
      />
    </div>
  )
}

export default LoginForm
