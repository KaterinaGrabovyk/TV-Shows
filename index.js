import express from "express"
import axios from "axios"
import bodyParser from "body-parser";

const port=3000;
const app=express();
//pages 0-318


app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/",async(req,res)=>{
        res.render("index.ejs");
})

app.get("/Shows",async(req,res)=>{
        try {
                const response = await axios.get(`https://api.tvmaze.com/shows?page=0`);
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
        }else if (action === 'start') {
          t=1; 
      }else if (action === 'end') {
          t=319; 
      }
        console.log(`page: ${t}`);
       const response = await axios.get(`https://api.tvmaze.com/shows?page=${t-1}`);
       const result = response.data;
       res.render("shows.ejs" ,{ shows: result, pageNumber:t});
    });

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
  });