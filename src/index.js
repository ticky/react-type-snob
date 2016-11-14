import getDisplayName from './get-display-name';
import consoleReporter from './console-reporter';
import verifyReact from './verify-react';

const SNOBBY_TESTS = [
  {
    name: 'ugly double quotes',
    regexp: /"/g,
    suggestion: '`“` or `”`'
  },
  {
    name: 'ugly single quotes',
    regexp: /'/g,
    suggestion: '`‘` or `’`'
  },
  {
    name: 'full-stops as ellipses',
    regexp: /\.{2,}/g,
    suggestion: '`…`'
  },
  {
    name: 'space preceding ellipses',
    regexp: /\s(?:\.{2,}|…)/g
  }
];

const JOINERS = {
  AND: ' and ',
  COMMA: ', ',
  LINE: '\n'
};

const getReportDetails = (errors) => {
  const errorData = {};

  errors.forEach(({ name, suggestion }, index, errorList) => {
    const nameJoiner = (index === errorList.length - 1) ? JOINERS.AND : JOINERS.COMMA;

    errorData.names = (errorData.names ? errorData.names + nameJoiner : '') + name;

    if (suggestion) {
      errorData.suggestions = (errorData.suggestions ? errorData.suggestions + JOINERS.LINE : '') + `* “${name}” test suggests ${suggestion}`;
    }
  });

  return errorData;
};

export default function typeSnob(React, reporter = consoleReporter) {
  verifyReact(React);

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

    // proxy out to the real `createElement` early so we don't try to test any invalid states!
    const reactElement = createElement.call(this, type, rawProps, ...rawChildren);

    let textContent = '';

    React.Children.forEach(children, (child) => {
      textContent += React.isValidElement(child) ? '[React Element]' : child;
    });

    const errors = SNOBBY_TESTS.filter(({ regexp }) => regexp.test(textContent));

    if (errors.length > 0) {
      const { names, suggestions } = getReportDetails(errors);

      const reportLines = [`[React Type Snob] Problems detected in text content of \`${getDisplayName(type, rawProps)}\`; ${names}.`];

      if (suggestions) {
        reportLines.push(suggestions);
      }

      if (reactElement._owner && reactElement._owner.getName) {
        reportLines.push(`Please check the render method of \`${reactElement._owner.getName()}\``);
      }

      reporter(reportLines.join(JOINERS.LINE));
    }

    return reactElement;
  };
}
