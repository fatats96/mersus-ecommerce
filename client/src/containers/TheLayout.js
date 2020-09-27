import React from 'react'
import {
  TheContent,
  TheSidebar,
  TheFooter,
  TheHeader
} from './index'

const TheLayout = () => {
  console.log()
  return (
    <div className="c-app c-default-layout">
      <TheSidebar  userType={'admin'}/>
      <div className="c-wrapper">
        <TheHeader/>
        <div className="c-body">
          <TheContent userType={'admin'} />
        </div>
        <TheFooter/>
      </div>
    </div>
  )
}

export default TheLayout
