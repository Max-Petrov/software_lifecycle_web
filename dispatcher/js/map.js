$(document).ready(function() {
    ymaps.ready(init);
    var myMap,
        myPlacemark;

    function init() {
        myMap = new ymaps.Map("map", {
            center: [55.76, 37.64],
            zoom: 7
        });

        loadLocations();
    }

    function loadLocations(){
        $.ajax({
            type: 'GET',
            url: 'http://localhost/api/device_locations?last=true&with_registrations=true',
            success: function (locations) {
                $.each(locations, function (i, location) {
                    myPlacemark = new ymaps.Placemark([location.latitude, location.longitude], {
                        iconContent: location['driver_registration'].driver.name,
                        hintContent: location['driver_registration'].driver.name,
                        balloonContent: location['location_time']
                    },
                    {
                        preset: "islands#blueStretchyIcon"
                    });

                    myMap.geoObjects.add(myPlacemark);
                });

            },
            error: function () {
                alert('Проблемы с загрузкой данных');
            }
        });
    }


});