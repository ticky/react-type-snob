import DocChomp from 'doc-chomp';

import getDisplayName from './get-display-name';
import consoleReporter from './console-reporter';
import verifyReact from './verify-react';

const TEST_COUNTS = {
  EVEN: 'even',
  ODD: 'odd'
};

const SNOBBY_TESTS = [
  {
    name: 'unbalanced double quotes',
    regexp: /["“”]/g,
    count: TEST_COUNTS.EVEN
  },
  {
    name: 'unbalanced single quotes',
    regexp: /(^|[^\w])['‘’]|[^s]['‘’]([^\w]|$)/gi,
    count: TEST_COUNTS.EVEN
  },
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

const IGNORED_DOM_ELEMENTS = [
  'code',
  'kbd',
  'pre',
  'samp'
];

const CONTEXT_LENGTH = 20;

const testLineGenerator = ({ name, suggestion, contexts }) => {
  let report = `* Found ${name};`;

  contexts.forEach((context) => report += `\n   * \`${context}\``);

  if (suggestion) {
    report += `\n  Suggested replacements: ${suggestion}`;
  }

  return report;
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

    if (typeof type === 'string' && IGNORED_DOM_ELEMENTS.indexOf(type) === -1) {
      let textContent = '';

      React.Children.forEach(children, (child) => {
        textContent += React.isValidElement(child) ? '[React Element]' : child;
      });

      const errors = SNOBBY_TESTS
        .map((test) => {
          const contexts = [];

          textContent.replace(test.regexp, (match, ...args) => {
            const fullText = args.pop();

            const startOffset = args.pop();
            const endOffset = startOffset + match.length;

            const contextStartOffset = Math.max(startOffset - CONTEXT_LENGTH, 0);
            const contextEndOffset = Math.min(endOffset + CONTEXT_LENGTH, fullText.length);

            contexts.push(fullText.slice(contextStartOffset, contextEndOffset).replace(/\n/g, ' '));

            // *do not* replace, as we may need to do further processing
            return match;
          });

          if (test.count) {
            if (typeof test.count === 'string') {
              if (test.count === TEST_COUNTS.EVEN && contexts.length % 2 === 0) {
                return;
              } else if (test.count === TEST_COUNTS.ODD && contexts.length % 2 === 1) {
                return;
              }
            }
          }

          if (contexts.length === 0) {
            return;
          }

          return Object.assign({ contexts }, test);
        })
        .filter((returnedThing) => returnedThing);

      if (errors.length > 0) {
        reporter(DocChomp`
          [React Type Snob] Problems detected in text content of \`${getDisplayName(type, rawProps)}\`${(reactElement._owner && reactElement._owner.getName) ? `. Please check the render method of \`${reactElement._owner.getName()}\`` : ''};
          ${errors.map(testLineGenerator).join('\n\n')}`
        );
      }
    }

    return reactElement;
  };
}
