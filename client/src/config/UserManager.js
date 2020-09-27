import { makeUserManager } from 'react-oidc';

var settings = {
    // URL of your OpenID Connect server.
    // The library uses it to access the metadata document
    authority: 'http://localhost:5000',

    client_id: 'eCommerceAPI',
    redirect_uri: `${window.location.origin}/callback`,
    //silent_redirect_uri:`${window.location.origin}/callback`,
    post_logout_redirect_uri: `${window.location.origin}/logout`,

    // What you expect back from The IdP.
    // In that case, like for all JS-based applications, an identity token
    // and an access token
    response_type: 'code',

    // Scopes requested during the authorisation request
    scope: 'openid profile eCommerceAPI',

    // Number of seconds before the token expires to trigger
    // the `tokenExpiring` event
    accessTokenExpiringNotificationTime: 30,

    // Do we want to renew the access token automatically when it's
    // about to expire?
    automaticSilentRenew: true,

    // Do we want to filter OIDC protocal-specific claims from the response?
    filterProtocolClaims: true,
    //Get user data as response too
    loadUserInfo: true,
    //prompt: 'login'
};

const userManager = makeUserManager(settings);

userManager.events.addUserLoaded(function (loadedUser) {
    userManager.storeUser(loadedUser);
    console.warn('addUserLoaded', loadedUser);
});

userManager.events.addSilentRenewError(function (error) {
    console.error('addSilentRenewError', error);
});

userManager.events.addUserSignedOut(function () {
    console.warn('addUserSignedOut');
});


function getToken() {
    for (let i = 0; i < sessionStorage.length; i++) {
        if (sessionStorage.key(i).startsWith('oidc.user:')) {
            var store = sessionStorage.getItem(sessionStorage.key(i));
            store = JSON.parse(store);
            return store['access_token'];
        }
    }
    return null;
}

function getUserType() {
    for (let i = 0; i < sessionStorage.length; i++) {
        if (sessionStorage.key(i).startsWith('oidc.user:')) {
            return JSON.parse(sessionStorage.getItem(sessionStorage.key(i))).profile.userType;
        }
    }
}

export function getUserId() {
    for (let i = 0; i < sessionStorage.length; i++) {
        if (sessionStorage.key(i).startsWith('oidc.user:')) {
            return JSON.parse(sessionStorage.getItem(sessionStorage.key(i))).profile.sub;
        }
    }
}

export { userManager, settings, getToken, getUserType };