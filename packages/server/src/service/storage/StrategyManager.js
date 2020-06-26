class StrategyManager {
  constructor() {
    this._strategy = null;
  }

  set strategy(strategy) {
    this._strategy = strategy;
  }

  get strategy() {
    return this._strategy;
  }

  getTimer = (id) => this._strategy.getTimer(id);

  getTimers = () => this._strategy.getTimers();

  addTimer = (timer) => this._strategy.addTimer(timer);

  updateTimer = (updatedTimer) => this._strategy.updateTimer(updatedTimer);

  deleteTimer = (deletedTimer) => this._strategy.deleteTimer(deletedTimer);
}

module.exports = StrategyManager;
