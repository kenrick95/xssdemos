const process = require('process');
const path = require('path');
const MODES = {
  PRODUCTION: 'production',
  DEVELOPMENT: 'development'
};
const MODE =
  process.env.NODE_ENV === 'development' ? MODES.DEVELOPMENT : MODES.PRODUCTION;
const STORIES = [
  './01-cms/',
  './02-cms-on/',
  './03-ref/',
  './04-cms-click/',
  './05-cms-css/'
];
const STORY_INDEX = parseInt(process.env.NUMBER, 10) || 1;
const STORY = STORIES[STORY_INDEX - 1];

const additionalConfigs =
  MODE === MODES.DEVELOPMENT
    ? {
        devServer: {
          contentBase: path.join(__dirname, STORY),
          index: 'index.html'
        }
      }
    : {};

module.exports = {
  entry: {
    main: path.join(__dirname, STORY, 'index.js')
  },
  mode: MODE,
  ...additionalConfigs
};
