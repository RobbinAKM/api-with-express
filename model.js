'use strict';

var mongoose = require ("mongoose");
var Schema = mongoose.Schema;

var sortAnswers= function(a,b){
  if(a.votes===b.votes){
    return b.updatedAt-a.updatedAt;
  }
  return b.votes-a.votes;
}

var answerSchema=new Schema({
  text:String,
  createdAt:{type:Date , default: Date.now},
  updatedAt:{type:Date , default: Date.now},
  votes:{type:Number , default:0}
});

//answerSchema.method("name of the method", function excuting when the name is called );
answerSchema.method("updates",function(updates,cb){
  //merge the updates to answer documents
  Object.assign(this,updates,{updatedAt:new Date()});
  this.parent().save(cb);
});

answerSchema.method("vote",function(vote,cb){
  //merge the updates to answer documents
  if(vote==="up"){
    this.votes += 1
  }else{
    this.votes -=1
  }
  this.parent().save(cb);
});

var questionSchema = new Schema({
  text:String,
  createdAt:{type:Date , default: Date.now},
  answers:[answerSchema]
});

questionSchema.pre("save",function(next){
  this.answers.sort(sortAnswers);
  next();
});

var Question = mongoose.model("Question",questionSchema);

module.exports.Question=Question;
