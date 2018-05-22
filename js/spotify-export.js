{
  'use strict';

  const auth = {
    queryString: {
      client_id: 'ee66a2664d664089ac344a013f87c20b',
      redirect_uri_authorized: [
        'https://jsejcksn.github.io/spotify-export/',
        'https://localhost/',
        'https://localhost:8080/',
        'http://localhost/',
        'http://localhost:8080/'
      ],
      get redirect_uri () {
        if (this.redirect_uri_authorized.indexOf(location.origin.toString() + '/') >= 0) {
          return this.redirect_uri_authorized[this.redirect_uri_authorized.indexOf(location.origin.toString() + '/')];
        }
        return this.redirect_uri_authorized[0];
      },
      response_type: 'token',
      scope: [
        'user-library-read',
        'playlist-read-collaborative',
        'playlist-read-private'
      ],
      show_dialog: null,
      state: null,
      urlBase: 'https://accounts.spotify.com/authorize'
    },
    addQueryParam: (params, key, isNumber) => {
      if (params.has(key)) {
        if (isNumber === true) {
          auth[key] = +params.get(key);
        } else {
          auth[key] = params.get(key);
        }
        console.log(`${key}: ${auth[key]}`);
      }
    },
    getQueryParam: (key, includeAmp) => {
      if (key in auth.queryString && auth.queryString[key] !== '' && auth.queryString[key] !== null) {
        return includeAmp === true ? `&${key}=${encodeURIComponent(auth.queryString[key])}` : `${key}=${encodeURIComponent(auth.queryString[key])}`;
      } else {
        return '';
      }
    },
    getScope: (key, includeAmp) => {
      if (auth.queryString[key].length > 0) {
        let scope = auth.queryString[key][0];
        for (let i = 1; i < auth.queryString[key].length; i++) {
          scope += ` ${auth.queryString[key][i]}`;
        }
        return includeAmp === true ? `&${key}=${encodeURIComponent(scope)}` : `${key}=${encodeURIComponent(scope)}`;
      } else {
        return '';
      }
    }
  };

  if (!location.hash && !location.search) {
    location.href = `${auth.queryString.urlBase}?${auth.getQueryParam('client_id')}${auth.getQueryParam('redirect_uri', true)}${auth.getQueryParam('response_type', true)}${auth.getScope('scope', true)}${auth.getQueryParam('show_dialog', true)}${auth.getQueryParam('state', true)}`;
  } else {
    if (location.search) {
      let searchParams = new URLSearchParams(location.search);
      searchParams.sort();
      auth.addQueryParam(searchParams, 'error');
      auth.addQueryParam(searchParams, 'state');
      document.body.className = 'error-body';
      document.querySelector('body').innerHTML = `<div class="error-div">No approval, no data. <a href="${auth.queryString.redirect_uri}" class="error-action">Try again</a></div>`;
    } else {
      if (location.hash) {
        let searchParams = new URLSearchParams(location.hash.slice(1));
        searchParams.sort();
        auth.addQueryParam(searchParams, 'access_token');
        auth.addQueryParam(searchParams, 'token_type');
        auth.addQueryParam(searchParams, 'expires_in', true);
        auth.addQueryParam(searchParams, 'state');
        document.querySelector('p').innerHTML = JSON.stringify(auth);
      }
    }
  }

}
