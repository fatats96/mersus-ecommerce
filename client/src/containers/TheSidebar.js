import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  CCreateElement,
  CSidebar,
  CSidebarBrand,
  CSidebarNav,
  CSidebarNavDivider,
  CSidebarNavTitle,
  CSidebarMinimizer,
  CSidebarNavDropdown,
  CSidebarNavItem,
} from '@coreui/react'

// sidebar nav config
import navigation from './_nav'

import userNavigation from './_userNav';

const TheSidebar = ({ userType }) => {
  const dispatch = useDispatch()
  const show = useSelector(state => state.sidebarShow)

  return (
    <CSidebar
      show={show}
      onShowChange={(val) => dispatch({ type: 'set', sidebarShow: val })}
    >
      <CSidebarBrand className="d-md-down-none" to="/">
        <div
          className="c-sidebar-brand-full"
        >
         { userType === 'admin' ? 'Mersus E-Ticaret Yönetim Paneli' : 'Mersus'}
        </div>
        <div
          className="c-sidebar-brand-minimized"
        >
          Mersus
        </div>
      </CSidebarBrand>
      <CSidebarNav>

        <CCreateElement
          items={userType === 'admin' ? navigation : userNavigation}
          components={{
            CSidebarNavDivider,
            CSidebarNavDropdown,
            CSidebarNavItem,
            CSidebarNavTitle,
            
          }}
        />
      </CSidebarNav>
      <CSidebarMinimizer className="c-d-md-down-none" />
    </CSidebar>
  )
}

export default React.memo(TheSidebar)
