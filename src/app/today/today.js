angular.module( 'orangeClinical.today', [
  'ui.bootstrap',
  'ui.router',
  'ngResource',
  '720kb.datepicker'
])

.controller( 'TodayCtrl', function EventsController( $scope, $stateParams, EventsEntry, JournalEntry, ScheduleEntry, DoseEntry, Medication, moment ) {
  var MAX_LIMIT = 50; // TODO: paginate, please don't do this

  $scope.today = new Date();
  $scope.date = null;

  $scope.events = [];
  $scope.medications = {};

  $scope.addEvents = function (newEvents) {
    var events = $scope.events.concat(newEvents);
    events.sort(function (eventA, eventB) {
      return moment(eventA.date) - moment(eventB.date);
    });
    $scope.events = events;
  };

  function resourceQuery() {
    return {
      id: $stateParams.id,
      limit: MAX_LIMIT,
      start_date: $scope.date,
      end_date: $scope.date
    };
  }

  // journal
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
    JournalEntry.query(resourceQuery(), function (res) {
      $scope.addEvents(res.entries.map(parseEntry));
    });
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
    ScheduleEntry.query(resourceQuery(), function (res) {
      $scope.addEvents(res.schedule.filter(filterSchedule).map(parseSchedule));
    });
  };

  // doses
  var parseDose = function (event) {
    var type = 'dose';
    var medication = $scope.medications[event.medication_id];
    return Object.assign({}, event, { type: type, medication: medication });
  };
  $scope.getDoses = function () {
    DoseEntry.query(resourceQuery(), function (res) {
      $scope.addEvents(res.doses.map(parseDose));
    });
  };

  // events
  var parseEvent = function (event) {
    var type = 'event';
    return Object.assign({}, event, { type: type });
  };
  $scope.getEvents = function () {
    EventsEntry.query(resourceQuery(), function (res) {
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

  $scope.getDayData = function () {
    console.log('getting');
    $scope.events = [];
    $scope.getJournal();
    $scope.getSchedule();
    $scope.getDoses();
    $scope.getEvents();
  };

  var medicationsLoaded = false;
  var getDataOnMedicationLoad = false;
  $scope.getMedications().$promise.then(function () {
    medicationsLoaded = true;
    if (getDataOnMedicationLoad) { $scope.getDayData(); }
  });

  $scope.$watch('date', function (date) {
    if (date !== null) {
      if (medicationsLoaded) {
        $scope.getDayData();
      } else {
        getDataOnMedicationLoad = true;
      }
    }
  });
})

;
