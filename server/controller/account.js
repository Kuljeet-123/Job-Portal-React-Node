const express = require('express');
const randtoken = require('rand-token');
const {
  Account, User, Candidate, Recruiter,
} = require('../model');
const {
  MSG_DATA_INSUFFICIENT_ERROR,
  MSG_DUPLICATE_EMAIL_ERROR,
  MSG_INTERNAL_ERROR,
  MSG_SIGNUP_SUCCESS,
} = require('../constants/statusMessage');
const { Auth } = require('../service');

const router = express.Router();

router.post('/new', async (req, res) => {
  // register a new user here
  const responseObject = {
    status: 'falied',
    message: MSG_DATA_INSUFFICIENT_ERROR,
  };

  const user = req.body.data;
  try {
    if (!user) throw Error(MSG_DATA_INSUFFICIENT_ERROR);

    const token = randtoken.generate(16);
    const {
      firstName,
      lastName,
      email,
      userType,
      mobile,
      address,
    } = user;
    const plainPassword = user.password;

    if (!([firstName, lastName, email, plainPassword, userType, mobile, address].every((e) => e))) {
      throw Error(MSG_DATA_INSUFFICIENT_ERROR);
    }

    const password = await Auth.getHash(plainPassword);
    if (!password) throw Error(MSG_INTERNAL_ERROR);

    if (userType.toLowerCase() === 'recruiter') {
      // register the recruiter
      const { position, company } = user;

      if (!([position, company].every((e) => e))) {
        throw Error(MSG_DATA_INSUFFICIENT_ERROR);
      }

      const uid = await Account.create({
        email,
        password,
        token,
      });

      if (!uid) throw Error(MSG_DUPLICATE_EMAIL_ERROR);

      const isUserEntrySuccess = await User.create({
        uid,
        name: `${firstName} ${lastName}`,
        mobile: Number.parseInt(mobile, 10),
        role: 2,
        address,
      });

      if (!isUserEntrySuccess) throw Error(MSG_INTERNAL_ERROR);

      const isRecruiterEntrySuccess = await Recruiter.create({
        uid,
        position,
        company,
        status: 0,
      });

      if (!isRecruiterEntrySuccess) throw Error(MSG_INTERNAL_ERROR);

      responseObject.status = 'success';
      responseObject.message = MSG_SIGNUP_SUCCESS;
    } else {
      // register the candidate
      const {
        dob, highestEducation, experience,
      } = user;

      if (!([dob, highestEducation, experience].every((e) => e))) {
        throw Error(MSG_DATA_INSUFFICIENT_ERROR);
      }
      const uid = await Account.create({
        email,
        password,
        token,
      });

      if (!uid) throw Error(MSG_DUPLICATE_EMAIL_ERROR);

      const isUserEntrySuccess = await User.create({
        uid,
        name: `${firstName} ${lastName}`,
        mobile: Number.parseInt(mobile, 10),
        role: 3,
        address,
      });

      if (!isUserEntrySuccess) throw Error(MSG_INTERNAL_ERROR);

      const isCandidateEntrySuccess = await Candidate.create({
        uid,
        dob,
        experience: Number.parseInt(experience, 10),
        highestEducation,
      });

      if (!isCandidateEntrySuccess) throw Error(MSG_INTERNAL_ERROR);
      responseObject.status = 'success';
      responseObject.message = MSG_SIGNUP_SUCCESS;
    }
  } catch (e) {
    responseObject.message = e.message;
  } finally {
    res.json(responseObject);
  }
});

module.exports = router;
