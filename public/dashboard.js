  const user = {
    username: "Sally Smith",
    password: "password",
    applications: [
    {name: "Google",
    date: new Date(),
    role: "Junior Web Developer",
    location: "San Francisco" ,
    interview: {existence: true,
    interviewDate: new Date(),
    interviewQuestions: "lorem ipsum"}
    },
    {name: "Apple",
    date: new Date(),
    role: "Junior Web Developer",
    location: "New York",
    interview: {existence: false}
    },

    {name: "Amazon",
    date: new Date(),
    role: "Junior Web Developer",
    location: "Las Vegas",
    interview: {existence: true,
    interviewDate: new Date(),
    interviewQuestions: "lorem ipsum"}},

    {name: "Facebook",
    date:  new Date(),
    role: "Junior Web Developer",
    location: "Los Angeles",
    interview: {existence: false}},
    ],
    meetups: [
    {name: "JsQueens Meetup", 
    date: new Date(), 
    location: "Queens, New York"
    },
    {name: "Javafunscript", 
    date: new Date(), 
    location: "Manhattan, New York"
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






  $(displayUserApplications);
