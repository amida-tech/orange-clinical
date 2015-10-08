// authentication module
angular.module( 'orangeClinical.auth', [
  'ngStorage'
])

.factory( 'Auth', function Auth( $rootScope, $http, api, Request ) {
  var auth = {};

  // login
  auth.login = function login(data, success, error) {
    // store token in local storage on success
    var handler = function authHandler(res) {
      Request.setToken(res.access_token);
      auth.authenticated = true;
      $rootScope.$broadcast('authentication:updated');

      console.log("logging in");
      console.log("setting authenticated to true");
      console.log();

      if (typeof success === "function") {
        success();
      }
    };

    $http.post(api.BASE + '/auth/token', data).success(handler).error(error);
  };

  // log out
  auth.logout = function logout(success, error) {
    Request.setToken(null);
    auth.authenticated = false;
    $rootScope.$broadcast('authentication:updated');

    console.log("logging out");
    console.log("setting authenticated to false");
    console.log();

    if (typeof success === "function") {
      success();
    }
  };

  // check if authenticated (via localstorage) initially
  auth.checkAuthenticated = function checkAuthenticated() {
    auth.authenticated = !!Request.getToken();
    $rootScope.$broadcast('authentication:updated');

    console.log(auth.authenticated);
  };

  return auth;
})

.factory( 'Request', function Request( api, $localStorage ) {
  // store token in local storage
  var setToken = function setToken(token) {
    $localStorage.token = token;
  };

  var getToken = function getToken() {
    return $localStorage.token;
  };

  // intercept HTTP requests and add X-Client-Secret and (if token present)
  // Authorization headers
  var request = function request(config) {
    config.headers['X-Client-Secret'] = api.SECRET;

    var token = getToken();
    if (token) {
      config.headers['Authorization'] = 'Bearer ' + token;
    }

    return config;
  };

  return {
    setToken: setToken,
    getToken: getToken,
    request: request
  };
})
.config(function( $httpProvider ) {
  $httpProvider.interceptors.push('Request');
})

;
