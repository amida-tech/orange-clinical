angular.module( 'orangeClinical.events', [
  'ui.bootstrap',
  'ui.router',
  'ngResource'
])

.controller( 'EventsCtrl', function EventsController( $scope, $stateParams, EventsEntry ) {
  // get all events
  $scope.events = [];
  $scope.eventsCount = 0;
  $scope.query = {
    // *patient* id
    id: $stateParams.id
  };
  $scope.getEvents = function () {
    EventsEntry.query($scope.query, function (res) {
      $scope.events = res.events;
      $scope.eventsCount = res.count;
      //
    });
  };

  // pagination
  $scope.entriesPerPage = 5;
  $scope.currentPage = 1;
  $scope.$watch('currentPage', function (newPage) {
    $scope.query.limit = $scope.entriesPerPage;
    // 0-indexing
    $scope.query.offset = (newPage - 1) * $scope.entriesPerPage;
    $scope.getEvents();
  });
})

;
