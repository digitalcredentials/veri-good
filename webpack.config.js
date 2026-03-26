import path from 'path';
 import HtmlWebpackPlugin from 'html-webpack-plugin';
import webpack from 'webpack';

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
  optimization: {
    // Disable the default SplitChunksPlugin behavior
    splitChunks: false, 
  },

  plugins: [
    new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: 1, // Ensures all code is bundled into a single chunk
    }),
  ],
};