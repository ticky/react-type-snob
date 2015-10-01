# Type Snob for React

Bugs you about little typography details in your React app.
(Spiritual successor to [HypertextTypographer](https://github.com/ticky/HypertextTypographer))

## Usage

```shell
npm install --save react-type-snob
```

```javascript
import React from 'react';
import typeSnob from 'react-type-snob';
typeSnob(React); // Attaches like react-a11y (should I have called it react-t8y?)
```

## Tests included

* Ugly Quotes (`'` or `"`)
* Full-stops used as ellipses (two or more `.` characters in a row)
* Spaces preceding ellipses
