;function getRegistrationModel() {
    var registerDrivers = [];
    var registerVehicles = [];
    var registerDevices = [];
    var nonRegisterDrivers = [];
    var nonRegisterVehicles = [];
    var nonRegisterDevices = [];
    var registrations = [];

    var getRegisterDriversAjax = $.ajax({
        type: 'GET',
        url: 'http://localhost/api/drivers?status_id=1&register=true',
        success: function (data) {
            registerDrivers = data;
        },
        error: function () {
            alert('Проблемы с загрузкой данных');
            registerDrivers = [];
        }
    });

    var getRegisterVehiclesAjax = $.ajax({
        type: 'GET',
        url: 'http://localhost/api/vehicles?status_id=1&register=true',
        success: function (data) {
            registerVehicles = data;
        },
        error: function () {
            alert('Проблемы с загрузкой данных');
            registerVehicles = [];
        }
    });

    var getRegisterDevicesAjax = $.ajax({
        type: 'GET',
        url: 'http://localhost/api/devices?status_id=2&register=true',
        success: function (data) {
            registerDevices = data;
        },
        error: function () {
            alert('Проблемы с загрузкой данных');
            registerDevices = [];
        }
    });

    var getNonRegisterDriversAjax = $.ajax({
        type: 'GET',
        url: 'http://localhost/api/drivers?status_id=1&register=false',
        success: function (data) {
            nonRegisterDrivers = data;
        },
        error: function () {
            alert('Проблемы с загрузкой данных');
            nonRegisterDrivers = [];
        }
    });

    var getNonRegisterVehiclesAjax = $.ajax({
        type: 'GET',
        url: 'http://localhost/api/vehicles?status_id=1&register=false',
        success: function (data) {
            nonRegisterVehicles = data;
        },
        error: function () {
            alert('Проблемы с загрузкой данных');
            nonRegisterVehicles = [];
        }
    });

    var getNonRegisterDevicesAjax = $.ajax({
        type: 'GET',
        url: 'http://localhost/api/devices?status_id=2&register=false',
        success: function (data) {
            nonRegisterDevices = data;
        },
        error: function () {
            alert('Проблемы с загрузкой данных');
            nonRegisterDevices = [];
        }
    });

    var getRegistrationsAjax = $.ajax({
        type: 'GET',
        url: 'http://localhost/api/driver_registrations?actual=true',
        success: function (data) {
            registrations = data;
        },
        error: function () {
            alert('Проблемы с загрузкой данных');
            registrations = [];
        }
    });



    function replaceEntity(from, to, id) {
        var index = findIndexById(from, id);
        var entity = from.splice(index, 1);
        to.push(entity[0]);
    }

    function includeAgregatesToReg(registration) {
        registration.driver = findEntityById(registerDrivers, registration['driver_id']);
        registration.vehicle = findEntityById(registerVehicles,registration['vehicle_id']);
        registration.device = findEntityById(registerDevices, registration['device_id']);
    }

    return {
        loadData : function(func){
            $.when(getRegisterDriversAjax, getRegisterVehiclesAjax, getRegisterDevicesAjax, getNonRegisterDriversAjax,
                getNonRegisterVehiclesAjax, getNonRegisterDevicesAjax, getRegistrationsAjax)
                .done(function () {
                    $.each(registrations, function (i, registration) {
                        includeAgregatesToReg(registration);
                    });
                    if (typeof func === 'function'){
                        func();
                    }
                });
        },

        getDrivers : function () {
            return nonRegisterDrivers.concat(registerDrivers);
        },

        getRegisterDrivers : function () {
            return registerDrivers;
        },

        getNonRegisterDrivers : function () {
            return nonRegisterDrivers;
        },

        getVehicles : function () {
            return nonRegisterVehicles.concat(registerVehicles);
        },

        getRegisterVehicles : function () {
            return registerVehicles;
        },

        getNonRegisterVehicles : function () {
            return nonRegisterVehicles;
        },

        getDevices : function () {
            return nonRegisterDevices.concat(registerDevices);
        },

        getRegisterDevices : function () {
            return registerDevices;
        },

        getNonRegisterDevices : function () {
            return nonRegisterDevices;
        },

        getRegistrations : function () {
            return registrations;
        },

        insertRegistration : function (registration, successFunc, errorFunc) {
            $.ajax({
                type: 'POST',
                url: 'http://localhost/api/driver_registrations',
                data: JSON.stringify(registration),
                success: function (data) {
                    registration.id = data.id;
                    replaceEntity(nonRegisterDrivers, registerDrivers, registration['driver_id']);
                    replaceEntity(nonRegisterVehicles, registerVehicles, registration['vehicle_id']);
                    replaceEntity(nonRegisterDevices, registerDevices, registration['device_id']);
                    includeAgregatesToReg(registration);
                    registrations.unshift(registration);
                    if (typeof (successFunc) === 'function'){
                        successFunc();
                    }
                },
                error: function () {
                    alert('Проблемы с сохранением');
                    if (typeof (errorFunc) === 'function'){
                        errorFunc();
                    }
                }
            });
        },

        updateRegistration : function (registration, successFunc, errorFunc) {
            $.ajax({
                type: 'PUT',
                url: 'http://localhost/api/driver_registrations/' + registration.id,
                data: JSON.stringify(registration),
                success: function () {
                    var index = findIndexById(registrations, registration.id);
                    registrations.splice(index, 1);
                    replaceEntity(registerDrivers, nonRegisterDrivers, registration['driver_id']);
                    replaceEntity(registerVehicles, nonRegisterVehicles, registration['vehicle_id']);
                    replaceEntity(registerDevices, nonRegisterDevices, registration['device_id']);
                    if (typeof (successFunc) === 'function'){
                        successFunc();
                    }
                },
                error: function () {
                    alert('Проблемы с сохранением');
                    if (typeof (errorFunc) === 'function'){
                        errorFunc();
                    }
                }
            });
        }
    };
};