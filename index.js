import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

const app = express();
const port = 3000;
var stocks={
    "Microsoft":"MSFT",
    "Apple":"AAPl",
    
}

//Step 1: Run the solution.js file without looking at the code.
//Step 2: You can go to the recipe.json file to see the full structure of the recipeJSON below.

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", async (req, res) => {
   
      res.render("index.ejs",{options:stocks});
});
app.post("/add",async(req,res)=>{
    var sname=req.body.Name;
    var sform=req.body.Shortform;
    try{
        const response=await axios.get('https://finnhub.io/api/v1/quote?symbol='+sform+'&token=cvc22e1r01qhnuvq4hc0cvc22e1r01qhnuvq4hcg')
        const result=response.data.c;
        if(result>0){
            console.log("valid stock")
            stocks[sname]=sform;
            res.redirect("/")
        }else{
            console.log("INVALID STOCK")
            res.render("index.ejs",{options:stocks,message:"INVALID"})
        }
    }catch(error){
        console.error("Failed to make request:", error.message);
        res.render("index.ejs", {
          error: "No activities that match your criteria.",
        });
    }

  

});
app.post("/", async (req, res) => {
    try {
      console.log(req.body);
      const type = req.body.type;
    if (type!=""){
      const response = await axios.get(
        'https://finnhub.io/api/v1/quote?symbol='+type+'&token=cvc22e1r01qhnuvq4hc0cvc22e1r01qhnuvq4hcg'

      );
      const result = response.data;
      console.log(result);
      res.render("index.ejs", {
        data: result,
        stock:type,
        options:stocks,
      });}else{
        res.redirect("/")
      }

    } catch (error) {
      console.error("Failed to make request:", error.message);
      res.render("index.ejs", {
        error: "No activities that match your criteria.",
      });
    }
  });
app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
