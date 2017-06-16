angular.module( 'orangeClinical', [
  'templates-app',
  'templates-common',
  'orangeClinical.home',
  'orangeClinical.patients',
  'orangeClinical.auth',
  'orangeClinical.medications',
  'orangeClinical.journal',
  'orangeClinical.adherences',
  'orangeClinical.events',
  'ui.router'
])

// API config
.constant('api', {
  BASE: 'http://localhost:5000/v1',
  // don't include vn prefix in BASE_AVATAR
  BASE_AVATAR: 'http://localhost:5000',
  SECRET: 'testsecret'
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

.filter('emoji', function() {
  return function emoji(input, scope) {
    if (typeof input === 'undefined' || input === null) {
      return input;
    }
  
    // convert from charcode /uXXXX format to html &$xXXXX format
    var charCode = parseInt(input.slice(2), 16);
    return String.fromCodePoint(charCode);
  };
})

;

