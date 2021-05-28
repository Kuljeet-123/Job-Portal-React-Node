const express = require('express');
const {
  Account,
  Recruiter,
  User,
} = require('../model');

const {
  MSG_DATA_INSUFFICIENT_ERROR,
  MSG_INTERNAL_ERROR,
  MSG_INVALID_CREDS,

} = require('../constants/statusMessage');

const router = express.Router();

// application routes

router.get('/recruiter', async (req, res) => {
  // get all recruiter
  const responseObject = {
    status: 'failed',
    message: MSG_INTERNAL_ERROR,
  };
  try {
    const { authorization: token } = req.headers;
    if (!token) throw Error(MSG_DATA_INSUFFICIENT_ERROR);
    const account = await Account.findOneWithToken(token);
    if (!account) throw Error(MSG_INVALID_CREDS);
    const user = await User.findById(account.uid);
    if (!user || user.role !== 1) throw Error(MSG_INVALID_CREDS);

    const recruiters = await Recruiter.findAll();
    const result = await Promise.all(recruiters.map(async (r) => {
      const usr = await User.findById(r.uid);
      if (usr) {
        return {
          ...usr,
          ...r,
        };
      }
      return r;
    }));
    responseObject.status = 'success';
    responseObject.message = '';
    responseObject.data = result;
  } catch (e) {
    responseObject.status = 'failed';
    responseObject.message = e.message;
  } finally {
    res.json(responseObject);
  }
});


router.get('/recruiter/new', async (req, res) => {
  // get all recruiter
  const responseObject = {
    status: 'failed',
    message: MSG_INTERNAL_ERROR,
  };
  try {
    const { authorization: token } = req.headers;
    if (!token) throw Error(MSG_DATA_INSUFFICIENT_ERROR);
    const account = await Account.findOneWithToken(token);
    if (!account) throw Error(MSG_INVALID_CREDS);
    const user = await User.findById(account.uid);
    if (!user || user.role !== 1) throw Error(MSG_INVALID_CREDS);

    const recruiters = await Recruiter.findNew();
    const result = await Promise.all(recruiters.map(async (r) => {
      const usr = await User.findById(r.uid);
      if (usr) {
        return {
          ...usr,
          ...r,
        };
      }
      return r;
    }));
    responseObject.status = 'success';
    responseObject.message = '';
    responseObject.data = result;
  } catch (e) {
    responseObject.status = 'failed';
    responseObject.message = e.message;
  } finally {
    res.json(responseObject);
  }
});

router.get('/recruiter/:id', async (req, res) => {
  // get all recruiter
  const responseObject = {
    status: 'failed',
    message: MSG_INTERNAL_ERROR,
  };
  try {
    const { authorization: token } = req.headers;
    if (!token) throw Error(MSG_DATA_INSUFFICIENT_ERROR);
    const account = await Account.findOneWithToken(token);
    if (!account) throw Error(MSG_INVALID_CREDS);
    const user = await User.findById(account.uid);
    if (!user || user.role !== 1) throw Error(MSG_INVALID_CREDS);

    const recruiterId = Number.parseInt(req.params.id, 10);
    const recruiter = await Recruiter.findById(recruiterId);
    const recruiterUser = await User.findById(recruiter.uid);
    const result = {
      ...recruiter,
      ...recruiterUser,
    };
    responseObject.status = 'success';
    responseObject.message = '';
    responseObject.data = result;
  } catch (e) {
    responseObject.status = 'failed';
    responseObject.message = e.message;
  } finally {
    res.json(responseObject);
  }
});

router.put('/recruiter/:id', async (req, res) => {
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
    if (!user || user.role !== 1) throw Error(MSG_INVALID_CREDS);

    const { uid, newStatus } = req.body;

    if (!([0, 1, 2].some((e) => e === Number.parseInt(newStatus, 10)))) {
      throw Error(MSG_DATA_INSUFFICIENT_ERROR);
    }

    const isSuccess = await Recruiter.updateStatusWithId(uid, newStatus);
    if (!isSuccess) throw Error(MSG_INTERNAL_ERROR);
    responseObject.status = 'success';
    responseObject.message = '';
  } catch (e) {
    responseObject.status = 'failed';
    responseObject.message = e.message;
  } finally {
    res.json(responseObject);
  }
});

module.exports = router;
