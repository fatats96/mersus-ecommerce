import axios from 'axios';

import { userManager } from './UserManager';
import { getToken } from './UserManager';

var Http = axios.create({
	baseURL: 'http://localhost:5000/',
	headers: {
		'Content-Type': 'application/json; charset=utf-8',
		Accept: 'application/json'
	},
	timeout: 40000,
	/* transformRequest: [function (data) {
         return querystring.stringify(data);
     }],*/
	withCredentials: true
});


Http.interceptors.request.use(
	function(config) {
		// AXIOS REQUEST INTERCEPTOR

		var preferredLang = localStorage.getItem('preferredLang');
		if (preferredLang) config.headers['Accept-Language'] = preferredLang;

		if (!config.url.endsWith('/login')) {
			var tokenStr = getToken();
			// for (let i = 0; i < sessionStorage.length; i++) {
			//     if (sessionStorage.key(i).startsWith('oidc.user:')) {
			//         var store = sessionStorage.getItem(sessionStorage.key(i));
			//         store = JSON.parse(store);
			//         tokenStr = store['access_token'];
			//         break;
			//     }
			// }
			if (tokenStr != null) config.headers['Authorization'] = 'Bearer ' + tokenStr;
			else {
				//history.push('/logout');
				userManager.signoutRedirect();
				return Promise.reject('route to login (no token)');
			}
		}
		return config;
	},
	function(error) {
		console.error('erjşoaırjfaşoıejfoa',error);
		return Promise.reject(error);
	}
);

export { Http }; 