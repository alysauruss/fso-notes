import globals from 'globals';
import js from '@eslint/js';
import stylisticJs from '@stylistic/eslint-plugin';

export default [
  js.configs.recommended,
  {
    files: ['**/*.js'],
    languageOptions: {
      sourceType: 'commonjs',
      globals: { ...globals.node },
      ecmaVersion: 'latest',
    },
    plugins: {
      '@stylistic/js': stylisticJs,
    },
    rules: {
      // --- Formatting (handled by @stylistic plugin) ---
      '@stylistic/js/indent': ['error', 2], // 2-space indentation
      '@stylistic/js/linebreak-style': ['error', 'unix'], // LF line endings
      '@stylistic/js/quotes': ['error', 'single'], // single quotes always
      '@stylistic/js/semi': ['error', 'always'], // always use semicolons

      // --- Whitespace & Spacing ---
      'no-trailing-spaces': 'error', // no spaces at end of lines
      'object-curly-spacing': ['error', 'always'], // { like: this } not {like:this}
      'arrow-spacing': ['error', { before: true, after: true }], // x => x, not x=>x

      // --- Variables ---
      'prefer-const': 'error', // use const unless you need to reassign
      'no-var': 'error', // ban var, use let/const instead
      'no-unused-vars': 'warn', // no declared variables that are never used

      // --- Equality ---
      eqeqeq: 'error', // always === instead of ==

      // --- Functions ---
      'prefer-arrow-callback': 'error', // use arrow functions in callbacks, not function()
      // 'arrow-body-style': ['error', 'as-needed'], // omit {} and return when not needed
      'arrow-parens': ['error', 'always'], // always include parentheses around arrow function parameters

      // --- Objects & Arrays ---
      'no-param-reassign': 'error', // don't reassign function parameters
      'dot-notation': 'error', // obj.foo instead of obj['foo'] when possible
      'no-array-constructor': 'error', // use [] instead of new Array()
      'object-shorthand': ['error', 'always'], // { x } instead of { x: x }

      // --- Control Flow ---
      'consistent-return': 'error', // function must always or never explicitly return
      'no-else-return': 'error', // no else after a return statement
      'guard-for-in': 'error', // require hasOwnProperty check in for...in loops

      // --- Error Prone ---
      'no-shadow': 'error', // no variable names that shadow outer scope variables
      'no-use-before-define': 'error', // don't use variables before they're declared

      // --- Console (disabled for backend dev) ---
      'no-console': 'off', // allow console.log (useful in Node/backend)
    },
  },
  {
    ignores: ['dist/**'],
  },
];
