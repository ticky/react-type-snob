import getDisplayName from './get-display-name';
import consoleReporter from './console-reporter';

const SNOBBY_TESTS = [
  {
    name: 'ugly quotes',
    regexp: /['"]/g
  },
  {
    name: 'full-stops as ellipses',
    regexp: /\.{2,}/g
  },
  {
    name: 'space preceding ellipses',
    regexp: /\s(?:\.{2,}|…)/g
  }
];

export default function typeSnob(React, reporter = consoleReporter) {
  if (!React) {
    throw new Error('[React Type Snob] `React` was not supplied!');
  }

  if (!React.createElement || typeof React.createElement !== 'function') {
    throw new Error('[React Type Snob] `React.createElement` isn\'t a function - are you sure you called this with React?');
  }

  if (!React.Children) {
    throw new Error('[React Type Snob] `React.Children` seems to be missing - are you sure you called this with React?');
  }

  // keep original `createElement` method, as we intend to proxy it!
  const createElement = React.createElement;

  React.createElement = function typeSnobCreateElement(type, rawProps, ...rawChildren) {
    const props = rawProps || {};
    let children;

    if (rawChildren.length === 0) {
      children = props.children || [];
    } else {
      children = rawChildren;
    }

    // proy out to the real `createElement` early so we don't try to test any invalid states!
    const reactElement = createElement.call(this, type, rawProps, ...rawChildren);

    const displayName = getDisplayName(type, rawProps);

    const errors = [];

    React.Children.forEach(children, (child) => {
      if (typeof child === 'string') {
        SNOBBY_TESTS.forEach(({ name, regexp }) => {
          if (regexp.test(child) && errors.indexOf(name) === -1) {
            errors.push(name);
          }
        });
      }
    });

    if (errors.length > 0) {
      reporter(
        `[React Type Snob] Problems detected in copy of \`${displayName}\`; ${errors.join(', ')}. Please check the render method of \`${reactElement._owner.getName()}\``
      );
    }

    return reactElement;
  };
}
