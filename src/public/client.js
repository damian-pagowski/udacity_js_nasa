let store = {
  user: { name: "Student" },
  apod: "",
  rovers: {}, //[{'Curiosity':{}}, {'Opportunity':{}}, 'Spirit'],
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

const Jumbotron = () => {
  return `<div class="jumbotron jumbotron-fluid">
        <div class="container">
            <h1 class="display-4 text-center">Mars Rover Photos</h1>
            <p class="lead text-center">Select rover:</p>
            <div class="form-group">
            <select class="form-control" id="exampleFormControlSelect1">
              <option>1</option>
              <option>2</option>
              <option>3</option>
              <option>4</option>
              <option>5</option>
            </select>
          </div>
        </div>
    </div>`;
};

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
    </div>
  </nav>`;
};
const Photos = data => {
  return `<div class="container py-5">
      <div class="card-columns">
          ${data.map(
            each =>
              `<div class="card">
                  <img src="${each.img_src}" class="card-img-top img-fluid" alt="${each.earth_date}">
                  <div class="card-body">
                      <p class="card-text">${each.earth_date}</p>
              </div>
          </div>`
          )}
      </div>
  </div>`;
};

// create content
const App = state => {
  let { rovers, apod } = state;
  return `
        ${Navbar()}
        <header></header>
        <main>
            ${Greeting(store.user.name)}
            <section>
                <h3>Put things on the page!</h3>
                <p>Here is an example section.</p>
                <p>
                    One of the most popular websites at NASA is the Astronomy Picture of the Day. In fact, this website is one of
                    the most popular websites across all federal agencies. It has the popular appeal of a Justin Bieber video.
                    This endpoint structures the APOD imagery and associated metadata so that it can be repurposed for other
                    applications. In addition, if the concept_tags parameter is set to True, then keywords derived from the image
                    explanation are returned. These keywords could be used as auto-generated hashtags for twitter or instagram feeds;
                    but generally help with discoverability of relevant imagery.
                </p>
                ${ImageOfTheDay(apod)}
            </section>
            <section id="images">
            ${Jumbotron()}
            ${Photos(rovers)}
            </section>

        </main>
        <footer></footer>
    `;
};

// listening for load event because page should load before any JS is called
window.addEventListener("load", () => {
  console.log("--fetching data from api");
  fetch(`http://localhost:3000/rovers/curiosity`)
    .then(res => res.json())
    .then(data => {
      console.log(data.image.photos);
      updateStore(store, { rovers: data.image.photos });
      render(root, store);
    });
});

// ------------------------------------------------------  COMPONENTS

// Pure function that renders conditional information -- THIS IS JUST AN EXAMPLE, you can delete it.
const Greeting = name => {
  if (name) {
    return `
            <h1>Welcome, ${name}!</h1>
        `;
  }

  return `
        <h1>Hello!</h1>
    `;
};

// Example of a pure function that renders infomation requested from the backend
const ImageOfTheDay = apod => {
  // If image does not already exist, or it is not from today -- request it again
  const today = new Date();
  const photodate = new Date(apod.date);
  console.log(photodate.getDate(), today.getDate());

  console.log(photodate.getDate() === today.getDate());
  if (!apod || apod.date === today.getDate()) {
    getImageOfTheDay(store);
  }

  // check if the photo of the day is actually type video!
  if (apod.media_type === "video") {
    return `
            <p>See today's featured video <a href="${apod.url}">here</a></p>
            <p>${apod.title}</p>
            <p>${apod.explanation}</p>
        `;
  } else {
    return `
            <img src="${apod.image.url}" height="350px" width="100%" class="img-fluid"/>
            <p>${apod.image.explanation}</p>
        `;
  }
};

// ------------------------------------------------------  API CALLS

// Example API call
const getImageOfTheDay = state => {
  let { apod } = state;

  fetch(`http://localhost:3000/apod`)
    .then(res => res.json())
    .then(apod => updateStore(store, { apod }));

  return data;
};
