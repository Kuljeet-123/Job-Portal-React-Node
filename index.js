require('dotenv').config();

const PORT = process.env.PORT || 3100;
require('./server')(PORT);
