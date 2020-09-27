import React from 'react'
import {
  TheContent,
  TheSidebar,
  TheFooter,
  TheHeader
} from './index'

const UserLayout = () => {
  return (
    <div className="c-app c-default-layout">
      <TheSidebar userType={'normaluser'}/>
      <div className="c-wrapper">
        <TheHeader/>
        <div className="c-body">
          <TheContent userType={'normaluser'} />
        </div>
        <TheFooter/>
      </div>
    </div>
  )
}

export default UserLayout
