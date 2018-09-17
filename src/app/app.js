var configCookieRegexp = /orangeClinicalConfig=(.*?)(?:\s|;|$)/;

function setConfigFromCookie () {
  var match = configCookieRegexp.exec(document.cookie);

  if (match && match[1]) {
    try {
      window.orangeClinicalConfig = JSON.parse(match[1]);
      return true;
    }
    catch (err) {
      console.error('ERROR: setConfigFromCookie() JSON.parse() failed with error:');
      console.error(err);
      console.error('Therefore, this webpage will not work. Try reloading the page.');
      return false;
    }
  }
  else {
    console.error('ERROR: setConfigFromCookie() regex match failed. Therefore, this webpage will not work. Try reloading the page.');
    return false;
  }
}

setConfigFromCookie();

angular.module( 'orangeClinical', [
  'templates-app',
  'templates-common',
  'orangeClinical.home',
  'orangeClinical.patients',
  'orangeClinical.auth',
  'orangeClinical.medications',
  'orangeClinical.journal',
  'orangeClinical.adherences',
  'ui.router'
])

// API config
.constant('api', {
  BASE: window.orangeClinicalConfig.ORANGE_API_URL,

  AUTH_MICROSERVICE_BASE: window.orangeClinicalConfig.AUTH_MICROSERVICE_URL,

  // don't include vn prefix in BASE_AVATAR
  BASE_AVATAR: window.orangeClinicalConfig.ORANGE_API_AVATAR_BASE_URL,

  SECRET: window.orangeClinicalConfig.X_CLIENT_SECRET
})

.config( function myAppConfig ( $stateProvider, $urlRouterProvider ) {
  $urlRouterProvider.otherwise( '/home' );
})

.run( function run () {
})

.controller( 'AppCtrl', function AppCtrl ( $scope, $rootScope, $location, $state, Token, Auth ) {
  $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
    if ( angular.isDefined( toState.data.pageTitle ) ) {
      $scope.pageTitle = toState.data.pageTitle + ' | orangeClinical' ;
    }
  });

  // unauthenticated users can only access the homepage
  $rootScope.$on( '$stateChangeStart', function(event, toState, toParams) {
    if (!$scope.authenticated && toState.name !== "home") {
      $location.path("home");
    }
  });

  // check if authenticated (via localstorage) initially
  Token.checkAuthenticated();
  $scope.authenticated = Token.authenticated;
  $scope.$on('authentication:updated', function () {
    $scope.authenticated = Token.authenticated;
  });

  // log out
  $scope.logout = function() {
    Auth.logout();
    $state.go("home");
  };
})

.filter('capitalize', function() {
  return function capitalize(input, scope) {
    if (typeof input === "undefined" || input === null) {
      return input;
    }

    input = input.toLowerCase();
    return input.substring(0, 1).toUpperCase() + input.substring(1);
  };
})

;

