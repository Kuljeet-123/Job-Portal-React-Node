const express = require('express');
const {
  MSG_INTERNAL_ERROR,
  MSG_DATA_INSUFFICIENT_ERROR,
  MSG_INVALID_CREDS,
} = require('../constants/statusMessage');

const User = require('../model/User');

const router = express.Router();

// user
router.get('/:id', async (req, res) => {
  const responseObject = {
    status: 'failed',
    message: MSG_INTERNAL_ERROR,
  };

  try {
    const { id } = req.params;
    if (!id) throw Error(MSG_DATA_INSUFFICIENT_ERROR);
    const user = await User.findById(parseInt(id, 10));
    if (!user) throw Error(MSG_INVALID_CREDS);

    responseObject.status = 'success';
    responseObject.message = 'success';
    responseObject.data = {
      user,
    };
  } catch (e) {
    responseObject.status = 'failed';
    responseObject.message = e.message;
  } finally {
    res.json(responseObject);
  }
});


module.exports = router;
