const express = require('express');
const {
  MSG_INTERNAL_ERROR,
  MSG_DATA_INSUFFICIENT_ERROR,
  MSG_INVALID_CREDS,
} = require('../constants/statusMessage');
const Account = require('../model/Account');
const Job = require('../model/Job');
const User = require('../model/User');
const Application = require('../model/Application');

const router = express.Router();

// job routes


router.get('/applied', async (req, res) => {
  const responseObject = {
    status: 'failed',
    message: MSG_INTERNAL_ERROR,
    data: [],
  };
  try {
    const { authorization: token } = req.headers;
    if (!token) throw Error(MSG_DATA_INSUFFICIENT_ERROR);
    const account = await Account.findOneWithToken(token);
    if (!account) throw Error(MSG_INVALID_CREDS);
    const applications = await Application.findByUid(account.uid);
    const jobs = await Promise.all(applications.map(async (application) => {
      const job = await Job.findById(application.jid);
      return job;
    }));
    if (!applications) throw Error(MSG_INTERNAL_ERROR);
    responseObject.status = 'success';
    responseObject.message = '';
    responseObject.data = jobs;
  } catch (e) {
    responseObject.status = 'failed';
    responseObject.message = e.message;
  } finally {
    res.json(responseObject);
  }
});


router.get('/:jid', async (req, res) => {
  const responseObject = {
    status: 'failed',
    message: MSG_INTERNAL_ERROR,
    data: [],
  };
  try {
    const { authorization: token } = req.headers;
    if (!token) throw Error(MSG_DATA_INSUFFICIENT_ERROR);
    const account = await Account.findOneWithToken(token);
    if (!account) throw Error(MSG_INVALID_CREDS);
    const user = await User.findById(account.uid);
    if (!user) throw Error(MSG_INTERNAL_ERROR);
    const { jid } = req.params;
    const job = await Job.findById(jid);
    if (!job) throw Error(MSG_INTERNAL_ERROR);
    const isApplied = await Application.find(account.uid, jid);
    if (isApplied) {
      job.isApplied = true;
    }
    responseObject.status = 'success';
    responseObject.message = '';
    responseObject.data = job;
  } catch (e) {
    responseObject.status = 'failed';
    responseObject.message = e.message;
  } finally {
    res.json(responseObject);
  }
});


router.get('/search/', async (req, res) => {
  const responseObject = {
    status: 'failed',
    message: MSG_INTERNAL_ERROR,
    data: [],
  };
  try {
    const { authorization: token } = req.headers;
    if (!token) throw Error(MSG_DATA_INSUFFICIENT_ERROR);
    const account = await Account.findOneWithToken(token);
    if (!account) throw Error(MSG_INVALID_CREDS);
    const user = await User.findById(account.uid);
    if (!user) throw Error(MSG_INTERNAL_ERROR);
    const { location, tag } = req.query;
    const jobs = await Job.find(location, tag);
    if (!jobs) throw Error(MSG_INTERNAL_ERROR);
    responseObject.status = 'success';
    responseObject.message = '';
    responseObject.data = jobs;
  } catch (e) {
    responseObject.status = 'failed';
    responseObject.message = e.message;
  } finally {
    res.json(responseObject);
  }
});

router.get('/', async (req, res) => {
  const responseObject = {
    status: 'failed',
    message: MSG_INTERNAL_ERROR,
    data: [],
  };
  try {
    const { authorization: token } = req.headers;
    if (!token) throw Error(MSG_DATA_INSUFFICIENT_ERROR);
    const account = await Account.findOneWithToken(token);
    if (!account) throw Error(MSG_INVALID_CREDS);
    const user = await User.findById(account.uid);
    if (!user) throw Error(MSG_INTERNAL_ERROR);
    const jobs = await Job.find(user.address);
    if (!jobs) throw Error(MSG_INTERNAL_ERROR);
    responseObject.status = 'success';
    responseObject.message = '';
    responseObject.data = jobs;
  } catch (e) {
    responseObject.status = 'failed';
    responseObject.message = e.message;
  } finally {
    res.json(responseObject);
  }
});


module.exports = router;
