const tests = [
  {
    name: 'ugly quotes',
    regexp: /['"]/g,
  },
  {
    name: 'full-stops as ellipses',
    regexp: /\.{2,}/g,
  },
  {
    name: 'space preceding ellipses',
    regexp: /\s(?:\.{2,}|…)/g,
  },
];

export default function(React) {
  const createElement = React.createElement;

  React.createElement = function(type, rawProps, ...rawChildren) {
    let props = rawProps || {};
    let children;

    if (rawChildren.length === 0) {
      children = props.children || [];
    } else {
      children = rawChildren;
    }

    let reactElement = createElement.apply(this, [type, props].concat(rawChildren));

    let displayName = 'Unknown Element';

    if (type.displayName) {
      // If the component has a React displayName, let's use it
      displayName = type.displayName;
    } else if (typeof type === 'string') {
      // If it's a string, we'll use it straight up, then append some identifying stuff
      displayName = type;
      if (typeof props.id === 'string') {
        displayName = [displayName, props.id].join('#');
      } else if (typeof props.className === 'string') {
        displayName = [displayName].concat(props.className.split(' ')).join('.');
      }
    } else if (typeof type === 'function' && type.name) {
      // If it's a function, let's use the name if it's not blank!
      displayName = type.name;
    }

    let errors = [];

    React.Children.forEach(children, (child) => {
      if (typeof child === 'string') {
        tests.forEach(({name, regexp}) => {
          if (regexp.test(child) && errors.indexOf(name) === -1) {
            errors.push(name);
          }
        });
      }
    });

    if (errors.length > 0) {
      console.warn(`[React Type Snob] Problems detected in copy of \`${displayName}\`; ${errors.join(', ')}. Please check the render method of \`${reactElement._owner.getName()}\``);
    }

    return reactElement;
  };
}
