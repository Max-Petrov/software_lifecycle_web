;$(function () {
    var view = getView();
    view.loadData();
});

function getView() {
    var tbody = $('#registrationsTable').find('tbody');
    var btnNew = $('#newRegistration');

    var driversSelect = $('#driversSelect');
    var vehiclesSelect = $('#vehiclesSelect');
    var devicesSelect = $('#devicesSelect');
    var saveBtn = $('#saveRegBtn');
    var modalBox = $("#registrationModalBox");

    /**
     * Объект, который возвращается из функции "getRegistrationsData", описанной в файле "registrationModel.js"
     * @type {{loadData, getDrivers, getRegisterDrivers, getNonRegisterDrivers, getVehicles, getRegisterVehicles, getNonRegisterVehicles, getDevices, getRegisterDevices, getNonRegisterDevices, getRegistrations, insertRegistration, updateRegistration}|*}
     */
    var registrationModel;
    var registrations;
    var drivers;
    var vehicles;
    var devices;

    function reloadRegs() {
        registrations = registrationModel.getRegistrations();
    }

    function reloadDrivers() {
        drivers = registrationModel.getNonRegisterDrivers();
    }

    function reloadVehicles() {
        vehicles = registrationModel.getNonRegisterVehicles();
    }

    function reloadDevices() {
        devices = registrationModel.getNonRegisterDevices();
    }

    function load() {
        registrationModel = getRegistrationModel();
        registrationModel.loadData(init);
    }

    function init() {
        reloadRegs();
        reloadDrivers();
        reloadVehicles();
        reloadDevices();

        buildTable(tbody, registrations);

        btnNew.click(function () {
            var msg = '';
            if (drivers.length === 0){
                msg += ' водителей,';
            }
            if (vehicles.length === 0){
                msg += ' автомобилей,';
            }
            if (devices.length === 0){
                msg += ' устройств,';
            }

            if (msg.length !== 0){
                alert('Нет свободных' + msg.substr(0, msg.length-1));
            } else {
                loadDataIntoModalBox(drivers, vehicles, devices);
                modalBox.modal('show');
            }
        });

        saveBtn.click(function () {
            var registration = getRegistrationDataFromModalBox();
            registrationModel.insertRegistration(registration, reloadTable);
        });
    }

    function reloadTable() {
        alert('Операция завершена успешно!');
        reloadRegs();
        buildTable(tbody, registrations);
    }

    function buildTable(tbody, registrations) {
        tbody.empty();
        $.each(registrations, function (i, registration) {
            tbody.append(
                '<tr class="reg-row" id="' + registration.id + '">' +
                '<td>' + registration.id + '</td>' +
                '<td>' + registration.driver.name + '</td>' +
                '<td>' + registration.vehicle.model.name + '</td>' +
                '<td>' + registration.vehicle['number'] + '</td>' +
                '<td>' + registration.device.model.name + '</td>' +
                '<td>' + registration.device['phone_number'] + '</td>' +
                '<td>' + registration['time_start'] + '</td>' +
                '<td class="cancel-col" >' +
                '<button class="cancel-reg-btn btn-primary">Завершить</button>' + '</td>' +
                '</tr>'
            );
        });
        setClickListenerOnCancelCol();
    }

    function setClickListenerOnCancelCol() {
        $(".cancel-reg-btn").off();
        $(".cancel-reg-btn").click(function () {
            if (confirm('Сделать регистрацию недействительной?')){
                var id = $(this).parent().parent().attr('id');
                var timeFinish = getCurrentDateForDatetime();
                var reg = registrations.find( function (value) { return value.id == id } );
                reg['actual'] = 0;
                reg['time_finish'] = timeFinish;
                registrationModel.updateRegistration(reg, reloadTable);
            }
        });
    }

    function getRegistrationDataFromModalBox() {
        var driverId = $('select[name=driversSelect]').val();
        var vehicleId = $('select[name=vehiclesSelect]').val();
        var deviceId = $('select[name=devicesSelect]').val();
        var dateStart = getCurrentDateForDatetime();
        var dateFinish = null;

        var registration = {
            "actual": true,
            "time_start": dateFormatForJson(dateStart),
            "time_finish": dateFormatForJson(dateFinish),
            "driver_id": driverId,
            "vehicle_id": vehicleId,
            "device_id": deviceId
        };

        return registration;
    }

    function loadDataIntoModalBox(drivers, vehicles, devices) {
        driversSelect.empty();
        vehiclesSelect.empty();
        devicesSelect.empty();

        $.each(drivers, function (i, driver) {
            driversSelect.append(
                '<option value = ' + driver.id + '>' + driver.name + '</option>'
            );
        });

        $.each(vehicles, function (i, vehicle) {
            vehiclesSelect.append(
                '<option value = ' + vehicle.id + '>' + vehicle.model.name + ' (' + vehicle.number + ')' + '</option>'
            );
        });

        $.each(devices, function (i, device) {
            devicesSelect.append(
                '<option value = ' + device.id + '>' + device.model.name + ' (' + device['phone_number'] + ')' + '</option>'
            );
        });
    }

    return {
        loadData : function () {
            load();
        }
    }
};




//     loadRegistrationsIntoTable('http://localhost/api/driver_registrations?with_driver=true&with_vehicle=true&with_device=true');
//
//     $('#newRegistration').click(function () {
//         loadNonRegisterDataIntoModalBox();
//         $('#saveBtn').off();
//         $('#saveBtn').click(function(){
//             newRegistration('POST')
//         });
//     });
//
//     $('#onlyActual').change(function () {
//         if (this.checked){
//             loadRegistrationsIntoTable('http://localhost/api/driver_registrations?with_driver=true&with_vehicle=true&with_device=true&actual=true');
//         }
//         else {
//             loadRegistrationsIntoTable('http://localhost/api/driver_registrations?with_driver=true&with_vehicle=true&with_device=true');
//         }
//     });
//
//
//
//
//
// });
//
// function newRegistration(method) {
//     if (method != 'POST' && method != 'PUT') return;
//     var id = 0;
//     if (method == 'PUT') id = $('input[name=registrationId]').val();
//     var driverId = $('select[name=driversSelect]').val();
//     var vehicleId = $('select[name=vehiclesSelect]').val();
//     var deviceId = $('select[name=devicesSelect]').val();
//     var actual = $('select[name=actual]').val();
//     var dateStart = $('input[name=dateStart]').val();
//     var dateFinish = $('input[name=dateFinish]').val();
//     if (dateStart == '') dateStart = null;
//     if (dateFinish == '') dateFinish = null;
//
//     var registration = {
//         "id" : id,
//         "actual" : actual,
//         "time_start" : dateFormatForJson(dateStart),
//         "time_finish" : dateFormatForJson(dateFinish),
//         "driver_id" : driverId,
//         "vehicle_id" : vehicleId,
//         "device_id" : deviceId
//     };
//
//     $.ajax({
//         type: method,
//         url: 'http://localhost/api/driver_registrations' + (method === 'PUT' ? ('/' + id) : ''),
//         data: JSON.stringify(registration),
//         success: function () {
//             alert('Регистрация прошла успешно!');
//             if ($('#onlyActual').is(':checked')){
//                 loadRegistrationsIntoTable('http://localhost/api/driver_registrations?with_driver=true&with_vehicle=true&with_device=true&actual=true');
//             }
//             else {
//                 loadRegistrationsIntoTable('http://localhost/api/driver_registrations?with_driver=true&with_vehicle=true&with_device=true');
//             }
//         },
//         error: function () {
//             alert('Проблемы с сохранением');
//         }
//     });
// }
//
// function loadRegistrationsIntoTable(url) {
//     $.ajax({
//         type: 'GET',
//         url: url,
//         success: function (registrations) {
//             var body;
//             body = $('#registrationsTable').find('tbody');
//             body.empty();
//             $.each(registrations, function (i, registration) {
//                 body.append(
//                     '<tr class="reg-row" id="' + registration.id + '">' +
//                     '<td>' + registration.id + '</td>' +
//                     '<td>' + registration.driver.name + '</td>' +
//                     '<td>' + registration.vehicle.model.name + '</td>' +
//                     '<td>' + registration.device.model.name + '</td>' +
//                     '<td>' + registration.device['phone_number'] + '</td>' +
//                     '<td>' + registration['time_start'] + '</td>' +
//                     '<td>' + (registration['time_finish'] == null ? 'Н/Д' : registration['time_finish']) + '</td>' +
//                     '<td>' + (registration.actual ? 'Да' : 'Нет') + '</td>' +
//                     '</tr>'
//                 );
//             });
//             $('.reg-info').off();
//             $('.reg-info').click(function () {
//                 loadDataIntoModalBox(this);
//             });
//         },
//         error: function () {
//             alert('Проблемы с загрузкой данных');
//         }
//     });
// }
//
// function loadNonRegisterDataIntoModalBox() {
//     drivers = [];
//     $.ajax({
//         type: 'GET',
//         url: 'http://localhost/api/drivers?status_id=1&register=false',
//         success: function (data) {
//             drivers = data;
//             var select = $('#driversSelect');
//             select.empty();
//             $.each(drivers, function (i, driver) {
//                 select.append(
//                     '<option value = ' + driver.id + '>' + driver.name + '</option>'
//                 );
//             });
//             loadVehiclesIntoModalBox();
//         },
//         error: function () {
//             alert('Проблемы с загрузкой данных');
//         }
//     });
// }
//
// function loadDataIntoModalBox(e) {
//     drivers = [];
//     var driversSelect = $('#driversSelect');
//     var vehiclesSelect = $('#vehiclesSelect');
//     var devicesSelect = $('#devicesSelect');
//     $.ajax({
//         type: 'GET',
//         url: 'http://localhost/api/drivers?status_id=1&register=false',
//         success: function (data) {
//             drivers = data;
//             select.empty();
//             $.each(drivers, function (i, driver) {
//                 driversSelect.append(
//                     '<option value = ' + driver.id + '>' + driver.name + '</option>'
//                 );
//             });
//             vehicles = [];
//             $.ajax({
//                 type: 'GET',
//                 url: 'http://localhost/api/vehicles?status_id=1&register=false',
//                 success: function (data) {
//                     vehicles = data;
//                     select.empty();
//                     $.each(vehicles, function (i, vehicle) {
//                         vehiclesSelect.append(
//                             '<option value = ' + vehicle.id + '>' + vehicle.model.name + '</option>'
//                         );
//                     });
//                     devices = [];
//                     $.ajax({
//                         type: 'GET',
//                         url: 'http://localhost/api/devices?status_id=2&register=false',
//                         success: function (data) {
//                             devices = data;
//                             select.empty();
//                             $.each(devices, function (i, device) {
//                                 devicesSelect.append(
//                                     '<option value = ' + device.id + '>' + device.model.name + '</option>'
//                                 );
//                             });
//
//                             var regId = $(e).attr('id');
//                             $.ajax({
//                                 type: 'GET',
//                                 url: 'http://localhost/api/driver_registrations/' + regId + '?with_driver=true&with_device=true&with_vehicle=true',
//                                 success: function (reg) {
//
//                                     $('input[name=registrationId]').val(reg.id);
//                                     $('select[name=driversSelect]').val(reg['driver_id']);
//                                     $('select[name=vehiclesSelect]').val(reg['vehicle_id']);
//                                     $('select[name=devicesSelect]').val(reg['device_id']);
//                                     $('select[name=actual]').val(reg.actual);
//                                     $('input[name=dateStart]').val(stringFormatForDatetime(reg['time_start']));
//                                     $('input[name=dateFinish]').val(stringFormatForDatetime(reg['time_finish']));
//                                     $('#saveBtn').off();
//                                     $('#saveBtn').click(function(){
//                                         newRegistration('PUT');
//                                     });
//                                     $("#registrationModalBox").modal('show');
//
//                                 },
//                                 error: function () {
//                                     alert('Проблемы с сохранением');
//                                 }
//                             });
//                         },
//                         error: function () {
//                             alert('Проблемы с загрузкой данных');
//                         }
//                     });
//                 },
//                 error: function () {
//                     alert('Проблемы с загрузкой данных');
//                 }
//             });
//         },
//         error: function () {
//             alert('Проблемы с загрузкой данных');
//         }
//     });
// }
//
// function loadVehiclesIntoModalBox() {
//     vehicles = [];
//     $.ajax({
//         type: 'GET',
//         url: 'http://localhost/api/vehicles?status_id=1&register=false',
//         success: function (data) {
//             vehicles = data;
//             var select = $('#vehiclesSelect');
//             select.empty();
//             $.each(vehicles, function (i, vehicle) {
//                 select.append(
//                     '<option value = ' + vehicle.id + '>' + vehicle.model.name + '</option>'
//                 );
//             });
//             loadDevicesIntoModalBox();
//         },
//         error: function () {
//             alert('Проблемы с загрузкой данных');
//         }
//     });
// }
//
// function loadDevicesIntoModalBox() {
//     devices = [];
//     $.ajax({
//         type: 'GET',
//         url: 'http://localhost/api/devices?status_id=2&register=false',
//         success: function (data) {
//             devices = data;
//             var select = $('#devicesSelect');
//             select.empty();
//             $.each(devices, function (i, device) {
//                 select.append(
//                     '<option value = ' + device.id + '>' + device.model.name + '</option>'
//                 );
//             });
//
//             var msg = '';
//             if (drivers.length == 0){
//                 msg += ' водителей,';
//             }
//             if (vehicles.length == 0){
//                 msg += ' автомобилей,';
//             }
//             if (devices.length == 0){
//                 msg += ' устройств,';
//             }
//
//             if (msg.length != 0){
//                 alert('Нет доступных' + msg.substr(0, msg.length-1));
//             }
//             else {
//                 $('#dateStart').val(getCurrentDateForDatetime());
//
//                 $('#dateFinish').val('');
//
//                 $("#registrationModalBox").modal('show');
//             }
//
//         },
//         error: function () {
//             alert('Проблемы с загрузкой данных');
//         }
//     });
// }

