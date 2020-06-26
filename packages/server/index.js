const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const util = require('util');
const bodyParser = require('body-parser');
const storageService = require('./src/service/storage');

const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

const app = express();

const DATA_FILE = path.join(__dirname, '..', '..', '..', 'data.json');

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('port', process.env.PORT || 3000);

app.get('/api/timers', async (req, res) => {
  try {
    const data = await storageService.getTimers();

    res.json(data);
  } catch (e) {
    res.status(500);
  }
});

app.post('/api/timers', async (req, res) => {
  try {
    const { title, project, id } = req.body;
    const newTimer = {
      title,
      project,
      id,
      elapsed: 0,
      runningSince: null,
    };

    await storageService.addTimer(newTimer);

    res.json(newTimer);
  } catch (e) {
    res.status(500);
  }
});

app.put('/api/timers', async (req, res) => {
  try {
    const { id, title, project } = req.body;

    const timer = await storageService.getTimer(id);

    const newTimer = {
      ...timer,
      title,
      project,
    };

    await storageService.updateTimer(newTimer);

    res.json(newTimer);
  } catch (e) {
    res.status(500);
  }
});

app.post('/api/timers/start', async (req, res) => {
  try {
    const { id, start } = req.body;

    const timer = await storageService.getTimer(id);

    const newTimer = {
      ...timer,
      runningSince: start,
    };

    await storageService.updateTimer(newTimer);

    res.json(newTimer);
  } catch (e) {
    res.status(500);
  }
});

app.post('/api/timers/stop', async (req, res) => {
  try {
    const { id, stop } = req.body;

    const timer = await storageService.getTimer(id);

    const newTimer = {
      ...timer,
      elapsed: timer.elapsed + (stop - timer.runningSince),
      runningSince: null,
    };

    await storageService.updateTimer(newTimer);

    res.json(newTimer);
  } catch (e) {
    res.status(500);
  }
});

app.delete('/api/timers', async (req, res) => {
  try {
    const { id } = req.body;
    const timer = { id };

    await storageService.deleteTimer(timer);

    res.json();
  } catch (e) {
    res.status(500);
  }
});

app.listen(app.get('port'));
