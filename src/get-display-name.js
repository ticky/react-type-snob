export default function getDisplayName(type, props) {
  let displayName = 'Unknown Element';

  if (type.displayName) {
    // if the component has a React `displayName`, let's use it
    displayName = type.displayName;
  } else if (typeof type === 'string') {
    // if it's a string, we'll use it straight up, then append some identifying stuff
    displayName = type;
    if (props) {
      if (typeof props.id === 'string') {
        displayName = `${displayName}#${props.id}`;
      } else if (typeof props.className === 'string') {
        displayName = [displayName, ...props.className.split(' ')].join('.');
      }
    }
  } else if (typeof type === 'function' && type.name) {
    // if it's a function, let's use the name if it's not blank!
    displayName = type.name;
  }

  return displayName;
}
