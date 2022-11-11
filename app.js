//jshint eserver:6

const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const request = require("request");
const mailchimp = require("@mailchimp/mailchimp_marketing");
const listId = process.env.LIST_ID;
mailchimp.setConfig({
  apiKey: process.env.API_KEY
  server: "us8",
});

const app = express();
app.use(bodyParser.urlencoded({
  extended: true
}))
app.use(express.static("public")); // making project public directory to static

app.get("/", function(req, res) {
  //response sent a file of html
  res.sendFile(__dirname + "/signup.html");
})

app.post("/", function(req, res) {
  const firstName = req.body.firstName; //request data from html
  const lastName = req.body.lastName;
  const email = req.body.email;

  async function run() {
    try{
    const response = await mailchimp.lists.addListMember(listId, {
      email_address: email,
      status: "subscribed",
      merge_fields: {
        FNAME: firstName,
        LNAME: lastName
      }
    });
    res.sendFile(__dirname + "/success.html");
  }

  catch(error){
    res.sendFile(__dirname + "/failure.html");
  }
  }
  run();
});

app.post("/failure",function( req, res){
  res.redirect("/");
})


app.listen(process.env.PORT || 3000, function() {
  console.log("server running on port 3000");
})


