import path from 'path';
 import HtmlWebpackPlugin from 'html-webpack-plugin';

export default {
    mode: 'development',
  entry: './src/index.js',
   devtool: 'inline-source-map',
  devServer: {
    static: './dist',
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(process.cwd(), 'dist'), 
    clean: false
  },
};