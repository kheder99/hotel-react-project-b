
const express = require('express');

exports.create = (req, res,Collection) => {
    const newEntry = req.body;
    Collection.create(newEntry, (e,newEntry) => {
      if(e) {
        console.log(e);
        res.status(500);
        res.send({ message: e.message });
      } else {
        res.send(newEntry);
      }
    });
  };
  exports.readMany = (req, res,Collection,query) => {
    let q =query||{};
    Collection.find(q, (e,result) => {
      if(e) {
        console.log(e);
        res.status(500);
        res.send({ message: e.message });
      } else {
        res.send(result);
      }
    });
  };

exports.readOne = (req, res,Collection) => {
    const { _id } = req.params;
    Collection.findById(_id, (e,result) => {
      if(e) {
        console.log(e);
        res.status(500);
        res.send({ message: e.message });
      } else {
        res.send(result);
      }
    });
  };
  
exports.update = (req, res,Collection) => {
    const changedEntry = req.body;
    Collection.update({ _id: req.params._id }, { $set: changedEntry }, (e) => {
      if (e)
        {console.log(e);
            res.status(500);
            res.send({ message: e.message });}
      else
        res.sendStatus(200);
    });
  };
  
exports.remove = (req, res,Collection) => {
    Collection.remove({ _id: req.params._id }, (e) => {
      if (e)
      {console.log(e);
        res.status(500);
        res.send({ message: e.message });}
      else
        res.sendStatus(200);
    });
  };
