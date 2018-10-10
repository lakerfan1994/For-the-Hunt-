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
                      <span>${application.name}&nbsp;&nbsp;&nbsp;&nbsp;${application.role}</span>
                      <span>${application.date.toDateString()}</span>
                  </div>
                  <div class= "application-buttons">
                      <button class= "edit-button">Edit</button>
                      <button class= "delete-button">Delete</button>
                  </div>
            </div>`

  }






  $(displayUserApplications);
