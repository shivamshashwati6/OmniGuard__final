const js = require('@eslint/js');

module.exports = [
  { ignores: ["node_modules/**", "coverage/**", "tests/**"] },
  js.configs.recommended,
  {
    languageOptions: { 
      ecmaVersion: 2022, 
      sourceType: 'commonjs',
      globals: {
        console: 'readonly',
        process: 'readonly',
        module: 'readonly',
        require: 'readonly',
        __dirname: 'readonly',
        Buffer: 'readonly',
        setTimeout: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',
        fetch: 'readonly'
      }
    },
    rules: { 
      'no-unused-vars': 'warn', 
      'no-undef': 'error' 
    }
  }
];
