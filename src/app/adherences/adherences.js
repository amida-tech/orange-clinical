angular.module( 'orangeClinical.adherences', [
  'ui.bootstrap',
  'ui.router',
  'ngResource'
])

// adherence event data factory from API
/*.factory( 'Adherence', function( api, $resource, $stateParams ) {
  return $resource(api.BASE + '/patients/:id/journal', {
    id: "@id" // take id parameter from data input
  }, {
    query: {
      isArray: false
    }
  });
})*/

// factory to return patient habits
.factory( 'Habits', function ( api, $resource) {
  return $resource(api.BASE + '/patients/:id/habits', {
    id: "@id" // take id parameter from data input
  });
})

// factory to generate date to start listing adherence schedule from
// defaults to today's date in the patient's timezone
// calls the first dose endpoint to find the actual start date
// also returns patient timezone
.factory( 'AdherenceQuery', function ( $http, api, Habits ) {
  var getTz = function getTz(patientId) {
    return Habits.get({ id: patientId }).$promise.then(function (habits) {
      return habits.tz || "Etc/UTC";
    });
  };

  var startDate = function startDate(patientId, tz) {
    // GET http://localhost:5000/v1/patients/1/doses/nonempty/first
    return $http({
      method: 'GET',
      url: api.BASE + '/patients/' + patientId + '/doses/nonempty/first'
    }).then(function (res) {
      var start = res.data.min_dose_date;

      // start date found from doses
      if (typeof start === "string" && start.length > 0) {
        start = moment.tz(start, tz);
        if (start.isValid()) {
          return start;
        }
      }

      // default to today in patient's timezone
      return moment.tz(tz);
    }).then(function (start) {
      // only care about day
      return start.format("YYYY-MM-DD");
    });
  };

  // collate above functions into one promise
  var generate = function generate(patientId) {
    return getTz(patientId).then(function (tz) {
      return startDate(patientId, tz).then(function (startDate) {
        // end date is today in patient's timezone
        var endDate = moment.tz(tz).format("YYYY-MM-DD");

        return {
          tz: tz,
          startDate: startDate,
          endDate: endDate
        };
      });
    });
  };

  return {
    generate: generate
  };
})

// factory to get adherence event listing ('schedule') from API
.factory( 'Schedule', function ( api, $http ) {
  var get = function get(patientId, startDate, endDate) {
    return $http({
      method: 'GET',
      // url: api.BASE + '/patients/' + patientId + '/schedule',
      // use data dump endpoint as that generates and formats schedule event
      // items as we need them
      url: api.BASE + '/patients/' + patientId + '.json',
      params: {
        start_date: startDate,
        end_date: endDate
      }
    }).then(function (res) {
      return res.data;
    });
  };

  return {
    get: get
  };
})


.controller( 'AdherencesCtrl', function AdherencesController( $scope, $stateParams, AdherenceQuery, Schedule ) {
  // date to list adherence schedule from
  AdherenceQuery.generate($stateParams.id).then(function (query) {
    // get listing of schedule 'adherence' events
    Schedule.get($stateParams.id, query.startDate, query.endDate).then(function (schedule) {
      // ignore days with no events
      $scope.schedule = schedule.schedule.filter(function (day) {
        return day.events.length > 0;
      });
    });
  });
})

;
