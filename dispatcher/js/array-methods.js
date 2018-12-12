function findEntityById(array, id) {
    return array.find( function (value) { return value.id == id } );
}

function findIndexById(array, id) {
    return array.findIndex( function (value) { return value.id == id } );
}