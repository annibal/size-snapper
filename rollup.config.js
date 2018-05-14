// import autoExternal from 'rollup-plugin-auto-external';
import babel from 'rollup-plugin-babel';
import nodeResolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

export default {
    moduleName: 'SizeSnapper',
    entry: './src/index.js',
    dest: './dist/size-snapper.js',
    format: 'iife',
    sourceMap: 'inline',
    plugins: [
        nodeResolve({
            jsnext: true,
            main: true,
            browser: true,
        }),
        commonjs(),
        babel({
            babelrc: false,
            presets: ["es2015-rollup"]
        }),
    ],
};