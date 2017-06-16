angular.module( 'orangeClinical.patients', [
  'ui.router',
  'ui.bootstrap',
  'orangeClinical.auth',
  'orangeClinical.medications',
  'orangeClinical.journal',
  'orangeClinical.events',
  'orangeClinical.today',
  'orangeClinical.adherences',
  'ui.router.tabs',
  'ngResource',
  'angularMoment'
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
  .state( 'patients.detail.medications', {
    url: '/medications',
    views: {
      '': {
        controller: 'MedicationsCtrl',
        templateUrl: 'medications/medications.tpl.html'
      }
    }
  })
  .state( 'patients.detail.adherences', {
    url: '/adherences',
    views: {
      '': {
        controller: 'AdherencesCtrl',
        templateUrl: 'adherences/adherences.tpl.html'
      }
    }
  })
  .state( 'patients.detail.journal', {
    url: '/journal',
    views: {
      '': {
        controller: 'JournalCtrl',
        templateUrl: 'journal/journal.tpl.html'
      }
    }
  })
  .state( 'patients.detail.events', {
    url: '/events',
    views: {
      '': {
        controller: 'EventsCtrl',
        templateUrl: 'events/event.tpl.html'
      }
    }
  })
  .state( 'patients.detail.today', {
    url: '/today',
    views: {
      '': {
        controller: 'TodayCtrl',
        templateUrl: 'today/today.tpl.html'
      }
    }
  })
  ;
})

// patients data factory from API
.factory( 'Patient', function( api, $resource ) {
  return $resource(api.BASE + '/patients/:id', null, {
    query: {
      isArray: false
    }
  });
})

.factory( 'Avatar', function ($http, $q, api) {
  // taken from amida-tech/orange:orange/www/js/core/services/avatar.service.js
  var bufferTobase64 = function bufferToBase64(arrayBuffer) {
      var base64 = '';
      var encodings = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

      var bytes = new Uint8Array(arrayBuffer);
      var byteLength = bytes.byteLength;
      var byteRemainder = byteLength % 3;
      var mainLength = byteLength - byteRemainder;

      var a, b, c, d;
      var chunk;

      // Main loop deals with bytes in chunks of 3
      for (var i = 0; i < mainLength; i = i + 3) {
          // Combine the three bytes into a single integer
          chunk = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2];

          // Use bitmasks to extract 6-bit segments from the triplet
          a = (chunk & 16515072) >> 18; // 16515072 = (2^6 - 1) << 18
          b = (chunk & 258048) >> 12; // 258048   = (2^6 - 1) << 12
          c = (chunk & 4032) >> 6; // 4032     = (2^6 - 1) << 6
          d = chunk & 63; // 63       = 2^6 - 1

          // Convert the raw binary segments to the appropriate ASCII encoding
          base64 += encodings[a] + encodings[b] + encodings[c] + encodings[d];
      }

      // Deal with the remaining bytes and padding
      if (byteRemainder == 1) {
          chunk = bytes[mainLength];

          a = (chunk & 252) >> 2; // 252 = (2^6 - 1) << 2

          // Set the 4 least significant bits to zero
          b = (chunk & 3) << 4; // 3   = 2^2 - 1

          base64 += encodings[a] + encodings[b] + '==';
      } else if (byteRemainder == 2) {
          chunk = (bytes[mainLength] << 8) | bytes[mainLength + 1];

          a = (chunk & 64512) >> 10; // 64512 = (2^6 - 1) << 10
          b = (chunk & 1008) >> 4; // 1008  = (2^6 - 1) << 4

          // Set the 2 least significant bits to zero
          c = (chunk & 15) << 2; // 15    = 2^4 - 1

          base64 += encodings[a] + encodings[b] + encodings[c] + '=';
      }

      return base64;
  };

  // cache base64 avatar parsing
  var cache = {};

  // get avatar for a specific patient
  var get = function get(patient) {
    // check cache
    if (cache[patient.id]) {
      var deferred = $q.defer();
      deferred.resolve(cache[patient.id]);
      return deferred.promise;
    } else {
      // get raw image data from API
      return $http({
        method: 'GET',
        url: api.BASE_AVATAR + patient.avatar,
        responseType: 'arraybuffer'
      }).then(function (res) {
        // convert to base64
        var image = bufferTobase64(res.data);
        cache[patient.id] = image;
        return image;
      });
    }
  };

  return {
    get: get
  };
})

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

// events data factory from API
.factory( 'EventsEntry', function( api, $resource, $stateParams ) {
  return $resource(api.BASE + '/patients/:id/events', {
    id: "@id" // take id parameter from data input
  }, {
    query: {
      isArray: false
    }
  });
})

// medications schedule data factory from API
.factory( 'ScheduleEntry', function( api, $resource, $stateParams ) {
  return $resource(api.BASE + '/patients/:id/schedule', {
    id: "@id" // take id parameter from data input
  }, {
    query: {
      isArray: false
    }
  });
})

// doses schedule data factory from API
.factory( 'DoseEntry', function( api, $resource, $stateParams ) {
  return $resource(api.BASE + '/patients/:id/doses', {
    id: "@id" // take id parameter from data input
  }, {
    query: {
      isArray: false
    }
  });
})

// medications data factory from API
.factory( 'Medication', function( api, $resource, $stateParams ) {
  return $resource(api.BASE + '/patients/:id/medications', {
    id: "@id" // take id parameter from data input
  }, {
    query: {
      isArray: false
    }
  });
})

// patients list controller
.controller( 'PatientsCtrl', function PatientsController( $scope, Patient ) {
  // get all patients
  $scope.patients = [];
  $scope.patientsCount = 0;
  $scope.query = {};
  $scope.getPatients = function () {
    Patient.query($scope.query, function (res) {
      $scope.patients = res.patients;
      $scope.patientsCount = res.count;
    });
  };

  // pagination
  $scope.patientsPerPage = 12;
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
.controller( 'PatientCtrl', function PatientController( $scope, $stateParams, Patient, Avatar ) {
  // get Patient
  $scope.patient = Patient.get({id: $stateParams.id}, function (patient) {
    Avatar.get(patient).then(function (avatar) {
      $scope.avatar = 'data:image/png;base64,' + avatar;
    });
  });

  // tabs
  $scope.tabData   = [
    {
      heading: 'Medications',
      route:   'patients.detail.medications'
    },
    {
      heading: 'Adherence Log',
      route:   'patients.detail.adherences'
    },
    {
      heading: 'Journal',
      route:   'patients.detail.journal'
    },
    {
      heading: 'Events',
      route:   'patients.detail.events'
    },
    {
      heading: 'Daily',
      route:   'patients.detail.today'
    }
  ];
})

;
