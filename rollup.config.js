// rollup.config.js
import typescript from '@rollup/plugin-typescript';
import { terser } from 'rollup-plugin-terser';

export default {
  // 修改入口为 global.ts
  input: 'src/index.ts',

  // 输出配置
  output: [
    {
      // IIFE 格式用于 CDN
      file: 'dist/bundle.js',
      format: 'iife',
      name: 'ParticleCanvasPro',
      sourcemap: false,
      // Rollup 自动处理导出
      exports: 'auto',
    },
    {
      // 同时生成 CommonJS 格式
      file: 'dist/bundle.cjs.js',
      format: 'cjs',
      sourcemap: false,
    },
    {
      // 同时生成 ES 模块格式
      file: 'dist/bundle.esm.js',
      format: 'es',
      sourcemap: false
    }
  ],

  // 插件配置
  plugins: [
    typescript({
      declaration: true,
      declarationDir: 'dist/types',
      rootDir: 'src',
      // exclude: ['**/*.test.ts']
    }),
    terser()
  ]
};