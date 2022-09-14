

run `wrangler init` and create a typescript project

install webpack: `npm install webpack webpack-cli --save-dev`

create `webpack.config.js` file for typescript as specified [the webpack docs](https://webpack.js.org/guides/typescript/)

adapt webpack configuration to output a module instead of a script
```
output: {
    filename: 'index.mjs',
    path: path.join(__dirname, 'dist'),
    library: {
        type: 'module',
    },
},
experiments: {
    outputModule: true,
},
```

add `build` script to `package.json` for running `webpack`

install yaml webpack loader `npm install --save-dev yaml-loader`

add rules for laoding yaml to `webpack.config.js`

add `yaml.d.ts` file to satisfy Typescript

