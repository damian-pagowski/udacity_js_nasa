require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const fetch = require("node-fetch");
const path = require("path");

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/", express.static(path.join(__dirname, "../public")));

// your API calls
app.get("/rovers/:rover", async (req, res) => {
  const { rover } = req.params;
  try {
    const url = `https://api.nasa.gov/mars-photos/api/v1/rovers/${rover}/photos?sol=10&api_key=${process.env.API_KEY}`;
    console.log(url);
    let image = await fetch(url).then(res => res.json());
    const data = {}   
       data.photos = image.photos.map(photo => ({img_src : photo.img_src}))
       data.rover = image.photos[0].rover
    res.send(data);
  } catch (err) {
    console.log("error:", err);
  }
});
// example API call
app.get("/apod", async (req, res) => {
  try {
    let image = await fetch(
      `https://api.nasa.gov/planetary/apod?api_key=${process.env.API_KEY}`
    ).then(res => 
    res.send({ image }));
  } catch (err) {
    console.log("error:", err);
  }
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
