const express = require('express');
const Contest = require('../../models/contest');
const catchErrors = require('../../lib/async-error');

const router = express.Router();

// Index
router.get('/', catchErrors(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  const contests = await Contest.paginate({}, {
    sort: {createdAt: -1}, 
    populate: 'author',
    page: page, limit: limit
  });
  res.json({contests: contests.docs, page: contests.page, pages: contests.pages});   
}));

// Read
router.get('/:id', catchErrors(async (req, res, next) => {
  const contest = await Contest.findById(req.params.id).populate('author');
  res.json(contest);
}));

// Create
router.post('', catchErrors(async (req, res, next) => {
  var contest = new Contest({
    title: req.body.title,
    author: req.user._id,
    content: req.body.content,
    tags: req.body.tags.map(e => e.trim()),
    sponsor: req.body.sponsor,
    intro: req.body.intro,
    details: req.body.details,
    start: req.body.start,
    end: req.body.end,
    category: req.body.category,
    file: req.body.file,
    host: req.body.host,
    contact: req.body.contact,
    contact_email: req.body.contact_email
  });
  await contest.save();
  res.json(contest)
}));

// Put
router.put('/:id', catchErrors(async (req, res, next) => {
  const contest = await Contest.findById(req.params.id);
  if (!contest) {
    return next({status: 404, msg: 'Not exist contest'});
  }
  if (contest.author && contest.author._id != req.user._id) {
    return next({status: 403, msg: 'Cannot update'});
  }
  contest.title = req.body.title;
  contest.content = req.body.content;
  contest.tags = req.body.tags;
  contest.sponsor = req.body.sponsor;
  contest.intro = req.body.intro;
  contest.details = req.body.details;
  contest.start = req.body.start;
  contest.end = req.body.end;
  contest.category = req.body.category;
  contest.file = req.body.file;
  contest.host = req.body.host;
  contest.contact = req.body.contact;
  contest.contact_email = req.body.contact_email;
  await contest.save();
  res.json(contest);
}));

// Delete
router.delete('/:id', catchErrors(async (req, res, next) => {
  const contest = await Contest.findById(req.params.id);
  if (!contest) {
    return next({status: 404, msg: 'Not exist contest'});
  }
  if (contest.author && contest.author._id != req.user._id) {
    return next({status: 403, msg: 'Cannot update'});
  }
  await Contest.findOneAndRemove({_id: req.params.id});
  res.json({msg: 'deleted'});
}));


module.exports = router;