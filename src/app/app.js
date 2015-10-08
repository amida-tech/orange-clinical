angular.module( 'orangeClinical', [
  'templates-app',
  'templates-common',
  'orangeClinical.home',
  'orangeClinical.patients',
  'orangeClinical.auth',
  'ui.router'
])

// API config
.constant('api', {
  BASE: 'http://localhost:5000/v1',
  SECRET: 'testsecret'
})

.config( function myAppConfig ( $stateProvider, $urlRouterProvider ) {
  $urlRouterProvider.otherwise( '/home' );
})

.run( function run () {
})

.controller( 'AppCtrl', function AppCtrl ( $scope, $rootScope, $location, $state, Auth ) {
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
  Auth.checkAuthenticated();
  $scope.authenticated = Auth.authenticated;
  $scope.$on('authentication:updated', function () {
    $scope.authenticated = Auth.authenticated;
  });

  // log out
  $scope.logout = function() {
    Auth.logout();
    $state.go("home");
  };
})

;

