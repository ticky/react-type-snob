'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
var tests = [{
  name: 'ugly quotes',
  regexp: /['"]/g
}, {
  name: 'full-stops as ellipses',
  regexp: /\.{2,}/g
}, {
  name: 'space preceding ellipses',
  regexp: /\s(?:\.{2,}|…)/g
}];

exports['default'] = function (React) {
  var createElement = React.createElement;

  React.createElement = function (type, rawProps) {
    var props = rawProps || {};
    var children = undefined;

    for (var _len = arguments.length, rawChildren = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      rawChildren[_key - 2] = arguments[_key];
    }

    if (rawChildren.length === 0) {
      children = props.children || [];
    } else {
      children = rawChildren;
    }

    var reactElement = createElement.apply(this, [type, props].concat(rawChildren));

    var displayName = 'Unknown Element';

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

    var errors = [];

    React.Children.forEach(children, function (child) {
      if (typeof child === 'string') {
        tests.forEach(function (_ref) {
          var name = _ref.name;
          var regexp = _ref.regexp;

          if (regexp.test(child) && errors.indexOf(name) === -1) {
            errors.push(name);
          }
        });
      }
    });

    if (errors.length > 0) {
      console.warn('[React Type Snob] Problems detected in copy of `' + displayName + '`; ' + errors.join(', ') + '. Please check the render method of `' + reactElement._owner.getName() + '`');
    }

    return reactElement;
  };
};

module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,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LENBQUMsSUFBSSxDQUFDLDZDQUF5QyxZQUFZLENBQUMsTUFBTSxDQUFDLE9BQU8sRUFBRSxPQUFLLENBQUM7S0FDakw7O0FBRUQsV0FBTyxZQUFZLENBQUM7R0FDckIsQ0FBQztDQUNIIiwiZmlsZSI6ImluZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgdGVzdHMgPSBbXG4gIHtcbiAgICBuYW1lOiAndWdseSBxdW90ZXMnLFxuICAgIHJlZ2V4cDogL1snXCJdL2csXG4gIH0sXG4gIHtcbiAgICBuYW1lOiAnZnVsbC1zdG9wcyBhcyBlbGxpcHNlcycsXG4gICAgcmVnZXhwOiAvXFwuezIsfS9nLFxuICB9LFxuICB7XG4gICAgbmFtZTogJ3NwYWNlIHByZWNlZGluZyBlbGxpcHNlcycsXG4gICAgcmVnZXhwOiAvXFxzKD86XFwuezIsfXzigKYpL2csXG4gIH0sXG5dO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbihSZWFjdCkge1xuICBjb25zdCBjcmVhdGVFbGVtZW50ID0gUmVhY3QuY3JlYXRlRWxlbWVudDtcblxuICBSZWFjdC5jcmVhdGVFbGVtZW50ID0gZnVuY3Rpb24odHlwZSwgcmF3UHJvcHMsIC4uLnJhd0NoaWxkcmVuKSB7XG4gICAgbGV0IHByb3BzID0gcmF3UHJvcHMgfHwge307XG4gICAgbGV0IGNoaWxkcmVuO1xuXG4gICAgaWYgKHJhd0NoaWxkcmVuLmxlbmd0aCA9PT0gMCkge1xuICAgICAgY2hpbGRyZW4gPSBwcm9wcy5jaGlsZHJlbiB8fCBbXTtcbiAgICB9IGVsc2Uge1xuICAgICAgY2hpbGRyZW4gPSByYXdDaGlsZHJlbjtcbiAgICB9XG5cbiAgICBsZXQgcmVhY3RFbGVtZW50ID0gY3JlYXRlRWxlbWVudC5hcHBseSh0aGlzLCBbdHlwZSwgcHJvcHNdLmNvbmNhdChyYXdDaGlsZHJlbikpO1xuXG4gICAgbGV0IGRpc3BsYXlOYW1lID0gJ1Vua25vd24gRWxlbWVudCc7XG5cbiAgICBpZiAodHlwZS5kaXNwbGF5TmFtZSkge1xuICAgICAgLy8gSWYgdGhlIGNvbXBvbmVudCBoYXMgYSBSZWFjdCBkaXNwbGF5TmFtZSwgbGV0J3MgdXNlIGl0XG4gICAgICBkaXNwbGF5TmFtZSA9IHR5cGUuZGlzcGxheU5hbWU7XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgdHlwZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgIC8vIElmIGl0J3MgYSBzdHJpbmcsIHdlJ2xsIHVzZSBpdCBzdHJhaWdodCB1cCwgdGhlbiBhcHBlbmQgc29tZSBpZGVudGlmeWluZyBzdHVmZlxuICAgICAgZGlzcGxheU5hbWUgPSB0eXBlO1xuICAgICAgaWYgKHR5cGVvZiBwcm9wcy5pZCA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgZGlzcGxheU5hbWUgPSBbZGlzcGxheU5hbWUsIHByb3BzLmlkXS5qb2luKCcjJyk7XG4gICAgICB9IGVsc2UgaWYgKHR5cGVvZiBwcm9wcy5jbGFzc05hbWUgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIGRpc3BsYXlOYW1lID0gW2Rpc3BsYXlOYW1lXS5jb25jYXQocHJvcHMuY2xhc3NOYW1lLnNwbGl0KCcgJykpLmpvaW4oJy4nKTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKHR5cGVvZiB0eXBlID09PSAnZnVuY3Rpb24nICYmIHR5cGUubmFtZSkge1xuICAgICAgLy8gSWYgaXQncyBhIGZ1bmN0aW9uLCBsZXQncyB1c2UgdGhlIG5hbWUgaWYgaXQncyBub3QgYmxhbmshXG4gICAgICBkaXNwbGF5TmFtZSA9IHR5cGUubmFtZTtcbiAgICB9XG5cbiAgICBsZXQgZXJyb3JzID0gW107XG5cbiAgICBSZWFjdC5DaGlsZHJlbi5mb3JFYWNoKGNoaWxkcmVuLCAoY2hpbGQpID0+IHtcbiAgICAgIGlmICh0eXBlb2YgY2hpbGQgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIHRlc3RzLmZvckVhY2goKHtuYW1lLCByZWdleHB9KSA9PiB7XG4gICAgICAgICAgaWYgKHJlZ2V4cC50ZXN0KGNoaWxkKSAmJiBlcnJvcnMuaW5kZXhPZihuYW1lKSA9PT0gLTEpIHtcbiAgICAgICAgICAgIGVycm9ycy5wdXNoKG5hbWUpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBpZiAoZXJyb3JzLmxlbmd0aCA+IDApIHtcbiAgICAgIGNvbnNvbGUud2FybihgW1JlYWN0IFR5cGUgU25vYl0gUHJvYmxlbXMgZGV0ZWN0ZWQgaW4gY29weSBvZiBcXGAke2Rpc3BsYXlOYW1lfVxcYDsgJHtlcnJvcnMuam9pbignLCAnKX0uIFBsZWFzZSBjaGVjayB0aGUgcmVuZGVyIG1ldGhvZCBvZiBcXGAke3JlYWN0RWxlbWVudC5fb3duZXIuZ2V0TmFtZSgpfVxcYGApO1xuICAgIH1cblxuICAgIHJldHVybiByZWFjdEVsZW1lbnQ7XG4gIH07XG59XG4iXX0=