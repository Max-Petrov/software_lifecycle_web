$(document).ready(function() {
    if (window.location.hash == ''){
        $('#content').load('registrations.html');
        window.location.hash = 'registrations';
    }
    else {
        var hash = window.location.hash.substr(1);
        $("a[href='registrations.html']").removeClass('active');
        $("a[href='" + hash + ".html'").addClass('active');
        var toLoad = hash + ".html";
        $('#content').empty();
        $('#content').load(toLoad);
    }

    $('.nav-link').click(function(){
        var hash = window.location.hash.substr(1);
        $("a[href='" + hash + ".html'").removeClass('active');
        $(this).addClass('active');
        var toLoad = $(this).attr('href');
        $('#content').empty();
        $('#content').load(toLoad);
        window.location.hash = $(this).attr('href').substr(0,$(this).attr('href').length-5);

        return false;
    });
});