/* global describe, beforeEach, it, expect, jest */
import typeSnob from './index';
import { Children } from 'react';

const fakeGetDisplayName = jest.fn(() => 'component-name-here');
jest.mock('./get-display-name', () => (...args) => fakeGetDisplayName(...args));
const infractionReporter = jest.fn();
jest.mock('./console-reporter', () => (...args) => infractionReporter(...args));

describe('Type Snob', () => {
  const createElement = jest.fn(() => ({
    _owner: {
      getName() {
        return 'ParentItem';
      }
    }
  }));
  const FakeReact = { Children, createElement };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('throws if not called with a valid React object', () => {
    expect(() => typeSnob())
      .toThrowError('[React Type Snob] `React` was not supplied!');

    expect(() => typeSnob({}))
      .toThrowError('[React Type Snob] `React.createElement` isn\'t a function - are you sure you called this with React?');

    expect(() => typeSnob({ createElement() {} }))
      .toThrowError('[React Type Snob] `React.Children` seems to be missing - are you sure you called this with React?');

    expect(() => typeSnob({ Children, createElement() {} })).not.toThrow();
  });

  it('binds to supplied React object, and doesn\'t call it until called', () => {
    typeSnob(FakeReact);
    expect(FakeReact.createElement).not.toBe(createElement);
    expect(createElement).not.toHaveBeenCalled();
    expect(fakeGetDisplayName).not.toHaveBeenCalled();
  });

  describe('typeSnobCreateElement', () => {
    describe('calls out to the real `createElement`', () => {
      it('with one argument child', () => {
        expect(() => {
          FakeReact.createElement('span', null, 'hello there!');
        }).not.toThrow();
        expect(createElement).toHaveBeenCalledTimes(1);
        expect(createElement).toHaveBeenCalledWith('span', null, 'hello there!');
        expect(fakeGetDisplayName).toHaveBeenCalledTimes(1);
        expect(fakeGetDisplayName).toHaveBeenCalledWith('span', null);
      });

      it('with multiple argument children', () => {
        expect(() => {
          FakeReact.createElement('div', null, 'hello there ', 'you');
        }).not.toThrow();
        expect(createElement).toHaveBeenCalledTimes(1);
        expect(createElement).toHaveBeenCalledWith('div', null, 'hello there ', 'you');
        expect(fakeGetDisplayName).toHaveBeenCalledTimes(1);
        expect(fakeGetDisplayName).toHaveBeenCalledWith('div', null);
      });

      it('with prop children', () => {
        expect(() => {
          FakeReact.createElement('div', { children: ['hello there ', 'you'] });
        }).not.toThrow();
        expect(createElement).toHaveBeenCalledTimes(1);
        expect(createElement).toHaveBeenCalledWith('div', { children: ['hello there ', 'you'] });
        expect(fakeGetDisplayName).toHaveBeenCalledTimes(1);
        expect(fakeGetDisplayName).toHaveBeenCalledWith('div', { children: ['hello there ', 'you'] });
      });

      it('with no children', () => {
        expect(() => {
          FakeReact.createElement('div', null);
        }).not.toThrow();
        expect(createElement).toHaveBeenCalledTimes(1);
        expect(createElement).toHaveBeenCalledWith('div', null);
        expect(fakeGetDisplayName).toHaveBeenCalledTimes(1);
        expect(fakeGetDisplayName).toHaveBeenCalledWith('div', null);
      });
    });

    describe('tests for', () => {
      it('ugly quotes', () => {
        expect(() => {
          FakeReact.createElement('span', null, 'it\'s a shame you didn\'t use a "curly quote" here');
        }).not.toThrow();
        expect(infractionReporter).toHaveBeenCalledTimes(1);
        expect(infractionReporter.mock.calls).toMatchSnapshot();
      });

      it('full-stops as ellipses', () => {
        expect(() => {
          FakeReact.createElement('span', null, 'this typography sucks...');
        }).not.toThrow();
        expect(infractionReporter).toHaveBeenCalledTimes(1);
        expect(infractionReporter.mock.calls).toMatchSnapshot();
      });

      it('full-stops as ellipses', () => {
        expect(() => {
          FakeReact.createElement('span', null, 'this typography *really* sucks ...');
          FakeReact.createElement('span', null, 'this typography *really* sucks, too …');
        }).not.toThrow();
        expect(infractionReporter).toHaveBeenCalledTimes(2);
        expect(infractionReporter.mock.calls).toMatchSnapshot();
      });
    });

    it('ignores non-string children', () => {
      expect(() => {
        FakeReact.createElement('span', null, 2);
      }).not.toThrow();
      expect(infractionReporter).not.toHaveBeenCalled();
    });
  });
});