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

.controller( 'AppCtrl', function AppCtrl ( $scope, $location ) {
  $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
    if ( angular.isDefined( toState.data.pageTitle ) ) {
      $scope.pageTitle = toState.data.pageTitle + ' | orangeClinical' ;
    }
  });
})

;

