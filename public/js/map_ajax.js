// Tournament map
ymaps.ready(init);

function init() {
    var myPlacemark,
        myMap = new ymaps.Map('LL_tournamentLocation', {
            center: [50.27, 30.31],
            zoom: 9
        }, {
            searchControlProvider: 'yandex#search'
        });

    // клик на карте
    myMap.events.add('click', function (e) {
        var coords = e.get('coords');
        $('#LL_coordsX').val(coords[0]);
        $('#LL_coordsY').val(coords[1]);
        console.log('coords: ' + $('#LL_coordsX').val());
        console.log('coords: ' + $('#LL_coordsY').val());
        //передвигаем метку
        if (myPlacemark) {
            myPlacemark.geometry.setCoordinates(coords);
        }
        // или создаем.
        else {
            myPlacemark = createPlacemark(coords);
            myMap.geoObjects.add(myPlacemark);
            // Слушаем событие окончания перетаскивания на метке.
            myPlacemark.events.add('dragend', function () {
                getAddress(myPlacemark.geometry.getCoordinates());
            });
        }
        getAddress(coords);
    });

    // создание метки
    function createPlacemark(coords) {
        return new ymaps.Placemark(coords, {
            iconCaption: 'поиск...'
        }, {
            preset: 'islands#violetDotIconWithCaption',
            draggable: true
        });
    }

    // Определяем адрес по координатам (обратное геокодирование).
    function getAddress(coords) {
        myPlacemark.properties.set('iconCaption', 'поиск...');
        ymaps.geocode(coords).then(function (res) {
            var firstGeoObject = res.geoObjects.get(0);

            myPlacemark.properties
                .set({
                    // Формируем строку с данными об объекте.
                    iconCaption: [
                        // Название населенного пункта или вышестоящее административно-территориальное образование.
                        firstGeoObject.getLocalities().length ? firstGeoObject.getLocalities() : firstGeoObject.getAdministrativeAreas(),
                        // Получаем путь до топонима, если метод вернул null, запрашиваем наименование здания.
                        firstGeoObject.getThoroughfare() || firstGeoObject.getPremise()
                    ].filter(Boolean).join(', '),
                    // В качестве контента балуна задаем строку с адресом объекта.
                    balloonContent: firstGeoObject.getAddressLine()
                });
        });
    }
}

// Event map
ymaps.ready(init2);

function init2() {
    var myPlacemark,
        myMap = new ymaps.Map('LL_eventLocation', {
            center: [50.27, 30.31],
            zoom: 9
        }, {
            searchControlProvider: 'yandex#search'
        });

    // клик на карте
    myMap.events.add('click', function (e) {
        var coords = e.get('coords');
        $('#LL_coordsEventX').val(coords[0]);
        $('#LL_coordsEventY').val(coords[1]);
        console.log('coords: ' + $('#LL_coordsEventX').val());
        console.log('coords: ' + $('#LL_coordsEventY').val());
        //передвигаем метку
        if (myPlacemark) {
            myPlacemark.geometry.setCoordinates(coords);
        }
        // или создаем.
        else {
            myPlacemark = createPlacemark(coords);
            myMap.geoObjects.add(myPlacemark);
            // Слушаем событие окончания перетаскивания на метке.
            myPlacemark.events.add('dragend', function () {
                getAddress(myPlacemark.geometry.getCoordinates());
            });
        }
        getAddress(coords);
    });

    // создание метки
    function createPlacemark(coords) {
        return new ymaps.Placemark(coords, {
            iconCaption: 'поиск...'
        }, {
            preset: 'islands#violetDotIconWithCaption',
            draggable: true
        });
    }

    // Определяем адрес по координатам (обратное геокодирование).
    function getAddress(coords) {
        myPlacemark.properties.set('iconCaption', 'поиск...');
        ymaps.geocode(coords).then(function (res) {
            var firstGeoObject = res.geoObjects.get(0);

            myPlacemark.properties
                .set({
                    // Формируем строку с данными об объекте.
                    iconCaption: [
                        // Название населенного пункта или вышестоящее административно-территориальное образование.
                        firstGeoObject.getLocalities().length ? firstGeoObject.getLocalities() : firstGeoObject.getAdministrativeAreas(),
                        // Получаем путь до топонима, если метод вернул null, запрашиваем наименование здания.
                        firstGeoObject.getThoroughfare() || firstGeoObject.getPremise()
                    ].filter(Boolean).join(', '),
                    // В качестве контента балуна задаем строку с адресом объекта.
                    balloonContent: firstGeoObject.getAddressLine()
                });
        });
    }
}