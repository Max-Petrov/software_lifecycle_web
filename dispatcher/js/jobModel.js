;function getJobModel() {
    var jobTypes = [];

    var assignedJobs = [];
    var nonAssignedJobs = [];
    var completedJobs = [];
    var delayedJobs = [];
    var nonCompletedJobs = [];

    function concatArrays() {
        return nonAssignedJobs.concat(assignedJobs, nonCompletedJobs, completedJobs, delayedJobs)
    }

    /**
     *
     * @param statusId
     * @param successFunc(jobs)
     * @param errorFunc
     * @returns {*}
     */
    function loadJobByStatus(statusId, successFunc, errorFunc) {
        var status = '';
        if (typeof +statusId === 'number') {
            status = '?waypoint_status_id=' + statusId;
        }
        var jobsAjax = $.ajax({
            type: 'GET',
            url: 'http://localhost/api/waypoints' + status,
            success: function (jobs) {
                if (typeof successFunc === 'function') {
                    successFunc(jobs);
                }
            },
            error: function () {
                alert('Проблемы с загрузкой данных');
                if (typeof errorFunc === 'function') {
                    errorFunc();
                }
            }
        });

        return jobsAjax;
    }

    function loadTypes() {
        var typesAjax = $.ajax({
            type: 'GET',
            url: 'http://localhost/api/waypoint_types',
            success: function (types) {
                jobTypes = types;
            },
            error: function () {
                alert('Проблемы с загрузкой данных');
            }
        });

        return typesAjax;
    }

    function loadAssignedJobsArray(data) {
        assignedJobs = data;
    }

    function loadNonAssignedJobsArray(data) {
        nonAssignedJobs = data;
    }

    function loadCompletedJobsArray(data) {
        completedJobs = data;
    }

    function loadDelayedJobsArray(data) {
        delayedJobs = data;
    }

    function loadNonCompletedJobsArray(data) {
        nonCompletedJobs = data;
    }

    function loadAssignedJobs(successFunc, errorFunc) {
        return loadJobByStatus(2, successFunc, errorFunc);
    }

    function loadNonAssignedJobs(successFunc, errorFunc) {
        return loadJobByStatus(1, successFunc, errorFunc);
    }

    function loadCompletedJobs(successFunc, errorFunc) {
        return loadJobByStatus(3, successFunc, errorFunc);
    }

    function loadDelayedJobs(successFunc, errorFunc) {
        return loadJobByStatus(4, successFunc, errorFunc);
    }

    function loadNonCompletedJobs(successFunc, errorFunc) {
        return loadJobByStatus(5, successFunc, errorFunc);
    }

    return {
        loadData : function (func) {
            var typesAjax = loadTypes();
            var assignedJobsAjax = loadAssignedJobs(loadAssignedJobsArray);
            var nonAssignedJobsAjax = loadNonAssignedJobs(loadNonAssignedJobsArray);
            var completedJobsAjax = loadCompletedJobs(loadCompletedJobsArray);
            var delayedJobsAjax = loadDelayedJobs(loadDelayedJobsArray);
            var nonCompletedJobsAjax = loadNonCompletedJobs(loadNonCompletedJobsArray);

            $.when(typesAjax, assignedJobsAjax, nonAssignedJobsAjax, completedJobsAjax, delayedJobsAjax, nonCompletedJobsAjax)
                .done(function () {
                    if (typeof func === 'function'){
                        func();
                    }
                });
        },

        reloadAllJobs : function (func) {
            var assignedJobsAjax = loadAssignedJobs(loadAssignedJobsArray);
            var nonAssignedJobsAjax = loadNonAssignedJobs(loadNonAssignedJobsArray);
            var completedJobsAjax = loadCompletedJobs(loadCompletedJobsArray);
            var delayedJobsAjax = loadDelayedJobs(loadDelayedJobsArray);
            var nonCompletedJobsAjax = loadNonCompletedJobs(loadNonCompletedJobsArray);

            $.when(assignedJobsAjax, nonAssignedJobsAjax, completedJobsAjax, delayedJobsAjax, nonCompletedJobsAjax)
                .done(function () {
                    if (typeof func === 'function'){
                        func();
                    }
                });
        },

        getTypes : function () {
            return jobTypes;
        },

        getAssignedJobs : function () {
            return assignedJobs;
        },

        getNonAssignedJobs : function () {
            return nonAssignedJobs;
        },

        getCompletedJobs : function () {
            return completedJobs;
        },

        getDelayedJobs : function () {
            return delayedJobs;
        },

        getNonCompletedJobs : function () {
            return nonCompletedJobs;
        },

        insertJob : function (job, successFunc, errorFunc) {
            $.ajax({
                type: 'POST',
                url: 'http://localhost/api/waypoints',
                data: JSON.stringify(job),
                success: function (newJob) {
                    nonAssignedJobs.unshift(newJob);
                    if (typeof successFunc === 'function'){
                        successFunc();
                    }
                },
                error: function () {
                    alert('Проблемы с загрузкой данных');
                    if (typeof errorFunc === 'function'){
                        errorFunc();
                    }
                }
            });
        },

        updateJob : function (job, successFunc, errorFunc) {
            $.ajax({
                type: 'PUT',
                url: 'http://localhost/api/waypoints/' + job.id,
                data: JSON.stringify(job),
                success: function (data) {
                    var oldJob = findEntityById(concatArrays(), data.id);
                    for (var key in data) {
                        oldJob[key] = data[key];
                    }
                    if (typeof successFunc === 'function'){
                        successFunc();
                    }
                },
                error: function () {
                    alert('Проблемы с загрузкой данных');
                    if (typeof errorFunc === 'function'){
                        errorFunc();
                    }
                }
            });
        }
    }
};