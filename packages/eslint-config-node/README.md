# @elestyle/eslint-config-vue

### Install

```sh
$ npm login --registry=https://elepay.jfrog.io/elepay/api/npm/npm-local/ --scope=@elestyle
$ npm config set @elestyle:registry https://elepay.jfrog.io/elepay/api/npm/npm-local/

$ yarn add @elestyle/eslint-config-vue -D
```

### Usage

`.eslintrc.js`

```js
module.exports = {
  root: true,
  extends: [
    '@elestyle/vue'
  ]
}
```
