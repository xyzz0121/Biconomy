module.exports = {
    presets: [
      '@babel/preset-env',
    ],
    plugins: [
      '@babel/plugin-syntax-top-level-await', // 此处为新增配置
      '@babel/plugin-transform-runtime',
    ]
  }