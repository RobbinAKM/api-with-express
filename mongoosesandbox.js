'use strict'

var mongoose = require('mongoose');

mongoose.connect("mongodb://localhost:27017/trial");

var db=mongoose.connection;

db.on("error", function(){
  console.log("Error connecting database ");
});

db.once("open",function(){
  console.log("Connected");

var Schema = mongoose.Schema;

var AnimalSchema = new Schema ({
  weight: {type: Number ,default:34},
  name: {type: String ,default:"kelly"} ,
  type: {type: String ,default:"goldfish"},
  size: {type: String ,default:"big"}
});

AnimalSchema.pre("save",function(next){
  if(this.weight>=1000){
    this.size==="big";
  }else{
    this.size==="small";
  }
  next();
});


AnimalSchema.statics.findSize=function(size,cb){
  //this === Animal
  return this.find({size:size},cb)
}

AnimalSchema.methods.findColor=function(cb){
  //this===document
  return this.model("Animal").find({color:this.color},cb)
}


var Animal = mongoose.model("Animal",AnimalSchema);

var dog = new Animal({
  type:"bulldog",
  size:"big",
  weight:12,
  name:"Doodle"
});

var animal = new Animal({});

var whale = new Animal({
  type:"sparm whale",
  size:"huge",
  weight:30000,
  name:"furgist"
});


var animalData=[
  {
    type:"monkey",
    size:"small",
    weight:345,
    name:"kokoma"
  },
{  type:"dolphin",
  size:"big",
  weight:1000,
  name:"luna"
},
{  type:"cat",
  size:"small",
  weight:232,
  name:"yaennefer"
 }
];

Animal.remove({},function(err){
if(err) console.error("save failed",err);
   Animal.create(animalData,function(err,animals){
        if(err) console.error("save failed",err);
         Animal.findSize("small",function(err,animals){
           animals.forEach(function(animal){
             console.log(animal.name + " the " +animal.type + " weights " + animal.size +" kgs " + animal.weight);
                   })
             db.close(function(){
               console.log("database closed");
             });
          });
      });
   });





});
