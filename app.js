'use strict';

var express = require('express');
var app = express();
var routes = require('./route');
var JSONparser = require('body-parser').json;
var logger = require('morgan');


app.use("/questions",routes);
app.use(JSONparser());
app.use(logger("dev"));

var mongoose = require('mongoose');

mongoose.connect("mongodb://localhost:27017/trial");

var db=mongoose.connection;

db.on("error", function(){
  console.log("Error connecting database ");
});

db.once("open",function(){
  console.log("connection successful");
});

app.use(function(req,res,next){
  var err=new Error("Not found");
  err.status=404;
  next(err);
});

app.use(function(req,res,err,next){
  res.status(err.status || 500);
  res.json({
    error:{
      message:err.message
    }
  });
});

var port = process.env.PORT || 3000 ;

app.listen(port, function(){
  console.log("App is running on port",port);
});
