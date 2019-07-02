import React from 'react'
import { graphql } from 'react-relay'

import withFragmentContainer from 'scane/relay/withFragmentContainer'

interface IRouteProps extends RouteProps {
  isLoggedIn: boolean
}

import styles from './Header.scss'

const Header = ({ me: { firstName, lastName } }) => {
  let initials = firstName.length && firstName[0]
  if (lastName.length) {
    initials += lastName[0]
  }
  return (
    <div className={styles.header}>
      <div className={styles.initials}>{initials.toUpperCase()}</div>
    </div>
  )
}

export default withFragmentContainer({
  me: graphql`
    fragment Header_me on User {
      firstName
      lastName
    }
  `,
})(Header)
