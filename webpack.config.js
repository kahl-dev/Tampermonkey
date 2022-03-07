var path = require('path')
var webpack = require('webpack')

module.exports = {
  mode: 'production',
  entry: {
    'jira.init': './src/jira.init',
    'jira.toggle-1': './src/jira.toggl',
    'jira.filter-1': './src/jira.filter',
  },
  output: {
    path: path.resolve(__dirname, 'lib'),
  },
}
