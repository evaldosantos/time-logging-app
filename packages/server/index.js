const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const storageService = require('./src/service/storage');

const app = express();

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

app.post('/api/timers', async (req, res) => {
  try {
    const data = await readFile(DATA_FILE);
    const timers = JSON.parse(data);

    const { title, project, id } = req.body;
    const newTimer = {
      title,
      project,
      id,
      elapsed: 0,
      runningSince: null,
    };

    const newTimers = [...timers, newTimer];

    await writeFile(DATA_FILE, JSON.stringify(newTimers, null, 4));

    res.json(newTimers);
  } catch (e) {
    res.status(500);
  }
});

app.put('/api/timers', async (req, res) => {
  try {
    const { id, title, project } = req.body;

    const data = await readFile(DATA_FILE);
    const timers = JSON.parse(data);

    const newTimers = timers.map((timer) =>
      timer.id !== id
        ? timer
        : {
            ...timer,
            title,
            project,
          }
    );

    await writeFile(DATA_FILE, JSON.stringify(newTimers, null, 4));

    res.json({});
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

    await writeFile(DATA_FILE, JSON.stringify(newTimers, null, 4));

    res.json({});
  } catch (e) {
    res.status(500);
  }
});

app.post('/api/timers/stop', async (req, res) => {
  try {
    const { id, stop } = req.body;
    const data = await readFile(DATA_FILE);
    const timers = JSON.parse(data);

    const newTimers = timers.map((timer) =>
      timer.id !== id
        ? timer
        : {
            ...timer,
            ...{
              elapsed: timer.elapsed + (stop - timer.runningSince),
              runningSince: null,
            },
          }
    );

    await writeFile(DATA_FILE, JSON.stringify(newTimers, null, 4));

    res.json({});
  } catch (e) {
    res.status(500);
  }
});

app.delete('/api/timers', async (req, res) => {
  try {
    const { id } = req.body;
    const data = await readFile(DATA_FILE);
    let timers = JSON.parse(data);

    const newTimers = timers.filter((timer) => timer.id !== id);

    await writeFile(DATA_FILE, JSON.stringify(newTimers, null, 4));

    res.json({});
  } catch (e) {
    res.status(500);
  }
});

app.listen(app.get('port'));
