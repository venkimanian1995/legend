const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');

const Online = require('../models/online');

router.post('/addOnline', (req, res, next) => {

  console.log('in route to add online issue');

  let newOnline = new Online({
    date: req.body.date,
    volume: req.body.volume,
    issue: req.body.issue
  });

  console.log(newOnline);

  Online.getOnlineByName(newOnline.date, (err, online) => {
    if(err) throw err;
    if(online) {
      return res.json({success: false, msg: 'Online issue already exists for this date.'});
    }

    Online.addOnline(newOnline, (err, online) => {
      if(err) {
        res.json({success: false, msg: 'Failed to add online issue.'});
      } 
      else {
      res.json({success: true, msg: 'Online issue added.'});
      }
    });
  });
});

router.get('/getOnline', (req, res, next) => {
  Online.find({}, null, {sort: {date: -1}}, (err, online) => {
    if (err) throw err;
    else {
      res.json(online);
    }
  });
});

router.delete('/deleteOnline', (req, res, next) => {
  Online.findByIdAndRemove(req.query.onlineID, (err, doc) => { 
    if(err) {
      res.json({success: false, msg: 'Failed to delete online issue.'});
      throw err;
    }
    else {
      res.json({success: true, msg: 'Online issue deleted.'});
    }
  });
});

router.put('/updateOnline', (req, res, next) => {

  Online.getOnlineByNameUpdate(req.body.date, req.body.onlineID, (err, online) => {
    if(err) throw err;
    if(online) {
      return res.json({success: false, msg: 'Online issue already exists for this date.'});
    }

    Online.update({'_id' : req.body.onlineID}, req.body, (err) => {
      if(err) {
        res.json({success: false, msg: 'Failed to update online issue.'});
        throw err;
      }
      else {
        res.json({success: true, msg: 'Online issue updated.'});
      }

    });
  });
});

module.exports = router;