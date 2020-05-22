const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");

// Write code to use inquirer to gather information about the development team members,
// and to create objects for each team member (using the correct classes as blueprints!)

let employeeArray = [];

function newEmployee() {
  inquirer
    .prompt([
      {
        type: "list",
        name: "role",
        message: "Who's information are you inputing?",
        choices: ["Intern", "Engineer", "Manager"],
      },
      {
        type: "input",
        name: "name",
        message: "Enter the employee's name:",
      },
      {
        type: "input",
        name: "id",
        message: "Enter the employee's ID:",
      },
      {
        type: "input",
        name: "email",
        message: "Enter the employee's email address:",
      },
    ])

    // The following are questions geared to who's information we are inputing

    .then((response) => {
      if (response.role === "Intern") {
        inquirer
          .prompt([
            {
              type: "input",
              message: "What school did the intern attend?",
              name: "school",
            },
          ])
          .then((internSchool) => {
            let intern = new Intern(
              response.name,
              response.id,
              response.email,
              internSchool.school,
            );
            employeeArray.push(intern);
            addEmployee();
          });

      } else if (response.role === "Engineer") {
        inquirer
          .prompt([
            {
              type: "input",
              name: "github",
              message: "Enter the Engineer's Github Username:",
            },
          ])
          .then((engineerUsername) => {
            let engineer = new Engineer(
              response.name,
              response.id,
              response.email,
              engineerUsername.github,
            );
            employeeArray.push(engineer);
            addEmployee();
          });

      } else if (response.role === "Manager") {
        inquirer
          .prompt([
            {
              type: "input",
              name: "officeNumber",
              message: "What is the Manager's office number?",
            },
          ])
          .then((managerOffice) => {
            let manager = new Manager(
              response.name,
              response.id,
              response.email,
              managerOffice.officeNumber,
            );
            employeeArray.push(manager);
            addEmployee();
          });
      }
    });
}


newEmployee();


function addEmployee() {
  inquirer
    .prompt([
      {
        type: "confirm",
        name: "add",
        message: "Do you want to add another employee?",
      },
    ])
    .then((response) => {
      if (response.add === true) {
        newEmployee();
      } else {
        generateHTML();
      }
    });
}

// Function to generate the HTML with info
function generateHTML() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR);
  }
  fs.writeFile(outputPath, render(employeeArray), function (err) {
    if (err) {
      throw err;
    }
  });
}
