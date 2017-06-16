angular.module( 'orangeClinical.medications', [
  'ui.bootstrap',
  'ui.router',
  'ngResource'
])

.controller( 'MedicationsCtrl', function MedicationsController( $scope, $stateParams, Medication ) {
  // get all medications
  $scope.medications = [];
  $scope.medicationsCount = 0;
  $scope.query = {
    // *patient* id
    id: $stateParams.id
  };
  $scope.getMedications = function () {
    Medication.query($scope.query, function (res) {
      console.log(res);
      $scope.medications = res.medications;
      $scope.medicationsCount = res.count;
    });
  };

  // pagination
  $scope.medicationsPerPage = 10;
  $scope.currentPage = 1;
  $scope.$watch('currentPage', function (newPage) {
    $scope.query.limit = $scope.medicationsPerPage;
    // 0-indexing
    $scope.query.offset = (newPage - 1) * $scope.medicationsPerPage;
    $scope.getMedications();
  });
})

;
