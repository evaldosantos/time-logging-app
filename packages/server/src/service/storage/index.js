const path = require('path');

const StrategyManager = require('./StrategyManager');
const FileStrategy = require('./FileStrategy');

const DATA_FILE = path.join(__dirname, '..', '..', '..', 'data.json');

const strategyManager = new StrategyManager();
const fileStrategy = new FileStrategy(DATA_FILE);

strategyManager.strategy = fileStrategy;

module.exports = strategyManager;
