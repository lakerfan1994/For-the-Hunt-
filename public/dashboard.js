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


  function displayUserApplications() {
    let applications = "";
    for (let i = 0; i < user.applications.length; i++){
      applications += createApplicationObject(user.applications[i]);
    }
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
                    <span>${application.date.toDateString()}</span>
                  </div>
                  <div class= "application-button">
                      <i class="fas fa-marker"></i>
                  </div>
                  <div class= "application-button">
                    <i class="fas fa-minus-circle"></i>
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
    $('.dashboard').addClass('hidden');
    $('.sign-up-main').addClass('hidden');
    $('.login-main').addClass('hidden');
    $('.application').addClass('hidden');
    $('.events-and-interviews').addClass('hidden');
    $('.character-status').addClass('hidden');
  }


  function moveToApplicationList() {
    $('.nav-container').on('click', '.nav-applications', function(){
      emptyApp();
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

  function moveToHomepage(){
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
    $('.event-modal').on('cllck', '.event-exit', function(){
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

