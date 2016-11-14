/* global describe, it, expect */
import verifyReact from './verify-react';

describe('verifyReact', () => {
  it('throws if not called with a valid React object', () => {
    expect(() => verifyReact())
      .toThrowError('[React Type Snob] `React` was not supplied!');

    expect(() => verifyReact({}))
      .toThrowError('[React Type Snob] `React.createElement` isn\'t a function - are you sure you called this with React?');

    expect(() => verifyReact({ Children: {}, createElement() {} }))
      .toThrowError('[React Type Snob] `React.isValidElement` isn\'t a function - are you sure you called this with React?');

    expect(() => verifyReact({ createElement() {}, isValidElement() {} }))
      .toThrowError('[React Type Snob] `React.Children` seems to be missing - are you sure you called this with React?');

    expect(() => verifyReact({ Children: {}, createElement() {}, isValidElement() {} })).not.toThrow();
  });
});
