function getCurrentDateForDatetime() {
    var now = new Date($.now());
    return dateFormatForDatetime(now);
}

function dateFormatForDatetime(date) {
    var year = date.getFullYear();

    var month = (date.getMonth() + 1).toString().length === 1 ? '0' + (date.getMonth() + 1).toString() : date.getMonth() + 1;
    var day = date.getDate().toString().length === 1 ? '0' + (date.getDate()).toString() : date.getDate();
    var hours = date.getHours().toString().length === 1 ? '0' + date.getHours().toString() : date.getHours();
    var minutes = date.getMinutes().toString().length === 1 ? '0' + date.getMinutes().toString() : date.getMinutes();
    var seconds = date.getSeconds().toString().length === 1 ? '0' + date.getSeconds().toString() : date.getSeconds();

    var formattedDateTime = year + '-' + month + '-' + day + 'T' + hours + ':' + minutes + ':' + seconds;
    return formattedDateTime;
}

function dateFormatForJson(date) {
    if (date != null) date = date.replace('T', ' ');
    return date;
}

function stringFormatForDatetime(date) {
    if (date != null) date = date.replace(' ', 'T');
    else date = '';
    return date;
}