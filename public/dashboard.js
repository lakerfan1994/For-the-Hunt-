  const user = {
    userName: "Sally Smith",
    applications: [
    {name: "Google",
    date: new Date(),
    role: "Junior Web Developer"},
    {name: "Apple",
    date: new Date(),
    role: "Junior Web Developer"},
    {name: "Amazon",
    date: new Date(),
    role: "Junior Web Developer"},
    {name: "Facebook",
    date:  new Date(),
    role: "Junior Web Developer"},
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
      return `<div class= "application-container">
                  <div class="application-item">
                      <span>${application.name}&nbsp;&nbsp;&nbsp;&nbsp;${application.role}</span>
                      <span>${application.date}</span>
                  </div>
                  <div class= "application-buttons">
                      <button class= "edit-button">Edit</button>
                      <button class= "delete-button">Delete</button>
                  </div>
                  </div>`

  }


  $(displayUserApplications);
