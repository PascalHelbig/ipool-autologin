###
// ==UserScript==
// @name         iPool Auto Login
// @version      1.2.0
// @description  this script saves your login credentials in localStorage and keeps you logged in
// @author       Pascal Helbig
// @include      http://ipool.ba-berlin.de/*
// @downloadURL  https://github.com/PascalHelbig/ipool-autologin/raw/master/ipool-autologin.user.js
// @updateURL    https://github.com/PascalHelbig/ipool-autologin/raw/master/ipool-autologin.user.js
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js
// @grant        none
// ==/UserScript==
###

# Login Page?
if window.location.pathname.indexOf('index.php') > 0 or window.location.pathname is '/'
  $('input[type="checkbox"]').prop 'checked', true
  $('input[name="FORM_LOGIN_NAME"]').val 'student'
  $('input[type="submit"]').on 'click', ->
    matr = $('input[name="FORM_LOGIN_PASS"]').val()
    localStorage.setItem 'matr', matr

  matr_working = localStorage.getItem 'matr_working'
  localStorage.removeItem 'matr_working'

  if matr_working?
    $('input[name="FORM_LOGIN_PASS"]').val matr_working
    $('input[type="submit"]').click()
else
  $('a[href="/main.php?action=logout"]').on 'click', -> localStorage.removeItem 'matr_working'

  # if action is browse_stundenplaene:
  if window.location.search.indexOf('?action=browse_stundenplaene') >= 0
    faculty = parseInt $('select[name="faculty"]').val()
    course = parseInt $('select[name="course"]').val()

    if faculty isnt -1 and course isnt -1
      localStorage.setItem 'faculty', faculty
      localStorage.setItem 'course', course

    # if faculty and course are not set:
    if faculty is -1 and course is -1
      faculty_storage = localStorage.getItem 'faculty'
      course_storage = localStorage.getItem 'course'

      if faculty_storage? and course_storage?
        window.location = "http://ipool.ba-berlin.de/main.php?action=browse_stundenplaene&faculty=#{faculty_storage}&course=#{course_storage}"

  matr = localStorage.getItem 'matr'
  if matr?
    localStorage.removeItem 'matr'
    localStorage.setItem 'matr_working', matr