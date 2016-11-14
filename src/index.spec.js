/* global describe, beforeEach, it, expect, jest */
import typeSnob from './index';
import { Children, createElement as realCreateElement, isValidElement } from 'react';

const fakeGetDisplayName = jest.fn(() => 'component-name-here');
jest.mock('./get-display-name', () => (...args) => fakeGetDisplayName(...args));
const fakeVerifyReact = jest.fn();
jest.mock('./verify-react', () => (...args) => fakeVerifyReact(...args));
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
  const FakeReact = { Children, createElement, isValidElement };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('binds to supplied React object, and doesn\'t call it until called', () => {
    typeSnob(FakeReact);
    expect(fakeVerifyReact).toHaveBeenCalledWith(FakeReact);
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
        expect(fakeGetDisplayName).not.toHaveBeenCalled();
      });

      it('with multiple argument children', () => {
        expect(() => {
          FakeReact.createElement('div', null, 'hello there ', 'you');
        }).not.toThrow();
        expect(createElement).toHaveBeenCalledTimes(1);
        expect(createElement).toHaveBeenCalledWith('div', null, 'hello there ', 'you');
        expect(fakeGetDisplayName).not.toHaveBeenCalled();
      });

      it('with prop children', () => {
        expect(() => {
          FakeReact.createElement('div', { children: ['hello there ', 'you'] });
        }).not.toThrow();
        expect(createElement).toHaveBeenCalledTimes(1);
        expect(createElement).toHaveBeenCalledWith('div', { children: ['hello there ', 'you'] });
        expect(fakeGetDisplayName).not.toHaveBeenCalled();
      });

      it('with no children', () => {
        expect(() => {
          FakeReact.createElement('div', null);
        }).not.toThrow();
        expect(createElement).toHaveBeenCalledTimes(1);
        expect(createElement).toHaveBeenCalledWith('div', null);
        expect(fakeGetDisplayName).not.toHaveBeenCalled();
      });
    });

    describe('tests for', () => {
      it('ugly single quotes', () => {
        expect(() => {
          FakeReact.createElement('span', null, 'it\'s a shame you didn\'t use a “curly quote” here');
        }).not.toThrow();
        expect(infractionReporter).toHaveBeenCalledTimes(1);
        expect(infractionReporter.mock.calls).toMatchSnapshot();
      });

      it('ugly double quotes', () => {
        expect(() => {
          FakeReact.createElement('span', null, 'it’s a shame you didn’t use a "curly quote" here');
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

    it('ignores React children', () => {
      expect(() => {
        FakeReact.createElement('span', null, realCreateElement('span', null, 'hi there'));
      }).not.toThrow();
      expect(infractionReporter).not.toHaveBeenCalled();
    });

    it('gracefully handles multiple suggestions', () => {
      expect(() => {
        FakeReact.createElement('span', null, 'you didn\'t make very good use of Unicode here ...');
      }).not.toThrow();
      expect(infractionReporter).toHaveBeenCalledTimes(1);
      expect(infractionReporter.mock.calls).toMatchSnapshot();
    });
  });
});