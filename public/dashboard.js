 const applicationsUrl = "/applications";
 const meetupUrl = "/events";
 const userUrl = "/user";
 const loginUrl = "/login";
 
  function addUserToDatabase(user) {
    const params = {
      method: 'POST',
      contentType: 'application/json',
      url: userUrl,
      data: JSON.stringify(user),
      error: userAlreadyExists,
      success: confirmUser
    }
    $.ajax(params);
  }

  function loginUserInDatabase(user) {
    const params = {
      method: 'POST',
      contentType: 'application/json',
      url: loginUrl,
      data: JSON.stringify(user),
      error: usernameOrPasswordIncorrect,
      success: loginSuccess
    }

    $.ajax(params);
    
  }

  function createNewApplicationInDatabase(app) {
    const params = {
      method: 'POST',
      contentType: 'application/json',
      url: applicationsUrl,
      data: JSON.stringify(app),
      error: appAlreadyExistsError,
      success: cleanCode   
    }

    $.ajax(params);
  }

  function createNewEventInDatabase(app) {
    const params = {
      method: 'POST',
      contentType: "application/json",
      url: meetupUrl,
      data: JSON.stringify(app),
      error: eventAlreadyExistsError,
      success: cleanCode
    }

    $.ajax(params);
  }

  function getApplicationData(_username, _sort) {
    $('.application-error').text('');
    $('.event-error').text('');
    const params = {
      method: 'GET',
      url: `${applicationsUrl}/${_username}/${_sort}`,
      success: displayUserApplications,
      error: brokenCode
    }

    $.ajax(params);
  }
  function getRecentApplicationData(username) {
    const params = {
      method: 'GET',
      url: `${applicationsUrl}/${username}`,
      success: displayRecentUserApplications,
      error: brokenCode
    }
    $.ajax(params);
  }

  function getEventData(_username, _sort) {
    $('.application-error').text('');
    $('.event-error').text('');
    const params ={
      method: 'GET',
      url: `${meetupUrl}/${_username}/${_sort}`,
      success: displayUserEvents
    }

    $.ajax(params);
  }

  function getRecentEventData(username) {
    const params = {
      method:'GET',
      url: `${meetupUrl}/${username}`,
      success: displayRecentUserEvents,
      error: brokenCode
    }
    $.ajax(params);
  }

  function deleteApplicationData(app) {
    const params = {
      method: 'DELETE',
      contentType: 'application/json',
      url: applicationsUrl,
      data: JSON.stringify(app),
      error: brokenCode,
      success: function(data) {
        getApplicationData(app.username, 'date')
      }
    }

    $.ajax(params);
  }

  function deleteEventData(event) {
    const params = {
      method: 'DELETE',
      contentType: 'application/json',
      url: meetupUrl,
      data: JSON.stringify(event),
      error: brokenCode,
      success: function(data) {
        getEventData(event.username, 'date');
      }
    }
    $.ajax(params);
  }

  function updateApplicationData(app) {
    //when you come back to this, make a separate interview screen for the interview part of the app
    const params = {
      method: 'PUT',
      contentType: 'application/json',
      url: applicationsUrl,
      data: JSON.stringify(app),
      error: brokenCode,
      success: cleanCode
    }
  }

  function userAlreadyExists(data) {
    $('.user-validation').removeClass('hidden');
    $('.user-validation').focus();
    $('.username-validation').addClass('hidden');
    $('.password-validation').addClass('hidden');
    $('#signup-username').val('');
  }

  function usernameOrPasswordIncorrect(data) {
    $('.login-validation').removeClass('hidden');
    $('.login-validation').focus();
    $('.login-username').val('');
    $('.login-password').val('');
  }

  function appAlreadyExistsError(data) {
    $('.application-error').append(`<h4>${data.responseText}</h4>`);
  }

  function eventAlreadyExistsError(data) {

    $('.event-error').append(`<h4>${data.responseText}</h4>`);
  }

  function submitSignupForm() {
    $('.sign-up-parent').submit(function(event) {
      event.preventDefault();
      let readyToBeSent = true;
      let _username = $('#signup-username').val();
      _username = _username.trim(); 
      goodUsername = _username.replace(/[^a-zA-Z ]/g, "");
      if(!(_username === goodUsername)){
        readyToBeSent = false;
        $('.username-validation').removeClass('hidden');
        $('.username-validation').focus();
        $('.user-validation').addClass('hidden');
        $('.password-validation').addClass('hidden');
        $('#signup-username').val('');
      }

      let _password = $('#signup-password').val();
      _password = _password.trim();
      if(_password.length < 10 || _password.length > 72) {
        readyToBeSent = false;
        $('.password-validation').removeClass('hidden');
        $('.password-validation').focus();
        $('.username-validation').addClass('hidden');
        $('.user-validation').addClass('hidden');
        $('#signup-password').val('');
      }

      const newUser = {username: _username, password: _password};
      if(readyToBeSent){
      addUserToDatabase(newUser);
      } 
    })
  }

  function loginFromLoginPage() {
    $('.login-parent').submit(function(event) {
      event.preventDefault();
      let _username = $('.login-username').val().trim();
      let _password = $('.login-password').val().trim();
      const userLogin = {username: _username, password: _password};
      loginUserInDatabase(userLogin);

    }) 
  }


  function loginSuccess(data) {
    let jwtToken = data.authToken
    localStorage.setItem("authToken", jwtToken);
    emptyApp();
    $('.current-user').val('');
    $('.current-user').append(`<p>${data.username}</p>`);

    getRecentApplicationData(data.username);
    getRecentEventData(data.username);
    $('.dashboard').removeClass('hidden');
    $('.nav-container').removeClass('hidden');
    $('header').addClass('hidden');
    $('.homepage-navbar').addClass('hidden');

  }

  function onPageLoad(){
    if(localStorage.getItem('authToken')) {
      let token = localStorage.getItem('authToken');
      var base64Url = token.split('.')[1]; 
      var base64 = base64Url.replace('-', '+').replace('_', '/'); 
      let user = JSON.parse(window.atob(base64));
      emptyApp();
      $('.current-user').val('');
      $('.current-user').append(`<p>${user.user.username}</p>`);
      getRecentApplicationData(user.user.username);
      getRecentEventData(user.user.username);
      $('.dashboard').removeClass('hidden');
      $('.nav-container').removeClass('hidden');
      $('header').addClass('hidden');
      $('.homepage-navbar').addClass('hidden');

    }
  }

  function confirmUser() {
    $('.user-confirm').removeClass('hidden');
    $('.user-validation').addClass('hidden');
    $('.username-validation').addClass('hidden');
    $('.password-validation').addClass('hidden');
  }


  function brokenCode(data) {
    console.log(data);
  }

  function cleanCode(data) {
    $('.application-error').text('');
    $('.event-error').text('');
    console.log('yiss, shit worked!');
  }


  function submitNewApplication(){
    $('.new-application-form').submit(function(event){
      event.preventDefault();
      let _name = $('#application-company').val().trim();
      let _date = new Date();
      let _role = $('#application-role').val().trim();
      let _location = $('#application-location').val().trim();
      let _username = $('.current-user').text().trim();
      let _interviewExistence = false;
      let _eventType = 'Application';

      let newApplication = {name: _name, date: _date, role: _role, location: _location, username: _username,
        interviewExistence: _interviewExistence, eventType: _eventType};

      createNewApplicationInDatabase(newApplication);
      getApplicationData(_username, 'date');
      $('.application-overlay').addClass('hidden');
      $('.application-modal').addClass('hidden');
    })
  }


  function submitNewEvent(){
    $('.new-event-form').submit(function(event){
      event.preventDefault();
      let _name = $('#meetup').val().trim();
      let _location = $('#event-location').val().trim();
      let _username = $('.current-user').text().trim();
      let _dateOfEvent = $('#event-date').val();
      let _eventType = 'Interview';
      if(($('#meetup-type:checked').val() === undefined)) {
        _eventType = 'Meetup';
      }

      let newEvent = {name: _name, location: _location, username: _username, dateOfEvent: _dateOfEvent,
       eventType: _eventType};

       createNewEventInDatabase(newEvent);
       getEventData(_username, 'date');
       $('.event-overlay').addClass('hidden');
       $('.event-modal').addClass('hidden');
       
    })
  }




  function displayUserApplications(data) {
    $('.application-box').text('');
    $('.application-box').append(
      `<h2 class="centered-text application-header">List of Applications</h2>
       <button class= "col-6 create-application">Create a new application</button>
       <div class= "application-container centered-text">
                  <div class="application-item">
                      <h2>Company</h2>
                  </div>
                  <div class="application-item not-on-small-screens">
                    <h2>Role</h2>
                  </div>
                  <div class="application-item">
                    <h2>Date Applied</h2>
                  </div>
                  <div class= " application-button">
                    <i class="fas fa-trash-alt list-legend" alt="header for delete button icons"></i>
                  </div> 
            </div>`);
    let applications = data.map(app => createApplicationObject(app));
    $('.application-box').append(applications);
  }

  function displayRecentUserApplications(data) {
    $('.applications-dashboard').text('');
    $('.applications-dashboard').append( `<div class= "application-container centered-text">
                  <div class="application-item">
                      <h2>Company</h2>
                  </div>
                  <div class="application-item not-on-small-screens">
                    <h2>Role</h2>
                  </div>
                  <div class="application-item">
                    <h2>Date Applied</h2>
                  </div>
               </div>`
     );
    let applications = data.map(app => createRecentApplicationObject(app));
    $('.applications-dashboard').append(applications);
  }


  function createApplicationObject(application) {
      return `<div class= "application-container centered-text">
                  <div class="application-item application-name">
                      <span>${application.name}</span>
                  </div>
                  <div class="application-item not-on-small-screens">
                    <span>${application.role}</span>
                  </div>
                  <div class="application-item">
                    <span>${new Date(application.date).toDateString()}</span>
                  </div>
                  <div class= "application-button application-delete">
                    <a href="#"><span class="aria-friendly-label">Delete Button></span><i class="fas fa-minus-circle" alt="delete button"></i></a>
                  </div>
            </div>`

  }

  function createRecentApplicationObject(app) {
    return `<div class= "application-container centered-text">
                  <div class="application-item">
                      <span>${app.name}</span>
                  </div>
                  <div class="application-item not-on-small-screens">
                    <span>${app.role}</span>
                  </div>
                  <div class="application-item">
                    <span>${new Date(app.date).toDateString()}</span>
                  </div>
               </div>`
  }

  function deleteUserApplication() {
    $('.application-box').on('click', '.application-delete', function(){
      let _username = $('.current-user').text().trim();
      let _name = $(this).siblings('.application-name').text().trim();
      let app = {username: _username, name: _name};
      deleteApplicationData(app);
    })
  }

  function deleteUserEvent() {
    $('.event-box').on('click', '.event-delete', function(){
      let _username = $('.current-user').text().trim();
      let _name = $(this).siblings('.event-name').text().trim();
      let app = {username: _username, name: _name};
      deleteEventData(app);
    })
  }

    function addUserInterview() {
    $('application-box').on('click', 'application-update', function() {
      let _username = $('.current-user').text().trim();
      let _name = $(this).siblings('.application-update').text().trim();
      let app = {username: _username, name: _name};

    } )
  }

  function displayUserEvents(data) {

    $('.event-box').text('');
    $('.event-box').append(`<h2 class="centered-text event-header">List of Events</h2>
               <button class= "col-6 create-event">Create a new event</button>
               <div class= "event-container centered-text">
                  <div class="event-item">
                      <h2>Event</h2>
                  </div>
                  <div class="event-item not-on-small-screens">
                    <h2>Type</h2>
                  </div>
                  <div class="event-item">
                    <h2>Date</h2>
                  </div>
                  <div class= "event-item not-on-small-screens">
                    <h2>Location</h2>
                  </div>
                  <div class= " event-button ">
                    <i class="fas fa-trash-alt list-legend" alt="header for delete buttons"></i>
                  </div> 
            </div>`)
    let events = data.map(event => createEventObject(event));
    $('.event-box').append(events);

  }

    function displayRecentUserEvents(data) {
    $('.interviews-dashboard').html('');
    $('.interviews-dashboard').append(`<div class= "event-container centered-text">
                  <div class="event-item">
                      <h2>Event</h2>
                  </div>
                  <div class="event-item not-on-small-screens">
                    <h2>Date</h2>
                  </div>
                  <div class="event-item">
                    <h2>Location</h2>
                  </div>
               </div>`
      );
    let events= data.map(event => createRecentEventObject(event));
    $('.interviews-dashboard').append(events);
  }

  function createEventObject(event){
      return `<div class= "event-container centered-text">
                  <div class="event-item event-name">
                      <span>${event.name}</span>
                  </div>
                  <div class="event-item not-on-small-screens">
                    <span>${event.eventType}</span>
                  </div>
                  <div class="event-item">
                    <span>${new Date(event.dateOfEvent).toDateString()}</span>
                  </div>
                  <div class= "event-item not-on-small-screens">
                     <span>${event.location}</span>
                  </div>
                  <div class= "event-button event-delete">
                    <a href="#"><span class="aria-friendly-label">Delete Button></span><i class="fas fa-minus-circle" alt= "delete button"></i></a>
                  </div>
            </div>`
  }

   function createRecentEventObject(app) {
    return ` <div class= "event-container centered-text">
                  <div class="event-item">
                      <span>${app.name}</span>
                  </div>
                  <div class="event-item not-on-small-screens">
                    <span>${new Date(app.dateOfEvent).toDateString()}</span>
                  </div>
                  <div class="event-item">
                    <span>${app.location}</span>
                  </div>
               </div>`
  }


  function emptyApp() {
    $('.homepage').addClass('hidden');
    $('.dashboard').addClass('hidden');
    $('.sign-up-main').addClass('hidden');
    $('.login-main').addClass('hidden');
    $('.application').addClass('hidden');
    $('.events-and-interviews').addClass('hidden');
    $('.character-status').addClass('hidden');
    $('.password-validation').addClass('hidden');
    $('.user-confirm').addClass('hidden');
  }

  function moveToHomepage() {
    $('.user-confirm').on('click', '.user-confirm-button', function(){
      let _username = $('#signup-username').val().trim();
      let _password = $('#signup-password').val().trim();
      let user = {username: _username, password: _password};
      loginUserInDatabase(user);
    })
  }

  function moveToSignUp() {
    $('.homepage-navbar').on('click', '.homepage-signup', function(){
      emptyApp();
      $('.sign-up-main').removeClass('hidden');
    })
  }

  function moveToLogin() {
    $('.homepage-navbar').on('click', '.homepage-login', function(){
      emptyApp();
      $('.login-main').removeClass('hidden');
    })
  }


  function moveToApplicationList() {
    $('.nav-container').on('click', '.nav-applications', function(){
      emptyApp();
      let _username = $('.current-user').text().trim();
      getApplicationData(_username, "date");
      //When you come back, work on creating the callback function for the get app info
      $('.application').removeClass('hidden');
    })
  }

  function moveToEventsList() {
    $('.nav-container').on('click', '.nav-events', function(){
      emptyApp();
      let _username = $('.current-user').text().trim();
      getEventData(_username, "date");
      $('.events-and-interviews').removeClass('hidden');
    })
  }

  function moveToCharacterScreen() {
    $('.nav-container').on('click', '.nav-character', function(){
      emptyApp();
      $('.character-status').removeClass('hidden');
    })
  }

  function moveToDashboard(){
    $('.nav-container').on('click', '.nav-homepage', function(){
      let _username = $('.current-user').text().trim();
      getRecentApplicationData(_username);
      getRecentEventData(_username);
      emptyApp();
      $('.dashboard').removeClass('hidden');
    })
  }

  function openApplicationOverlay() {
    $('.application').on('click', '.create-application', function(){
      $('.application-overlay').removeClass('hidden');
      $('.application-modal').removeClass('hidden');
      $('.new-application-form').focus();
    })
  }

  function closeApplicationOverlay() {
    $('.application-modal').on('click', '.application-exit', function(){
      $('.application-overlay').addClass('hidden');
      $('.application-modal').addClass('hidden');
      $('.application-box').focus();
    })
  }

  function openEventOverlay() {
    $('.events-and-interviews').on('click', '.create-event', function(){
      $('.event-overlay').removeClass('hidden');
      $('.event-modal').removeClass('hidden');
      $('.new-event-form').focus();
    })
  }

  function closeEventOverlay() {
    $('.event-modal').on('click', '.event-exit', function(){
      $('.event-overlay').addClass('hidden');
      $('.event-modal').addClass('hidden');
      $('.event-box').focus();
    })
  }

  function logout() {
    $('.nav-container').on('click', '.nav-logout', function() {
      emptyApp();
      localStorage.removeItem('authToken');
      $('.nav-container').addClass('hidden');
      $('.current-user').text('');
      $('.homepage').removeClass('hidden');
      $('header').removeClass('hidden');
      $('.homepage-navbar').removeClass('hidden');
    })
  }

  function backToStartScreen(){
    $('.back-to-home').on('click', 'button', function(){
      emptyApp();
      $('.homepage').removeClass('hidden');
    })
  }






  $(displayUserEvents);
  $(displayUserApplications);
  $(moveToApplicationList);
  $(moveToEventsList);
  $(moveToCharacterScreen);
  $(moveToHomepage);
  $(openApplicationOverlay);
  $(closeApplicationOverlay);
  $(openEventOverlay);
  $(closeEventOverlay);
  $(submitSignupForm);
  $(moveToDashboard);
  $(moveToSignUp);
  $(moveToLogin);
  $(loginFromLoginPage);
  $(submitNewApplication);
  $(deleteUserApplication);
  $(submitNewEvent);
  $(deleteUserEvent);
  $(logout);
  $(backToStartScreen);
  $(onPageLoad);

