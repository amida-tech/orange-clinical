angular.module( 'orangeClinical.patients', [
  'ui.router',
  'placeholders',
  'ui.bootstrap'
])

.config(function config( $stateProvider ) {
  $stateProvider.state( 'patients', {
    url: '/patients',
    views: {
      "main": {
        controller: 'PatientsCtrl',
        templateUrl: 'patients/patients.tpl.html'
      }
    },
    data:{ pageTitle: 'Patients' }
  });
})

// patients list controller
.controller( 'PatientsCtrl', function PatientsController( Auth ) {
  console.log(Auth.authenticated());

})

;
