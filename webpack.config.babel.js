import fs from 'fs'
import path from 'path'
import webpack from 'webpack'

const appDirectory = fs.realpathSync(process.cwd())

function resolveApp(relativePath) {
  return path.resolve(appDirectory, relativePath)
}

export default {
  devtool: 'cheap-eval-module-source-map',
  entry: resolveApp('src/index.js'),
  output: {
    path: resolveApp('dist'),
    filename: 'index.js',
  },
  module: {
    rules: [
      {
        test: /\.(js)$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
    ],
  },
}
