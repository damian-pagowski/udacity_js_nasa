let store = {
  user: { name: "Student" },
  apod: "",
  rovers: ["Curiosity", "Opportunity", "Spirit"],
  selectedRover: "Curiosity",
  photoData: {},
  roverDetails: {},
};

// add our markup to the page
const root = document.getElementById("root");

const updateStore = (store, newState) => {
  store = Object.assign(store, newState);
  render(root, store);
};

const render = async (root, state) => {
  root.innerHTML = App(state);
};

const Jumbotron = (roverSelect, roverDetails) => {
  return `<div class="jumbotron jumbotron-fluid">
        <div class="container">
            <h1 class="display-4 text-center">Mars Rover Photos</h1>
            <p class="lead text-center">Select rover:</p>
            <div class="form-group">
 ${roverSelect}
          </div>
        </div>
        <div class="form-group">
 ${roverDetails}
    </div>`;

  // The launch date, landing date, name and status along with any other information about the rover.
};

const roverSelect = state => {
  const { rovers } = state;

  return `           <select class="form-control" id="rover-select" onchange="handleSelectingRover()">
    ${rovers
      .map(
        op =>
          `<option value="${op.toLowerCase()}" ${
            state.selectedRover == op.toLowerCase() ? " selected" : ""
          }>${op}</option>`
      )
      .join("")}
                </select>`;
};

function handleSelectingRover() {
  const rover = document.getElementById("rover-select").value;
  updateStore(store, { selectedRover: rover });
  getPhotoDataFromRover(store);
}

const Navbar = () => {
  return `<nav class="navbar navbar-expand-lg navbar-light bg-light">
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarNav">
      <ul class="navbar-nav">
        <li class="nav-item">
          <a class="nav-link" href="#">APOD<span class="sr-only">(current)</span></a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#images">Mars Rover Photos</a>
        </li>
      </ul>
      <ul class="navbar-nav ml-auto">
        <li class="nav-item">
            ${Greeting(store.user.name)}
        </li>
      </ul>
    </div>
  </nav>`;
};
const capitalize = strng => strng.charAt(0).toUpperCase() + strng.slice(1);
const removeSnakeCase = strng => strng.replace(/_/g, " ");
const RoverDetails = state => {
  const { roverDetails } = state;

  return ` <div class="container">
  <h5 class="text-center">Rover Details</h5>
  <ul class="list-group list-group-flush">
  ${Object.keys(roverDetails)
    .filter(k => typeof roverDetails[k] == "string")
    .map(
      k =>
        `<li class="list-group-item"> ${capitalize(removeSnakeCase(k))}: ${
          roverDetails[k]
        }</li>`
    )
    .reduce((acc, curr) => (acc += curr))}
  </ul>
  </div>`;
};
const Photos = state => {
  const { photoData } = state;
  const cards = photoData
    .map(each => Card(each))
    .reduce((acc, curr) => (acc += curr));

  return `<div class="container py-5">
      <div class="card-columns">
         ${cards}
      </div>
  </div>`;
};

const Card = data => {
  return `<div class="card">
            <img src="${data.img_src}" class="card-img-top img-fluid">
            <div class="card-body">
            </div>
        </div>`;
};

// create content
const App = state => {
  return `
        ${Navbar()}
        <header></header>
        <main>
           
            <section>
                <h1 class="display-4 text-center my-4">Astronomy Picture of the Day</h1>
                <p class="mb-4">
                    One of the most popular websites at NASA is the Astronomy Picture of the Day. In fact, this website is one of
                    the most popular websites across all federal agencies. It has the popular appeal of a Justin Bieber video.
                    This endpoint structures the APOD imagery and associated metadata so that it can be repurposed for other
                    applications. In addition, if the concept_tags parameter is set to True, then keywords derived from the image
                    explanation are returned. These keywords could be used as auto-generated hashtags for twitter or instagram feeds;
                    but generally help with discoverability of relevant imagery.
                </p>
                ${ImageOfTheDay(state)}
            </section>
            <section id="images">
            ${Jumbotron(roverSelect(state), RoverDetails(state))}
            ${Photos(state)}
            </section>

        </main>
        <footer></footer>
    `;
};

// listening for load event because page should load before any JS is called
window.addEventListener("load", () => {
  getPhotoDataFromRover(store);
});

// ------------------------------------------------------  COMPONENTS

// Pure function that renders conditional information -- THIS IS JUST AN EXAMPLE, you can delete it.
const Greeting = name => {
  if (name) {
    return `
            Welcome, ${name}!
        `;
  }

  return `
        Hello!
    `;
};

// Example of a pure function that renders infomation requested from the backend
const ImageOfTheDay = state => {
  const { apod } = state;

  // If image does not already exist, or it is not from today -- request it again
  const today = new Date();
  const photodate = new Date(apod.date);
  console.log(photodate.getDate(), today.getDate());

  console.log(photodate.getDate() === today.getDate());
  if (!apod || apod.date === today.getDate()) {
    getImageOfTheDay(state);
  }

  // check if the photo of the day is actually type video!
  if (apod.media_type === "video") {
    return `
            <p>See today's featured video <a href="${apod.url}">here</a></p>
            <p>${apod.title}</p>
            <p>${apod.explanation}</p>
        `;
  } else {
    return apod.image
      ? `
            <img src="${apod.image.url}" height="350px" width="100%" class="img-fluid"/>
            <p>${apod.image.explanation}</p>
        `
      : "";
  }
};

// ------------------------------------------------------  API CALLS

// Example API call
const getImageOfTheDay = state => {
  let { apod } = state;

  fetch(`http://localhost:3000/apod`)
    .then(res => res.json())
    .then(apod => updateStore(state, { apod }));
};

function getPhotoDataFromRover(state) {
  fetch(`http://localhost:3000/rovers/${state.selectedRover}`)
    .then(res => res.json())
    .then(data =>
      updateStore(state, { photoData: data.photos, roverDetails: data.rover })
    );
}
