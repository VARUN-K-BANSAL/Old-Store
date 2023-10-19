$(document).ready(function () {
    $.getJSON('/getUserDetail', function (user) {
        if (user != null && user != undefined) {
            $('#user')[0].innerHTML = `Hi! ${user.name}`;
            $('#sign_in')[0].innerHTML = `<a class="nav-link" href="/logout">Log out</a>`
            $('#sign_up')[0].innerHTML = ''
        }
    })
})