'use strict';

var express = require('express');
var router = express.Router();
var Question= require('./model').Question;

router.param("qid",function(req,res,next,id){
  Question.findById(id ,function(err,doc){
    if(err) return next(err);
    if(!doc){
      err = new Error("Not found");
      err.status= 404;
      return next(err);
    }
    req.question=doc;
  });
});

router.param("aid",function(req,res,next,id){
  req.answer= req.question.answers.id(id);
  if(!req.answer){
    err = new Error("Not found");
    err.status= 404;
    return next(err);
  }
  next();
});

router.get("/",function(req,res,next){
//.sort() returns a query builder
//.exec() executes the query builder
Question.find({}).sort({createdAt:-1})
    .exec(function(err,questions){
      if(err) return next(err);
      res.json(questions);
    });
  });



router.post("/",function(req,res,next){
  var question= new Question(req.body);
  question.save(function(err,question){
    if(err) return next(err);
    res.status(201);
    res.json(question);
  });
});


router.get("/:qid",function(req,res){
   res.json(req.question);
});

router.post("/:qid/answers",function(req,res,next){
   req.question.answers.push(req.body);
   req.question.save(function(err,question){
     if(err) return next(err);
     res.status(201);
     res.json(question);
   });
});


router.put("/:qid/answers/:aid",function(req,res,next){
req.answer.update(req.body,function(err,result){
  if(err) return next(err);
  res.json(result);
  });
});


router.delete("/:qid/answers/:aid",function(req,res){
  req.answer.remove(function(err){
    req.question.save(function(err,question){
        if(err) return next(err);
        res.json(question);
    });
  });
});

router.post("/:qid/answers/:aid/vote-:dir",
function(req,res,next){
  if(req.params.dir.search(/^(up|down)$/)===-1){
    var err = new Error("NOt found");
    err.status(404);
    next(err);
  }else{
    req.vote= req.params.dir;
    next();
  }
},
function(req,res,next){
    req.answer.vote(req.vote,function(err,question){
      if(err) return next(err);
      res.json(question);
    });
});

module.exports=router;
