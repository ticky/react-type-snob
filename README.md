# Type Snob for React
[![npm](https://img.shields.io/npm/v/react-type-snob.svg?maxAge=2592000)](https://www.npmjs.com/package/react-type-snob) ![react-type-snob](https://img.shields.io/npm/l/react-type-snob.svg?maxAge=2592000)  [![Build Status](https://travis-ci.org/ticky/react-type-snob.svg?branch=master)](https://travis-ci.org/ticky/react-type-snob) [![codecov](https://codecov.io/gh/ticky/react-type-snob/branch/master/graph/badge.svg)](https://codecov.io/gh/ticky/react-type-snob)

Encourages good typographic details in your React app

Includes tests for:

* Ugly Quotes (`'` or `"`)
* Full-stops used as ellipses (two or more `.` characters in a row)
* Spaces preceding ellipses

A spiritual successor to [HypertextTypographer](https://github.com/ticky/HypertextTypographer)

## Usage

Install using yarn or npm:

```shell
yarn add react-type-snob || npm install --save react-type-snob
```

Attach to React:

```javascript
import React from 'react';
import typeSnob from 'react-type-snob';

typeSnob(React);
```

Then watch your console for errors!

### With Webpack

If you're using Webpack, you can use it only in development by using it like this;

```javascript
import React from 'react';

if (process.env.NODE_ENV !== "production") {
  require('react-type-snob').default(React);
}
```

Then, use a `new webpack.IgnorePlugin(/^react-type-snob$/)` in your production Webpack config so it's only ever included in dev!

### Custom Reporter

Optionally, you may pass a function as the second parameter, which will recieve warning messages. You can use this to either throw, or integrate with a custom logging solution.

```javascript
import React from 'react';
import typeSnob from 'react-type-snob';

typeSnob(React, (...args) => throw new Error(...args));
```
