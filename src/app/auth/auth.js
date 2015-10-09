// authentication module
angular.module( 'orangeClinical.auth', [
  'ngStorage'
])

.factory( 'Auth', function Auth( $rootScope, $http, api, Token ) {
  var auth = {};

  // login
  auth.login = function login(data, success, error) {
    // store token in local storage on success
    var handler = function authHandler(res) {
      Token.set(res.access_token);

      if (typeof success === "function") {
        success();
      }
    };

    $http.post(api.BASE + '/auth/token', data).success(handler).error(error);
  };

  // log out
  auth.logout = function logout(success, error) {
    Token.set(null);

    if (typeof success === "function") {
      success();
    }
  };

  return auth;
})

// store access token in local storage
.factory( 'Token', function Token( $localStorage, $rootScope ) {
  var token = {};

  token.set = function set(t) {
    $localStorage.token = t;
    token.authenticated = !!t;
    $rootScope.$broadcast('authentication:updated');
  };

  token.get = function get() {
    return $localStorage.token;
  };

  // check if authenticated (via localstorage) initially
  token.checkAuthenticated = function checkAuthenticated() {
    token.authenticated = !!token.get();
    $rootScope.$broadcast('authentication:updated');
  };

  return token;
})

.factory( 'Request', function Request( api, $q, $location, Token ) {

  // intercept HTTP requests and add X-Client-Secret and (if token present)
  // Authorization headers
  var request = function request(config) {
    config.headers['X-Client-Secret'] = api.SECRET;

    var token = Token.get();
    if (token) {
      config.headers['Authorization'] = 'Bearer ' + token;
    }

    return config;
  };

  // catch errors caused by access token expiration
  var responseError = function responseError(rejection) {
    var errors = rejection.data.errors;
    if (typeof errors !== "undefined" && errors !== null) {
      if (errors.length === 1 && errors[0] === "invalid_access_token") {
        // access token expired, so log user out
        // (can't automatically request a new one as we can't securely
        // store credentials locally)
        Token.set(null);
        return $location.path("home");
      }
    }

    // fall back to erroring out
    return $q.reject(rejection);
  };

  return {
    request: request,
    responseError: responseError
  };
})
.config(function( $httpProvider ) {
  $httpProvider.interceptors.push('Request');
})

;
