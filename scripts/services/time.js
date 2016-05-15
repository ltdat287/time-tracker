/* scripts/services/time.js */
    
(function() {
    
    'use strict';

    angular
        .module('timeTracker')
        .factory('time', time);

        function time($resource) {

            // ngResource call to our static data
            var Time = $resource('data/time.json');

            function getTime() {
                // $promise.then allows us to intercept the results
                // which we will use later
                return Time.query().$promise.then(function(results) {
                    return results;
                }, function(error) { // Check for errors
                    console.log(error);
                });
            }

            return {
                getTime: getTime,
            }
        }
            
})();