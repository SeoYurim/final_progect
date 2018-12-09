const express = require('express');
const Contest = require('../../models/contest'); 
const Answer = require('../../models/answer'); 
const LikeLog = require('../../models/like-log'); 
const catchErrors = require('../../lib/async-error');

const router = express.Router();

router.use(catchErrors(async (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    next({status: 401, msg: 'Unauthorized'});
  }
}));

router.use('/contests', require('./contests'));

// Like for Contest
router.post('/contests/:id/like', catchErrors(async (req, res, next) => {
  const contest = await Contest.findById(req.params.id);
  if (!contest) {
    return next({status: 404, msg: 'Not exist contest'});
  }
  var likeLog = await LikeLog.findOne({author: req.user._id, contest: contest._id});
  if (!likeLog) {
    contest.numLikes++;
    await Promise.all([
      contest.save(),
      LikeLog.create({author: req.user._id, contest: contest._id})
    ]);
  }
  return res.json(contest);
}));

// Like for Answer
router.post('/answers/:id/like', catchErrors(async (req, res, next) => {
  const answer = await Answer.findById(req.params.id);
  answer.numLikes++;
  await answer.save();
  return res.json(answer);
}));

router.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    status: err.status,
    msg: err.msg || err
  });
});

module.exports = router;
