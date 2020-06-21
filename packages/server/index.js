const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const util = require('util');

const readFile = util.promisify(fs.readFile);

const app = express();

const DATA_FILE = path.join(__dirname, 'data.json');

app.use(cors());
app.set('port', process.env.PORT || 3000);

app.get('/api/timers', async (req, res) => {
  try {
    const data = await readFile(DATA_FILE);
    res.setHeader('Cache-Control', 'no-cache');
    res.json(JSON.parse(data));
  } catch (e) {
    res.status(500);
  }
});

app.listen(app.get('port'));
