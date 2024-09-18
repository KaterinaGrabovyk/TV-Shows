import express from "express"
import axios from "axios"
import bodyParser from "body-parser";

const port=3000;
const app=express();

let ind=0;//pages 0-318

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/",async(req,res)=>{
        res.render("index.ejs");
})

app.get("/Shows",async(req,res)=>{
        try {
                const response = await axios.get(`https://api.tvmaze.com/shows?page=${ind}`);
                const result = response.data;
                res.render("shows.ejs" ,{ shows: result,pageNumber:1});
              } catch (error) {
                console.error("Failed to make request:", error.message);
                res.render("index.ejs", {
                  error: error.message,
                });
              }
})
app.post("/changePage", async (req, res) => {
        let t = parseInt(req.body.pageNumber, 10); 
        const action = req.body.action;
    
        if (action === 'prev' && t > 0) {
            t--; 
        } else if (action === 'next' && t < 319) {
            t++; 
        }
        ind=t-1;
       const response = await axios.get(`https://api.tvmaze.com/shows?page=${ind}`);
       const result = response.data;
       res.render("shows.ejs" ,{ shows: result, pageNumber:t});
    });

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
  });