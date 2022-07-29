import resolve from '@rollup/plugin-node-resolve'
import babel from '@rollup/plugin-babel'
import del from 'rollup-plugin-delete'
import dts from 'rollup-plugin-dts'

const name = 'index'

export default [
  {
    input: `src/${name}.tsx`,
    output: [
      {
        file: `lib/${name}.mjs`,
        format: 'es',
        exports: 'default'
      },
      {
        file: `lib/${name}.js`,
        format: 'cjs',
        exports: 'auto'
      }
    ],
    external: [
      'react'
    ],
    plugins: [
      del({ targets: 'lib/*' }),

      resolve({ extensions: ['.js', '.ts', '.tsx'] }),

      babel({
        babelHelpers: 'bundled',
        extensions: ['.js', '.ts', '.tsx']
      })
    ]
  },
  {
    input: `src/${name}.tsx`,
    output: {
      file: `lib/${name}.d.ts`,
      format: 'es'
    },
    external: [
      'react',
      id => /QR-Code-generator/.test(id)
    ],
    plugins: [
      dts()
    ]
  }
]
