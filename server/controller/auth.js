const express = require('express');
const { Account } = require('../model');
const {
  MSG_INVALID_TOKEN,
  MSG_INVALID_CREDS,
  MSG_LOGIN_SUCCESS,
} = require('../constants/statusMessage');
const { Auth } = require('../service');

const router = express.Router();

// auth
router.post('/login', async (req, res) => {
  // check for login method >> token or data.
  // payload method: token | data, data, token
  const responseObject = {
    status: 'failed',
    message: '',
  };

  try {
    const {
      loginMethod, token, email,
    } = req.body.data;
    const plainPassword = req.body.data.password;
    if (loginMethod === 'token') {
      // do token login here
      const user = await Account.findOneWithToken(token);
      if (!user) throw Error(MSG_INVALID_TOKEN);
      responseObject.status = 'success';
      responseObject.message = MSG_LOGIN_SUCCESS;
      responseObject.data = {
        uid: user.uid,
      };
    } else {
      // do data login here
      const user = await Account.findOne(email);
      if (!user) throw Error(MSG_INVALID_CREDS);
      const isPasswordValid = Auth.isPasswordValid(plainPassword, user.password);
      if (!isPasswordValid) throw Error(MSG_INVALID_CREDS);

      responseObject.status = 'success';
      responseObject.message = MSG_LOGIN_SUCCESS;
      responseObject.data = {
        token: user.token,
        uid: user.uid,
      };
    }
  } catch (e) {
    responseObject.status = 'failed';
    responseObject.message = e.message;
  } finally {
    res.json(responseObject);
  }
});


module.exports = router;
