angular.module( 'orangeClinical.today', [
  'ui.bootstrap',
  'ui.router',
  'ngResource'
])

.controller( 'TodayCtrl', function EventsController( $scope, $stateParams, EventsEntry, JournalEntry, ScheduleEntry, DoseEntry, Medication, moment ) {
  var MAX_LIMIT = 50; // TODO: paginate, please don't do this

  $scope.events = [];
  $scope.medications = {};
  $scope.eventsCount = 0;

  $scope.addEvents = function (newEvents) {
    var events = $scope.events.concat(newEvents);
    events.sort(function (eventA, eventB) {
      return moment(eventA.date) - moment(eventB.date);
    });
    $scope.events = events;
  };

  // journal
  $scope.journalQuery = {
    id: $stateParams.id,
    limit: MAX_LIMIT,
    start_date: "2017-06-15",
    end_date: "2017-06-15"
  };
  var parseEntry = function (entry) {
    var type;
    // move to backend
    if (entry.meditation === true) {
      type = 'meditation';
    } else if (entry.clinician === true) {
      type = 'clinician';
    } else {
      type = 'journal';
    }
    return Object.assign({}, entry, { type: type });
  };
  $scope.getJournal = function () {
    JournalEntry.query($scope.journalQuery, function (res) {
      $scope.addEvents(res.entries.map(parseEntry));
    });
  };

  $scope.scheduleQuery = {
    id: $stateParams.id,
    limit: MAX_LIMIT,
    start_date: "2017-06-15",
    end_date: "2017-06-15"
  };
  // only return scheduled events, not dosage events
  var filterSchedule = function (event) {
    return typeof event.scheduled !== 'undefined' && event.scheduled !== null;
  };
  var parseSchedule = function (event) {
    var type = 'medication';

    var medication = $scope.medications[event.medication_id];
    var time = medication.times[event.scheduled];
    return Object.assign({}, event, { type: type, medication: medication, time: time });
  };
  $scope.getSchedule = function () {
    ScheduleEntry.query($scope.scheduleQuery, function (res) {
      $scope.addEvents(res.schedule.filter(filterSchedule).map(parseSchedule));
    });
  };

  // doses
  $scope.dosesQuery = {
    id: $stateParams.id,
    limit: MAX_LIMIT,
    start_date: "2017-06-15",
    end_date: "2017-06-15"
  };
  var parseDose = function (event) {
    var type = 'dose';
    var medication = $scope.medications[event.medication_id];
    return Object.assign({}, event, { type: type, medication: medication });
  };
  $scope.getDoses = function () {
    DoseEntry.query($scope.dosesQuery, function (res) {
      $scope.addEvents(res.doses.map(parseDose));
    });
  };

  // events
  $scope.eventsQuery = {
    id: $stateParams.id,
    limit: MAX_LIMIT,
    start_date: "2017-06-15",
    end_date: "2017-06-15"
  };
  var parseEvent = function (event) {
    var type = 'event';
    return Object.assign({}, event, { type: type });
  };
  $scope.getEvents = function () {
    EventsEntry.query($scope.eventsQuery, function (res) {
      $scope.addEvents(res.events.map(parseEvent));
    });
  };

  $scope.medicationsQuery = {
    id: $stateParams.id,
    limit: MAX_LIMIT
  };
  $scope.getMedications = function () {
    return Medication.query($scope.medicationsQuery, function (res) {
      res.medications.forEach(function (medication) {
        var times = {};
        ((medication.schedule || {}).times || []).forEach(function (time) {
          times[time.id] = time;
        });
        $scope.medications[medication.id] = Object.assign({}, medication, { times: times });
      });
    });
  };

  $scope.getMedications().$promise.then(function () {
    $scope.getJournal();
    $scope.getSchedule();
    $scope.getDoses();
    $scope.getEvents();
  });

  // TODO: pagination
  $scope.eventsPerPage = 5;
  $scope.currentPage = 1;
  $scope.$watch('currentPage', function (newPage) {
    // $scope.query.limit = $scope.eventsPerPage;
    // 0-indexing
    // $scope.query.offset = (newPage - 1) * $scope.eventsPerPage;
    // $scope.getEvents();
  });
})

;
