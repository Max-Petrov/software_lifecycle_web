;$(function () {
    var view = getView();
    view.loadData();
});

function getView() {
    var jobModel;

    var types = [];
    var assignedJobs = [];
    var nonAssignedJobs = [];
    var completedJobs = [];
    var delayedJobs = [];
    var nonCompletedJobs = [];

    var modalBox = $("#jobModalBox");
    var jobIdInput = $("#jobId");
    var addressText = $('#addressText');
    var cargoText = $('#cargoText');
    var stopTimeText = $('#stopTime');
    var typeSelect = $('#typeSelect');

    var creationTimeText = $("#creationTime");
    var timeStartPlan = $("#timeStartPlan");
    var timeStartFact = $("#timeStartFact");
    var timeFinishPlan = $('#timeFinishPlan');
    var timeFinishFact = $('#timeFinishFact');
    var statusId = $('#statusId');

    var saveBtn = $('#saveJobBtn');
    var tbody = $('#jobsTable').find('tbody');
    var btnNew = $('#newJob');

    var assignedChb = $('#assignedChb');
    var nonAssignedChb = $('#nonAssignedChb');
    var completedChb = $('#completeChb');
    var delayedChb = $('#delayedChb');
    var nonCompletedChb = $('#nonCompletedChb');

    function concatArrays() {
        return nonAssignedJobs.concat(assignedJobs, nonCompletedJobs, completedJobs, delayedJobs)
    }

    function load() {
        jobModel = getJobModel();
        jobModel.loadData(init);
    }

    function reloadAssignedJobs() {
        assignedJobs = jobModel.getAssignedJobs();
    }

    function reloadNonAssignedJobs() {
        nonAssignedJobs = jobModel.getNonAssignedJobs();
    }

    function reloadCompletedJobs() {
        completedJobs = jobModel.getCompletedJobs();
    }

    function reloadDelayedJobs() {
        delayedJobs = jobModel.getDelayedJobs();
    }

    function reloadNonCompletedJobs() {
        nonCompletedJobs = jobModel.getNonCompletedJobs();
    }

    function init() {
        types = jobModel.getTypes();
        setAllCheckboxes();
        reloadAssignedJobs();
        reloadNonAssignedJobs();
        reloadCompletedJobs();
        reloadDelayedJobs();
        reloadNonCompletedJobs();
        buildTable(tbody, concatArrays());
        setEventForCheckboxes();
        setBtnNewClick();
        setTableRowClick();
    }

    function setAllCheckboxes() {
        assignedChb.prop('checked', true);
        nonAssignedChb.prop('checked', true);
        completedChb.prop('checked', true);
        nonCompletedChb.prop('checked', true);
        delayedChb.prop('checked', true);
    }

    function setBtnNewClick() {
        btnNew.off();
        btnNew.click(function () {
            loadDataIntoModalBox();
            modalBox.modal('show');
        });
    }

    function setTableRowClick() {
        $('.job-row').off();
        $('.job-row').click(function () {
            var job = findEntityById(concatArrays(), $(this).prop('id'));
            loadDataIntoModalBox(job);
            modalBox.modal('show');
        });
    }

    function setEventForCheckboxes() {
        $('.filter-jobs').change(function () {
            buildTable(tbody, filterJobsByCheckboxes());
            setTableRowClick();
        });
    }

    function filterJobsByCheckboxes() {
        var jobs = [];
        if (nonAssignedChb.prop('checked')){
            jobs = jobs.concat(nonAssignedJobs);
        }
        if (assignedChb.prop('checked')){
            jobs = jobs.concat(assignedJobs);
        }
        if (nonCompletedChb.prop('checked')){
            jobs = jobs.concat(nonCompletedJobs);
        }
        if (completedChb.prop('checked')){
            jobs = jobs.concat(completedJobs);
        }
        if (delayedChb.prop('checked')){
            jobs = jobs.concat(delayedJobs);
        }
        return jobs;
    }

    function buildTable(tbody, jobs) {
        tbody.empty();
        $.each(jobs, function (i, job) {
            tbody.append(
                '<tr class="job-row" id="' + job.id + '">' +
                '<td>' + job.id + '</td>' +
                '<td>' + job['time_of_creation'] + '</td>' +
                '<td>' + job['waypoint_status'].name + '</td>' +
                '<td>' + job['point_address'] + '</td>' +
                '<td>' + job.cargo + '</td>' +
                '<td>' + job['waypoint_type'].name + '</td>' +
                '<td>' + job['time_stop_expected'] + ' мин.' + '</td>' +
                '<td>' + (job['arrive_time_plan'] !== null ? job['arrive_time_plan'] : 'Н/Д') + '</td>' +
                '<td>' + (job['arrive_time_fact'] !== null ? job['arrive_time_fact'] : 'Н/Д') + '</td>' +
                '<td>' + (job['leave_time_plan'] !== null ? job['leave_time_plan'] : 'Н/Д') + '</td>' +
                '<td>' + (job['leave_time_fact'] !== null ? job['leave_time_fact'] : 'Н/Д') + '</td>' +
                '</tr>'
            );
        });
    }

    function reloadTable() {
        reloadNonAssignedJobs();
        buildTable(tbody, filterJobsByCheckboxes());
        setTableRowClick();
    }

    function loadDataIntoModalBox(job) {
        typeSelect.empty();
        saveBtn.off();
        $.each(types, function (i, type) {
            typeSelect.append(
                '<option value="' + type.id + '">' + type.name + '</option>'
            );
        });
        if (typeof job === 'object') {
            $('#modal-title').text('Изменить задание');
            jobIdInput.val(job.id);
            creationTimeText.val(job['time_of_creation']);
            addressText.val(job['point_address']);
            cargoText.val(job.cargo);
            stopTimeText.val(job['time_stop_expected']);
            typeSelect.val(job['waypoint_type'].id);
            timeStartPlan.val(job['arrive_time_plan']);
            timeStartFact.val(job['arrive_time_fact']);
            timeFinishPlan.val(job['leave_time_plan']);
            timeFinishFact.val(job['leave_time_fact']);
            statusId.val(job['waypoint_status_id']);
            saveBtn.click(function () {
                jobModel.updateJob(getDataFromModalBox(), reloadTable);
            });
        } else {
            $('#modal-title').text('Новое задание');
            jobIdInput.val(-1);
            creationTimeText.val('');
            addressText.val('');
            cargoText.val('');
            stopTimeText.val('');
            timeStartPlan.val('');
            timeStartFact.val('');
            timeFinishPlan.val('');
            timeFinishFact.val('');
            statusId.val(2);
            saveBtn.click(function () {
                jobModel.insertJob(getDataFromModalBox(), reloadTable);
            });
        }
    }
    
    function getDataFromModalBox() {
        return {
            id : jobIdInput.val(),
            time_of_creation : creationTimeText.val() === '' ? getCurrentDateForDatetime() : creationTimeText.val(),
            point_address : addressText.val(),
            cargo : cargoText.val(),
            time_stop_expected : stopTimeText.val(),
            waypoint_type_id : typeSelect.val(),
            waypoint_status_id : statusId.val(),
            arrive_time_plan : '2018-05-30 14:15:18',
            leave_time_plan : '2018-05-30 14:15:18',
            point_latitude : '57.003784',
            point_longitude : '40.920857'
        }
    }

    return {
        loadData : function() {
            load();
        }
    }
};

// $(function (){
//     $.ajax({
//         type: 'GET',
//         url: 'http://localhost/api/waypoints',
//         success: function (jobs) {
//             var body;
//             body = $('#jobsTable').find('tbody');
//             $.each(jobs, function (i, job) {
//                 body.append(
//                     '<tr>' +
//                     '<td>' + job.id + '</td>' +
//                     '<td>' + '2018-03-27 00:00:00' + '</td>' +
//                     '<td>' + job['waypoint_status'].name + '</td>' +
//                     '<td>' + job.address + '</td>' +
//                     '<td>' + job.cargo + '</td>' +
//                     '<td>' + job['waypoint_type'].name + '</td>' +
//                     '<td>' + job['time_stop_expected'] + ' мин.' + '</td>' +
//                     '<td>' + job['start_time_plan'] + '</td>' +
//                     '<td>' + job['start_time_fact'] + '</td>' +
//                     '<td>' + job['finish_time_plan'] + '</td>' +
//                     '<td>' + job['finish_time_fact'] + '</td>' +
//                     '</tr>'
//                 );
//             });
//
//         },
//         error: function () {
//             alert('Проблемы с загрузкой данных');
//         }
//     });
//
//     $('#newJob').click(function () {
//         $.ajax({
//             type: 'GET',
//             url: 'http://localhost/api/waypoint_types',
//             success: function (types) {
//                 var select = $('#typeSelect');
//                 select.empty();
//                 $.each(types, function (i, type) {
//                     select.append(
//                         '<option>' + type.name + '</option>'
//                     );
//                 });
//             },
//             error: function () {
//                 alert('Проблемы с загрузкой данных');
//             }
//         });
//
//         $("#jobModalBox").modal('show');
//     });
// });