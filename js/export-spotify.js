{
  'use strict';

  const auth = {
    queryString: {
      client_id: 'ee66a2664d664089ac344a013f87c20b',
      redirect_uri_authorized: [
        'https://jsejcksn.github.io/export-spotify/',
        'https://localhost/',
        'https://localhost:8080/',
        'http://localhost/',
        'http://localhost:8080/'
      ],
      get redirect_uri () {
        if (this.redirect_uri_authorized.indexOf(location.origin.toString() + '/') >= 0) { // location origin matches url in array
          return this.redirect_uri_authorized[this.redirect_uri_authorized.indexOf(location.origin.toString() + '/')]; // return matched url
        }
        return this.redirect_uri_authorized[0]; // return first url
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

  const content = {
    home:
      `<div>
        <h1>Export Spotify</h1>
        <p>This app will allow you to export your playlists and the saved songs in your library. Connect it to your Spotify account to begin:</p> <a href="${auth.queryString.urlBase}?${auth.getQueryParam('client_id')}${auth.getQueryParam('redirect_uri', true)}${auth.getQueryParam('response_type', true)}${auth.getScope('scope', true)}${auth.getQueryParam('show_dialog', true)}${auth.getQueryParam('state', true)}">Get started</a>
      </div>`,
    auth: {
      error: (msg) => {
        return `
          <div>
            <p>${msg}</p> <a href="${auth.queryString.redirect_uri}">Try again</a>
          </div>`;
      },
      success: () => {
        return `
          <div>
            <h1>You did it!</h1>
            <p>Things are still in progress, but one day this app will liberate your data so you can use it however you want.</p>
            <p>In the meantime, perhaps you'd like to read about <a href="https://en.wikipedia.org/wiki/Psychology_of_music_preference">the psychology of music preference</a>.</p>
          </div>`;
      }
    }
  };

  if (!location.hash && !location.search) {
    document.body.className = 'auth-body';
    document.body.innerHTML = content.home;
    // location.href = `${auth.queryString.urlBase}?${auth.getQueryParam('client_id')}${auth.getQueryParam('redirect_uri', true)}${auth.getQueryParam('response_type', true)}${auth.getScope('scope', true)}${auth.getQueryParam('show_dialog', true)}${auth.getQueryParam('state', true)}`;
  } else {
    if (location.search) {
      let searchParams = new URLSearchParams(location.search);
      auth.addQueryParam(searchParams, 'error');
      auth.addQueryParam(searchParams, 'state');
      document.body.className = 'error-body';
      if (searchParams.has('error')) {
        document.body.innerHTML = content.auth.error('No approval, no data.');
      } else {
        document.body.innerHTML = content.auth.error('Something went wrong.');
      }
    } else {
      if (location.hash) {
        let searchParams = new URLSearchParams(location.hash.slice(1));
        auth.addQueryParam(searchParams, 'access_token');
        auth.addQueryParam(searchParams, 'token_type');
        auth.addQueryParam(searchParams, 'expires_in', true);
        auth.addQueryParam(searchParams, 'state');
        document.body.className = 'app-body';
        document.body.innerHTML = content.auth.success();
      }
    }
  }

}
