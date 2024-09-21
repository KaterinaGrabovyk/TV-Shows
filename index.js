import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

const port = 3000;
const app = express();
//pages 0-318
let t = 1;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

//about page
app.get("/", (req, res) => {
  res.render("index.ejs");
});
//first page
app.get("/Shows", async (req, res) => {
  try {
    const response = await axios.get(
      `https://api.tvmaze.com/shows?page=${t - 1}`
    );
    const result = response.data;
    console.log(`page: 1`);
    res.render("shows.ejs", { shows: result, pageNumber: t });
  } catch (error) {
    console.error("Failed to make request:", error.message);
    res.render("index.ejs", {
      error: error.message,
    });
  }
});
//view show info
app.get("/Show/:id", async (req, res) => {
  try {
    const response = await axios.get(
      `https://api.tvmaze.com/shows?page=${t - 1}`
    );
    const response2 = await axios.get(
      `https://api.tvmaze.com/shows/${req.params.id}/cast`
    );
    const result = response.data;
    const cast = response2.data;
    let obj = result.filter((res) => res.id === parseInt(req.params.id));
    res.render("show.ejs", { show: obj[0], actors: cast });
  } catch (error) {
    console.error("Failed to make request:", error.message);
    res.render("index.ejs", {
      error: error.message,
    });
  }
});
//change pages
app.post("/Shows", async (req, res) => {
  t = parseInt(req.body.pageNumber, 10);
  const action = req.body.action;

  if (action === "prev" && t > 0) {
    t--;
  } else if (action === "next" && t < 319) {
    t++;
  } else if (action === "start") {
    t = 1;
  } else if (action === "end") {
    t = 319;
  }
  console.log(`page: ${t}`);
  const response = await axios.get(
    `https://api.tvmaze.com/shows?page=${t - 1}`
  );
  const result = response.data;
  res.render("shows.ejs", { shows: result, pageNumber: t });
});
app.get("/Random",async(req,res)=>{
  let random=Math.floor(Math.random()*319);
  try {
    const response = await axios.get(
      `https://api.tvmaze.com/shows?page=${random}`
    );
    const result = response.data;
    let r=Math.floor(Math.random()*result.length);
    res.render("random.ejs", { show: result[r] });
  } catch (error) {
    console.error("Failed to make request:", error.message);
    res.render("index.ejs", {
      error: error.message,
    });
  }
})
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
