angular.module( 'orangeClinical.moods', [
  'ui.bootstrap',
  'ui.router',
  'ngResource'
])

.factory( 'Mood', function( api, $resource, $stateParams ) {
  return $resource(api.BASE + '/patients/:id/journal/moods', {
    id: "@id" // take id parameter from data input
  }, {
    query: {
      isArray: false
    }
  });
})

.controller( 'MoodCtl', function MoodController( $scope, $stateParams, Mood ) {
  // get all journal entries
  $scope.journal = [];
  $scope.journalCount = 0;
  $scope.query = {
    // *patient* id
    id: $stateParams.id
  };
  $scope.getJournal = function () {
    Mood.query($scope.query, function (res) {
      console.log(JSON.stringify(res, null, 2));
      $scope.journal = res.entries;
      $scope.journalCount = res.count;
    });
  };

  // pagination
  $scope.entriesPerPage = 5;
  $scope.currentPage = 1;
  $scope.$watch('currentPage', function (newPage) {
    // $scope.query.limit = $scope.entriesPerPage;
    // 0-indexing
    // $scope.query.offset = (newPage - 1) * $scope.entriesPerPage;
    $scope.getJournal();
  });
})

;
