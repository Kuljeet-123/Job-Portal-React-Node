const express = require('express');
const {
  MSG_INTERNAL_ERROR,
  MSG_DATA_INSUFFICIENT_ERROR,
  MSG_INVALID_CREDS,
} = require('../constants/statusMessage');
const Account = require('../model/Account');
const Application = require('../model/Application');
const Job = require('../model/Job');
const Recruiter = require('../model/Recruiter');

const router = express.Router();

// application routes

router.post('/new', async (req, res) => {
  const responseObject = {
    status: 'failed',
    message: MSG_INTERNAL_ERROR,
  };
  try {
    const { authorization: token } = req.headers;
    if (!token) throw Error(MSG_DATA_INSUFFICIENT_ERROR);
    const account = await Account.findOneWithToken(token);
    if (!account) throw Error(MSG_INVALID_CREDS);

    const { jid } = req.body;

    const applicationId = await Application.create({
      jid, uid: account.uid, status: 0,
    });
    if (!applicationId && applicationId !== 0) throw Error(MSG_INTERNAL_ERROR);

    responseObject.status = 'success';
    responseObject.message = '';
  } catch (e) {
    responseObject.status = 'failed';
    responseObject.message = e.message;
  } finally {
    res.json(responseObject);
  }
});


router.get('/interviews', async (req, res) => {
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
    const interviews = await Application.findInterviews(account.uid);
    const results = await Promise.all(interviews.map(async (interview) => {
      const job = await Job.findById(interview.jid);
      return {
        ...interview,
        ...job,
      };
    }));

    responseObject.status = 'success';
    responseObject.message = '';
    responseObject.data = results;
  } catch (e) {
    responseObject.status = 'failed';
    responseObject.message = e.message;
  } finally {
    res.json(responseObject);
  }
});


router.get('/interview/:id', async (req, res) => {
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
    const { id } = req.params;
    if (!id) throw Error(MSG_DATA_INSUFFICIENT_ERROR);
    const application = await Application.findById(id);
    const job = await Job.findById(application.jid);
    const company = await Recruiter.findById(job.addedBy);
    responseObject.status = 'success';
    responseObject.message = '';
    responseObject.data = {
      ...application,
      ...job,
      companyName: company.company,
    };
  } catch (e) {
    responseObject.status = 'failed';
    responseObject.message = e.message;
  } finally {
    res.json(responseObject);
  }
});


module.exports = router;
