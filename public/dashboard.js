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
    console.log(user.applications[0].date.toString());
    let applications = "";
    for (let i = 0; i < user.applications.length; i++){
      applications += `<p>You applied to ${user.applications[i].name} on  
      ${user.applications[i].date.toLocaleString()} for the position of ${user.applications[i].role}</p>`;
    }
    $('.applications').append(applications);
  }


  $(displayUserApplications);
