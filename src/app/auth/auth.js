// authentication module
angular.module( 'orangeClinical.auth', [
  'ngStorage'
])

.factory( 'Auth', function Auth( $http, api, Request ) {
  // login
  var login = function login(data, success, error) {
    // store token in local storage on success
    var handler = function authHandler(res) {
      Request.setToken(res.access_token);
      return success(res);
    };

    $http.post(api.BASE + '/auth/token', data).success(handler).error(error);
  };

  // log out
  var logout = function logout(data, success, error) {
    Request.setToken();
  };

  // check if user is logged in
  var authenticated = function authenticated() {
    // logged in iff token is present
    return !!Request.getToken();
  };

  return {
    login: login,
    logout: logout,
    authenticated: authenticated
  };
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
