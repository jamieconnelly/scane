import React from 'react'

import styles from './Home.scss'

const Sidebar = () => (
  <div className={styles.sideBar}>
    <div className={styles.sideBarHeader}>Project Name</div>
    <div className={styles.linksContainer}>
      <ul>
        <li>SERP Scrape</li>
        <li>Pull Backlinks</li>
        <li>Get Contact Info</li>
        <li>Mail Campaign</li>
      </ul>
    </div>
  </div>
)

const Home = () => (
  <div>
    <Sidebar />
  </div>
)

export default Home
