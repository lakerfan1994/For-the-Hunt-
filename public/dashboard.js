 const applicationsUrl = "/applications";
 const meetupUrl = "/events";
 const userUrl = "/user";
 const loginUrl = "/login";
 const user = {
    username: "Sally Smith",
    password: "password",
    applications: [
    {name: "Google",
    date: new Date(),
    role: "Junior Web Developer",
    location: "San Francisco" ,
    interviewExistence: true,
    eventType: 'Interview',
    dateOfEvent: new Date(),
    interviewQuestions: "lorem ipsum"
    },
    {name: "Apple",
    date: new Date(),
    role: "Junior Web Developer",
    location: "New York",
    interviewExistence: false,
    eventType: 'Interview'
    },

    {name: "Amazon",
    date: new Date(),
    role: "Junior Web Developer",
    location: "Las Vegas",
    interviewExistence: true,
    eventType: 'Interview',
    dateOfEvent: new Date(),
    interviewQuestions: "lorem ipsum"},

    {name: "Facebook",
    date:  new Date(),
    role: "Junior Web Developer",
    location: "Los Angeles",
    interviewExistence: false,
    eventType: 'Interview'
    }
    ],
    meetups: [
    {name: "JsQueens Meetup", 
    dateOfEvent: new Date(), 
    location: "Queens, New York",
    eventType: 'Meetup'
    },
    {name: "Javafunscript", 
    dateOfEvent: new Date(), 
    location: "Manhattan, New York",
    eventType: 'Meetup'
    }
   ]
  }

  const inspiringSayings = ["Ambition is a dream with a V8 engine - Elvis Presley", "Nothing can dim the light which shines from within" + 
  " - Maya Angelou", "The opposite of bravery is not cowardice but conformity -Robert Anthony"];

  function addUserToDatabase(user) {
    const params = {
      method: 'POST',
      contentType: 'application/json',
      url: userUrl,
      data: JSON.stringify(user),
      error: brokenCode,
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
      error: brokenCode,
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
      error: brokenCode,
      success: cleanCode   
    }

    $.ajax(params);
  }

  function getApplicationData(_username, _sort) {
    const params = {
      method: 'GET',
      url: `${applicationsUrl}/${_username}/${_sort}`,
      success: displayUserApplications,
      error: brokenCode
    }

    $.ajax(params);
  }

  function submitSignupForm() {
    $('.sign-up-parent').submit(function(event) {
      event.preventDefault();
      let _username = $('#signup-username').val();
      _username = _username.trim(); 
      let _password = $('#signup-password').val();
      _password = _password.trim();
      if(_password.length < 10 || _password.length > 72) {
        $('.password-validation').removeClass('hidden');
        $('#signup-password').val('');
      }

      const newUser = {username: _username, password: _password};
      addUserToDatabase(newUser);
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
    $('.dashboard').removeClass('hidden');
    $('.nav-container').removeClass('hidden');

  }

  function confirmUser() {
    $('.user-confirm').removeClass('hidden');
  }


  function brokenCode(data) {
    console.log(`oh no!! it broke`);
  }

  function cleanCode(data) {
    console.log('yiss, shit worked!');
    console.log(data);
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

      createNewApplicationInDatabase/(newApplication);


    })
  }




  function displayUserApplications(data) {
    let applications = data.map(app => createApplicationObject(app));
    $('.application-box').append(applications);
  }

  function createApplicationObject(application) {
      return `<div class= "application-container centered-text">
                  <div class="application-item">
                      <span>${application.name}</span>
                  </div>
                  <div class="application-item not-on-small-screens">
                    <span>${application.role}</span>
                  </div>
                  <div class="application-item">
                    <span>${new Date(application.date).toDateString()}</span>
                  </div>
                  <div class= "application-button">
                      <a href="#"><i class="fas fa-marker"></i></a>
                  </div>
                  <div class= "application-button">
                    <a href="#"><i class="fas fa-minus-circle"></i></a>
                  </div>
            </div>`

  }

  function displayUserEvents() {
    let events = "";
    let appsWithInterviews = [];

    appsWithInterviews = user.applications.filter(hasInterview);

    let allEvents = appsWithInterviews.concat(user.meetups);

    for (let i = 0; i < allEvents.length; i++){
      events += createEventObject(allEvents[i]);
    }
    $('.event-box').append(events);


  }

  function hasInterview(application) {
    return application.interviewExistence 
  }



  function createEventObject(event){
      return `<div class= "event-container centered-text">
                  <div class="event-item">
                      <span>${event.name}</span>
                  </div>
                  <div class="event-item not-on-small-screens">
                    <span>${event.eventType}</span>
                  </div>
                  <div class="event-item">
                    <span>${event.dateOfEvent.toDateString()}</span>
                  </div>
                  <div class= "event-button">
                      <i class="fas fa-marker"></i>
                  </div>
                  <div class= "event-button">
                    <i class="fas fa-minus-circle"></i>
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
      emptyApp();
      $('.dashboard').removeClass('hidden');
    })
  }

  function openApplicationOverlay() {
    $('.application').on('click', '.create-application', function(){
      $('.application-overlay').removeClass('hidden');
      $('.application-modal').removeClass('hidden');
    })
  }

  function closeApplicationOverlay() {
    $('.application-modal').on('click', '.application-exit', function(){
      $('.application-overlay').addClass('hidden');
      $('.application-modal').addClass('hidden');
    })
  }

  function openEventOverlay() {
    $('.events-and-interviews').on('click', '.create-event', function(){
      $('.event-overlay').removeClass('hidden');
      $('.event-modal').removeClass('hidden');
    })
  }

  function closeEventOverlay() {
    $('.event-modal').on('click', '.event-exit', function(){
      $('.event-overlay').addClass('hidden');
      $('.event-modal').addClass('hidden');
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

