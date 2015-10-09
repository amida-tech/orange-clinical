angular.module( 'orangeClinical.journal', [
  'ui.bootstrap',
  'ui.router',
  'ngResource'
])

// journal entries data factory from API
.factory( 'JournalEntry', function( api, $resource, $stateParams ) {
  return $resource(api.BASE + '/patients/:id/journal', {
    id: "@id" // take id parameter from data input
  }, {
    query: {
      isArray: false
    }
  });
})

.controller( 'JournalCtrl', function JournalController( $scope, $stateParams, JournalEntry ) {
  // get all journal entries
  $scope.journal = [];
  $scope.journalCount = 0;
  $scope.query = {
    // *patient* id
    id: $stateParams.id
  };
  $scope.getJournal = function () {
    JournalEntry.query($scope.query, function (res) {
      $scope.journal = res.entries;
      $scope.journalCount = res.count;
    });
  };

  // pagination
  $scope.entriesPerPage = 5;
  $scope.currentPage = 1;
  $scope.$watch('currentPage', function (newPage) {
    $scope.query.limit = $scope.entriesPerPage;
    // 0-indexing
    $scope.query.offset = (newPage - 1) * $scope.entriesPerPage;
    $scope.getJournal();
  });
})

;
