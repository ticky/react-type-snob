const REACT_FUNCTIONS = [
  'createElement',
  'isValidElement'
];

export default function verifyReact(React) {
  if (!React) {
    throw new Error(`[React Type Snob] \`React\` was not supplied!`);
  }

  REACT_FUNCTIONS.forEach((functionName) => {
    if (!React[functionName] || typeof React[functionName] !== 'function') {
      throw new Error(`[React Type Snob] \`React.${functionName}\` isn't a function - are you sure you called this with React?`);
    }
  });

  if (!React.Children) {
    throw new Error(`[React Type Snob] \`React.Children\` seems to be missing - are you sure you called this with React?`);
  }
}
