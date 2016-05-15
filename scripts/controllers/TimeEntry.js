(function() {

  'use strict';
    
    angular
        .module('timeTracker')
        .controller('TimeEntry', TimeEntry);

        function TimeEntry(time) {

            // vm is our capture variable
            var vm = this;

            vm.timeentries = [];

            // Fetches the time entries from the static JSON file
            // and puts the results on the vm.timeentries 
            time.getTime().then(function(results) {
            	vm.timeentries = results;
            	console.log(vm.timeentries);
            }, function(error) {
            	console.log(error);
            });
            
        }
})();