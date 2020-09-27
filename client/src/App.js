import React, { Component } from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import Loadable from 'react-loadable';
import './scss/style.scss';
import { createBrowserHistory } from 'history';
import $ from 'jquery';

// open id
import { userManager, getUserType } from './config/UserManager';
import { makeAuthenticator, Callback } from 'react-oidc';
import { Http } from './config/Http';

const loading = () => <div className="animated fadeIn pt-3 text-center">Loading...</div>;

const Layout = Loadable({
  loader: () => import('./containers/TheLayout'),
  loading,
});

const UserLayout = Loadable({
  loader: () => import('./containers/UserLayout'),
  loading,
});

const AppWithAuth = makeAuthenticator({
  userManager: userManager,
  placeholderComponent: loading,
})((props) => 
   <Route path="*" name="Home" render={routeProps => {
     if (routeProps.location.location){
       delete routeProps.location.action;
       routeProps.location = { ...routeProps.location.location };
     }
     getUserType();
     return ( getUserType() === 'admin' ? <Layout /> : <UserLayout /> )
   }} />)

$(document).on('click', 'a[href="#"]', function (e) {
  e.preventDefault();
});


class App extends Component {

  render() {
    return (
      <Router history={createBrowserHistory()}>
        <React.Suspense fallback={loading}>
          <Switch>
            <Route
              path="/callback"
              render={routeProps => {
                console.log(routeProps);
                return (
                  <>
                    <div className="animated fadeIn pt-3 text-center">Loading</div>
                    <Callback
                      userManager={userManager}
                      onSuccess={async (user) => {
                        try {
                          console.log(user)
                          if (getUserType() === 'normaluser') {
                            Http.post('basket/getBasket', { }).then(res => {
                              if (res.data.data) {
                                localStorage.setItem('basket', JSON.stringify(res.data.data))
                              }
                            }).catch(e => console.log(e));
                          }
                          routeProps.history.push('/');
                        } catch (e) {
                          console.log(e);
                        }
                      }}
                      onError={(e) => {
                        console.error("onError", e);
                        routeProps.history.push("/")
                      }}
                    />
                  </>
                )
              }}
            />
            <AppWithAuth />
          </Switch>
        </React.Suspense>
      </Router>
    );
  }
}

export default App;
