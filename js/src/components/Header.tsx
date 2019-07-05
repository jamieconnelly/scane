import React from 'react'
import { graphql } from 'react-relay'

import { Header_me } from '__generated__/Header_me.graphql'
import withFragmentContainer from 'scane/relay/withFragmentContainer'

interface IProps {
  me: Header_me
}

import styles from './Header.scss'

const Header = ({ me: { firstName, lastName } }: IProps) => {
  let initials = firstName.length && firstName[0]
  if (lastName.length) {
    initials += lastName[0]
  }
  return (
    <div className={styles.header}>
      <div className={styles.initials}>{initials.toString().toUpperCase()}</div>
    </div>
  )
}

export default withFragmentContainer<IProps>({
  me: graphql`
    fragment Header_me on User {
      firstName
      lastName
    }
  `,
})(Header)
