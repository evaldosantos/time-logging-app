const fs = require('fs');

const readFile = util.promisify(fs.readFile);
const riteFile = util.promisify(fs.writeFile);

class FileService {
  static instance;

  static getInstance = (path) => (FileService.instance = FileService.instance || new FileService(path));

  constructor(path) {
    this.path = path;
  }

  readTimers = async () => {
    try {
      const data = await readFile(this.path);
      const timers = JSON.parse(data);

      return timers;
    } catch (e) {
      throw e;
    }
  };

  writeTimers = async (timers) => {
    try {
      await writeFile(this.path, JSON.stringify(timers, null, 4));
    } catch (e) {
      throw e;
    }
  };

  getTimers = async () => {
    try {
      const data = await this.readTimers();
      return data;
    } catch (e) {
      throw e;
    }
  };

  addTimer = async (timer) => {
    try {
      const timers = await this.getTimers();

      const newTimers = [...timers, timer];

      await this.writeTimers(newTimers);
    } catch (e) {
      throw e;
    }
  };

  updateTimer = async (updatedTimer) => {
    try {
      const timers = await this.getTimers();

      const newTimers = timers.map((timer) =>
        timer.id !== id
          ? timer
          : {
              ...timer,
              ...updatedTimer,
            }
      );

      await this.writeTimers(newTimers);
    } catch (e) {
      throw e;
    }
  };

  deleteTimer = async (deletedTimer) => {
    try {
      const timers = await this.getTimers();

      const newTimers = timers.filter((timer) => timer.id !== deletedTimer.id);

      await this.writeTimers(newTimers);
    } catch (e) {
      throw e;
    }
  };
}
