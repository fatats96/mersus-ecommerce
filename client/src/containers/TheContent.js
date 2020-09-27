import React from 'react'
import {
  Redirect,
  Route,
  Switch
} from 'react-router-dom'
import { CContainer, CFade } from '@coreui/react'

// routes config
import routes from '../routes'
import userRoutes from '../userRoutes'

const TheContent = (userType) => {
  return (
    <main className="c-main">
      <CContainer fluid>
        <Switch>
          {userType.userType === 'admin' ? routes.map((route, idx) => {
            return (
              <Route
                key={idx}
                path={route.path}
                exact={route.exact}
                name={route.name}
                render={props => (
                  <CFade>
                    <route.component {...props} />
                  </CFade>
                )} />
            )
          }) : userRoutes.map((route, idx) => {
            return (
              <Route
                key={idx}
                path={route.path}
                exact={route.exact}
                name={route.name}
                render={props => (
                  <CFade>
                    <route.component {...props} />
                  </CFade>
                )} />
            )
          })}
          <Redirect from="/" to="/dashboard" />
        </Switch>
      </CContainer>
    </main>
  )
}

export default React.memo(TheContent)
