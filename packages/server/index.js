const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const util = require('util');
const bodyParser = require('body-parser');

const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

const app = express();

const DATA_FILE = path.join(__dirname, 'data.json');

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
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

app.post('/api/timers/start', async (req, res) => {
  try {
    const { id, start } = req.body;

    const data = await readFile(DATA_FILE);
    const timers = JSON.parse(data);

    const newTimers = timers.map((timer) => (timer.id !== id ? timer : { ...timer, runningSince: start }));

    writeFile(DATA_FILE, JSON.stringify(newTimers, null, 4));

    res.json(newTimers);
  } catch (e) {
    res.status(500);
  }
});

app.listen(app.get('port'));
