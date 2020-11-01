import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';

export default {
    input: 'src/js/main.js',
    output: {
        file: '_site/js/main.js',
        format: 'iife',
        sourcemap: true,
    },
    plugins: [
        resolve(),
        commonjs(),
        babel({
            babelrc: false,
            exclude: [/\/core-js\//],
            presets: [
                [
                    '@babel/preset-env',
                    {
                        useBuiltIns: 'usage',
                        corejs: 3,
                    },
                ],
            ],
            babelHelpers: 'bundled',
        }),
    ],
    context: 'window',
};
