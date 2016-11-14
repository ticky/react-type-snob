import DocChomp from 'doc-chomp';

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

const CONTEXT_LENGTH = 20;

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

        if (contexts.length === 0) {
          return;
        }

        return Object.assign({ contexts }, test);
      })
      .filter((returnedThing) => returnedThing);

    if (errors.length > 0) {
      reporter(DocChomp`
        [React Type Snob] Problems detected in text content of \`${getDisplayName(type, rawProps)}\`${(reactElement._owner && reactElement._owner.getName) ? `. Please check the render method of \`${reactElement._owner.getName()}\`` : ''};
        ${errors.map(({ name, suggestion, contexts }) => {
          let report = `* Found ${name};`;

          contexts.forEach((context) => report += `\n   * \`${context}\``);

          if (suggestion) {
            report += `\n  Suggested replacements: ${suggestion}`;
          }

          return report;
        }).join('\n\n')
        }`
      );
    }

    return reactElement;
  };
}
