$(function (){
    $.ajax({
        type: 'GET',
        url: 'http://localhost/api/route_jobs',
        success: function (routes) {
            var body;
            body = $('#routesTable').find('tbody');
            $.each(routes, function (i, route) {
                startPlan = route['start_time_plan'] == null ? 'Н/Д' : route['start_time_plan'];
                startFact = route['start_time_fact'] == null ? 'Н/Д' : route['start_time_fact'];
                finishPlan = route['finish_time_plan'] == null ? 'Н/Д' : route['finish_time_plan'];
                finishFact = route['finish_time_fact'] == null ? 'Н/Д' : route['finish_time_fact'];
                body.append(
                    '<tr>' +
                    '<td>' + route.id + '</td>' +
                    '<td>' + route['status'].name + '</td>' +
                    '<td>' + route['created_time'] + '</td>' +
                    '<td>' + startPlan + '</td>' +
                    '<td>' + startFact + '</td>' +
                    '<td>' + finishPlan + '</td>' +
                    '<td>' + finishFact + '</td>' +
                    '</tr>'
                );
            });

        },
        error: function () {
            alert('Проблемы с загрузкой данных');
        }
    })
});