import React from 'react'
import { NavLink, Route, Switch, Redirect } from 'react-router-dom'

import Backlinks from './Backlinks'

import styles from './Home.scss'

const Home = () => (
  <div className={styles.container}>
    <div className={styles.sideBar}>
      <div className={styles.sideBarHeader}>Project Name</div>
      <div className={styles.linksContainer}>
        <NavLink exact activeClassName={styles.active} to="/">
          SERP Scrape
        </NavLink>
        <NavLink exact activeClassName={styles.active} to="/backlinks">
          Pull Backlinks
        </NavLink>
        <NavLink exact activeClassName={styles.active} to="/">
          Get Contact Info
        </NavLink>
        <NavLink exact activeClassName={styles.active} to="/">
          Mail Campaign
        </NavLink>
      </div>
    </div>
    <div className={styles.content}>
      <Switch>
        <Route path="/backlinks" component={Backlinks} />
        <Redirect to="/backlinks" />
      </Switch>
    </div>
  </div>
)

export default Home
