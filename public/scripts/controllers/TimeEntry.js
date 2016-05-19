(function() {

  'use strict';
    
    angular
        .module('timeTracker')
        .controller('TimeEntry', TimeEntry);

        function TimeEntry(time, user, $scope, $confirm, toaster) {

            // vm is our capture variable
            var vm = this;

            vm.timeentries = [];
            vm.totalTime = {};
            vm.users = [];

            // Initialize the clockIn and clockOut times to the current time ceil 10.
            var now = Date.now();
            var now_ceil = Math.ceil( now / 600000 ) * 600000;
            vm.clockIn = moment(now_ceil);
            vm.clockOut = moment(now_ceil);

            // Grab all the time entries saved in the database
            getTimeEntries();

            // Get the users from the database so we can select who the time entry belongs to
            getUsers();

            function getUsers() {
                user.getUsers().then(function(result) {
                    vm.users = result;
                }, function(error) {
                    console.log(error);
                });
            }

            // Fetches the time entries from the static JSON file
            // and puts the results on the vm.timeentries 
            function getTimeEntries() {
                time.getTime().then(function(results) {
                    vm.timeentries = results;
                    updateTotalTime(vm.timeentries);
                    console.log(vm.timeentries);
                }, function(error) {
                    console.log(error);
                });
            }

            // Update the values in the total time box by calling the getTotalTime method on the time service
            function updateTotalTime(timeentries) {
                vm.totalTime = time.getTotalTime(timeentries);
            }

            // Submits the time entry that will be called when we click the "Log Time" button
            vm.logNewTime = function() {
                // Make sure that the clock-in time isn't after the clock-out time
                if (vm.clockOut < vm.clockIn) {
                    toaster.pop('error', "Notice", "You can't clock out before you clock in!");
                    return;
                }

                // Make sure the time entry is greater than zero!
                if (vm.clockOut - vm.clockIn === 0) {
                    toaster.pop('error', "Notice", "Your time entry has to be greater than zero!");
                    return;
                }

                // Call method saveTime on the time service to save the new time entry to the database
                time.saveTime({
                    "user_id":vm.timeEntryUser.id,
                    "start_time":vm.clockIn,
                    "end_time":vm.clockOut,
                    "comment":vm.comment
                }).then(function(success) {
                    toaster.pop('success', "Notice", "Thêm dữ liệu thành công");
                    getTimeEntries();
                    console.log(success);
                }, function(error) {
                    console.log(error);
                });
                
                getTimeEntries();
                
                // Reset clockIn and clockOut times to the current time
                vm.clockIn = moment();
                vm.clockOut = moment();
                
                // Clear comment field
                vm.comment = '';
                
                // Deselect the user
                vm.timeEntryUser = '';

            };
            
            vm.updateTimeEntry = function(timeentry) {
                // Collect data that will be passed to the updateTime method
                var updateTimeEntry = {
                    "id":timeentry.id,
                    "user_id":timeentry.user.id,
                    "start_time":timeentry.start_time,
                    "end_time":timeentry.end_time,
                    "comment":timeentry.comment
                };
                
                // Update the time entry and then refresh the list
                time.updateTime(updateTimeEntry).then(function(success) {
                    toaster.pop('success', "Notice", "Sửa dữ liệu thành công");
                    getTimeEntries();
                    $scope.showEditDialog = false;
                    console.log(success);
                }, function(error) {
                    console.log(error);
                });
            };
            
            // Specify the time entry to be deleted and pass it to the deleteTime method on the time service
            vm.deleteTimeEntry = function(timeentry) {
                var id = timeentry.id;
                
                $confirm({text: 'Are you sure you want to delete?', title: 'Delete it', ok: 'Yes', cancel: 'No'})
                .then(function() {
                    time.deleteTime(id).then(function(success) {
                        toaster.pop('info', "Notice", "Xóa dữ liệu thành công");
                        getTimeEntries();
                        console.log(success);
                    }, function(error) {
                        console.log(error);
                    });
                });
                
            };
            
        }
})();