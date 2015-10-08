angular.module( 'orangeClinical.patients', [
  'ui.router',
  'placeholders',
  'ui.bootstrap',
  'orangeClinical.auth',
  'ngResource'
])

.config(function config( $stateProvider ) {
  $stateProvider
  .state( 'patients', {
    url: '/patients',
    views: {
      'main': {
        controller: 'PatientsCtrl',
        templateUrl: 'patients/patients.tpl.html'
      }
    },
    data:{ pageTitle: 'Patients' }
  })
  .state( 'patients.detail', {
    url: '/:id',
    views: {
      'main@': {
        controller: 'PatientCtrl',
        templateUrl: 'patients/patient.tpl.html'
      }
    }
  })
  ;
})

// patients data factory from API
.factory( 'Patients', function( api, $resource ) {
  return $resource(api.BASE + '/patients/:id', null, {
    query: {
      isArray: false
    }
  });
})

// patients list controller
.controller( 'PatientsCtrl', function PatientsController( $scope, Patients ) {
  // get all patients
  $scope.patients = [];
  $scope.patientsCount = 0;
  $scope.query = {};
  $scope.getPatients = function () {
    Patients.query($scope.query, function (res) {
      $scope.patients = res.patients;
      $scope.patientsCount = res.count;
    });
  };

  // pagination
  $scope.patientsPerPage = 5;
  $scope.currentPage = 1;
  $scope.$watch('currentPage', function (newPage) {
    $scope.query.limit = $scope.patientsPerPage;
    // 0-indexing
    $scope.query.offset = (newPage - 1) * $scope.patientsPerPage;
    $scope.getPatients();
  });

  // searching
  $scope.lastName = "";
  $scope.search = function () {
    var oldQuery = angular.copy($scope.query);

    if ($scope.lastName.length >= 3) {
      $scope.query.last_name = $scope.lastName;
    } else {
      delete $scope.query.last_name;
    }

    // don't query patients if the two queries are identical
    // prevents making duplicate requests when typing <3 chars
    if (!angular.equals($scope.query, oldQuery)) {
      // if we are making a query that's different in name,
      // go back to the first page
      $scope.currentPage = 1;

      $scope.getPatients();
    }
  };
})

// single patient detail view controller
.controller( 'PatientCtrl', function PatientController( $scope, $stateParams, Patients ) {
  // get Patient
  $scope.patient = Patients.get({id: $stateParams.id});
})

;
