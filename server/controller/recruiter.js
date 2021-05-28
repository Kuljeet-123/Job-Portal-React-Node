const express = require('express');
const {
  MSG_INTERNAL_ERROR,
  MSG_DATA_INSUFFICIENT_ERROR,
  MSG_INVALID_CREDS,
} = require('../constants/statusMessage');
const Account = require('../model/Account');
const Candidate = require('../model/Candidate');
const User = require('../model/User');
const Recruiter = require('../model/Recruiter');
const Job = require('../model/Job');
const Application = require('../model/Application');

const router = express.Router();


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

    const recruiter = await Recruiter.findById(account.uid);
    if (!recruiter) throw Error(MSG_INTERNAL_ERROR);
    responseObject.status = 'success';
    responseObject.message = '';
    responseObject.data = recruiter;
  } catch (e) {
    responseObject.status = 'failed';
    responseObject.message = e.message;
  } finally {
    res.json(responseObject);
  }
});


router.get('/applicant/:id', async (req, res) => {
  const responseObject = {
    status: 'failed',
    message: MSG_INTERNAL_ERROR,
    data: null,
  };
  try {
    const { authorization: token } = req.headers;
    if (!token) throw Error(MSG_DATA_INSUFFICIENT_ERROR);
    const account = await Account.findOneWithToken(token);
    if (!account) throw Error(MSG_INVALID_CREDS);

    const recruiter = await Recruiter.findById(account.uid);
    if (!recruiter) throw Error(MSG_INTERNAL_ERROR);
    const applicant = await Application.findById(Number.parseInt(req.params.id, 10));
    if (!applicant) throw Error(MSG_DATA_INSUFFICIENT_ERROR);
    const user = await User.findById(applicant.uid);
    const candidateProfile = await Candidate.findByUid(applicant.uid);

    responseObject.status = 'success';
    responseObject.message = '';
    responseObject.data = {
      ...applicant,
      ...user,
      ...candidateProfile,
    };
  } catch (e) {
    responseObject.status = 'failed';
    responseObject.message = e.message;
    responseObject.data = null;
  } finally {
    res.json(responseObject);
  }
});


router.put('/applicant', async (req, res) => {
  const responseObject = {
    status: 'failed',
    message: MSG_INTERNAL_ERROR,
  };
  try {
    const { authorization: token } = req.headers;
    if (!token) throw Error(MSG_DATA_INSUFFICIENT_ERROR);
    const account = await Account.findOneWithToken(token);
    if (!account) throw Error(MSG_INVALID_CREDS);

    const recruiter = await Recruiter.findById(account.uid);
    if (!recruiter) throw Error(MSG_INTERNAL_ERROR);

    const { id, status, message } = req.body;
    const isSuccess = await Application.updateStatus(id, status, message);
    if (!isSuccess) throw Error('Could not update');

    responseObject.status = 'success';
    responseObject.message = 'Updated successfuly';
  } catch (e) {
    responseObject.status = 'failed';
    responseObject.message = e.message;
  } finally {
    res.json(responseObject);
  }
});


router.get('/job', async (req, res) => {
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

    const recruiter = await Recruiter.findById(account.uid);
    if (!recruiter) throw Error(MSG_INTERNAL_ERROR);
    const jobs = await Job.findByRecruiter(account.uid);
    responseObject.status = 'success';
    responseObject.message = '';
    if (jobs) {
      responseObject.data = jobs;
    }
  } catch (e) {
    responseObject.status = 'failed';
    responseObject.message = e.message;
  } finally {
    res.json(responseObject);
  }
});


router.get('/job/:id', async (req, res) => {
  const responseObject = {
    status: 'failed',
    message: MSG_INTERNAL_ERROR,
    data: null,
  };
  try {
    const { authorization: token } = req.headers;
    if (!token) throw Error(MSG_DATA_INSUFFICIENT_ERROR);
    const account = await Account.findOneWithToken(token);
    if (!account) throw Error(MSG_INVALID_CREDS);

    const recruiter = await Recruiter.findById(account.uid);
    if (!recruiter) throw Error(MSG_INTERNAL_ERROR);
    const job = await Job.findById(Number.parseInt(req.params.id, 10));
    const applicants = await Application.findByJid(Number.parseInt(req.params.id, 10));

    job.applicants = [];
    if (applicants) {
      job.applicants = await Promise.all(applicants.map(async (applicant) => {
        const user = await User.findById(applicant.uid);
        const candidate = await Candidate.findByUid(applicant.uid);
        return {
          ...applicant,
          ...user,
          ...candidate,
        };
      }));
    }
    responseObject.status = 'success';
    responseObject.message = '';
    if (job) {
      responseObject.data = job;
    }
  } catch (e) {
    responseObject.status = 'failed';
    responseObject.message = e.message;
    responseObject.data = null;
  } finally {
    res.json(responseObject);
  }
});


router.post('/job/new', async (req, res) => {
  const responseObject = {
    status: 'failed',
    message: MSG_INTERNAL_ERROR,
    data: null,
  };
  try {
    const { authorization: token } = req.headers;
    if (!token) throw Error(MSG_DATA_INSUFFICIENT_ERROR);
    const account = await Account.findOneWithToken(token);
    if (!account) throw Error(MSG_INVALID_CREDS);

    const recruiter = await Recruiter.findById(account.uid);
    if (!recruiter) throw Error(MSG_INTERNAL_ERROR);

    const {
      title, description, location, tag,
    } = req.body;

    if (![title, description, location, tag].some((e) => !!e)) {
      throw Error(MSG_DATA_INSUFFICIENT_ERROR);
    }
    const jobId = await Job.create({
      addedBy: account.uid, title, description, location, tag,
    });
    if (!jobId && jobId !== 0) throw Error(MSG_INTERNAL_ERROR);

    responseObject.status = 'success';
    responseObject.message = '';
    responseObject.data = {
      jid: jobId,
    };
  } catch (e) {
    responseObject.status = 'failed';
    responseObject.message = e.message;
  } finally {
    res.json(responseObject);
  }
});


module.exports = router;
