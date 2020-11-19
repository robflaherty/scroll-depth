import babel from '@rollup/plugin-babel';

export default {
  input: 'src/scrolldepth.js',
  output: {
    file: 'dist/scrolldepth.js',
    name: 'scrolldepth',
    format: 'umd'
  },
  plugins: [
    babel({
      exclude: ['node_modules/**']
    })
  ]
};