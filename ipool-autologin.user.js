// ==UserScript==
// @name         iPool Auto Login
// @version      1.1.0
// @description  this script saves your login credentials in localStorage and keeps you logged in
// @author       Pascal Helbig
// @match        http://ipool.ba-berlin.de/*
// @downloadURL  https://github.com/PascalHelbig/ipool-autologin/raw/master/ipool-autologin.user.js
// @updateURL    https://github.com/PascalHelbig/ipool-autologin/raw/master/ipool-autologin.user.js
// @grant        none
// ==/UserScript==

function addJQuery(callback) {
    var script = document.createElement("script");
    script.setAttribute("src", "//ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js");
    script.addEventListener('load', function () {
        var script = document.createElement("script");
        script.textContent = "window.jQ=jQuery.noConflict(true);(" + callback.toString() + ")();";
        document.body.appendChild(script);
    }, false);
    document.body.appendChild(script);
}

// the guts of this userscript
function main() {
    if ((window.location.pathname.indexOf('index.php')) >= 0 || window.location.pathname == '/') {
        jQ('input[type="checkbox"').prop('checked', true);
        jQ('input[name="FORM_LOGIN_NAME"]').val('student');
        jQ('input[type="submit"]').on('click', function () {
            var matr = jQ('input[name="FORM_LOGIN_PASS"]').val();
            localStorage.setItem('matr', matr);
        });

        var matr_working = localStorage.getItem('matr_working');
        localStorage.removeItem('matr_working');

        if (matr_working != null) {
            jQ('input[name="FORM_LOGIN_PASS"]').val(matr_working);
            jQ('input[type="submit"]').click();
        }
    } else {
        jQ('a[href="/main.php?action=logout"]').on('click', function () {
            localStorage.removeItem('matr_working');
        });

        // if the action is browse_stundenplaene:
        if (window.location.search.indexOf('?action=browse_stundenplaene') >= 0) {
            var faculty = jQ('select[name="faculty"]').val();
            var course = jQ('select[name="course"]').val();

            // if faculty and course are set, than save it in storage:
            if (faculty != -1 && course != -1) {
                localStorage.setItem('faculty', faculty);
                localStorage.setItem('course', course);
            }

            // if faculty and course is not set:
            if (faculty == -1 && course == -1) {
                var faculty_storage = localStorage.getItem('faculty');
                var course_storage = localStorage.getItem('course');

                if (faculty_storage != null && course_storage != null) {
                    window.location = 'http://ipool.ba-berlin.de/main.php?action=browse_stundenplaene&faculty=' + faculty_storage + '&course=' + course_storage;
                }
            }
        }

        var matr = localStorage.getItem('matr');
        if (matr == null) {
            return;
        }
        localStorage.removeItem('matr');
        localStorage.setItem('matr_working', matr);
    }
}

// load jQuery and execute the main function
addJQuery(main);