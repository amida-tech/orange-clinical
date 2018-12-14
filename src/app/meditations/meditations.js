angular.module( 'orangeClinical.meditations', [
  'ui.bootstrap',
  'ui.router',
  'ngResource'
])

// journal entries data factory from API
.factory( 'MeditationEntry', function( api, $resource, $stateParams ) {
  return $resource(api.BASE + '/patients/:id/journal', {
    id: "@id" // take id parameter from data input
  }, {
    query: {
      isArray: false
    }
  });
})

.controller( 'MeditationCtl', function MeditationController( $scope, $stateParams, MeditationEntry ) {
  // get all journal entries
  $scope.meditations = [];
  $scope.meditationCount = 0;
  $scope.query = {
    // *patient* id
    id: $stateParams.id
  };
  $scope.getMeditations = function () {
    MeditationEntry.query($scope.query, function (res) {
      $scope.meditations = res.entries.filter(function (e) {
        return e.activity === 'Meditation';
      });
      console.log($scope.meditations);
      $scope.meditationCount = res.count;
    });
  };

  // pagination
  $scope.entriesPerPage = 5;
  $scope.currentPage = 1;
  $scope.$watch('currentPage', function (newPage) {
    // $scope.query.limit = $scope.entriesPerPage;
    // 0-indexing
    // $scope.query.offset = (newPage - 1) * $scope.entriesPerPage;
    $scope.getMeditations();
  });
})

;
