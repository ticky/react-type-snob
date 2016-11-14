/* global describe, beforeEach, it, expect, jest */
import typeSnob from './index';
import { Children, createElement as realCreateElement, isValidElement } from 'react';

const mockGetDisplayName = jest.fn(() => 'component-name-here');
jest.mock('./get-display-name', () => (...args) => mockGetDisplayName(...args));
const mockVerifyReact = jest.fn();
jest.mock('./verify-react', () => (...args) => mockVerifyReact(...args));
const mockInfractionReporter = jest.fn();
jest.mock('./console-reporter', () => (...args) => mockInfractionReporter(...args));

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
    expect(mockVerifyReact).toHaveBeenCalledWith(FakeReact);
    expect(FakeReact.createElement).not.toBe(createElement);
    expect(createElement).not.toHaveBeenCalled();
    expect(mockGetDisplayName).not.toHaveBeenCalled();
  });

  describe('typeSnobCreateElement', () => {
    describe('calls out to the real `createElement`', () => {
      it('with one argument child', () => {
        expect(() => {
          FakeReact.createElement('span', null, 'hello there!');
        }).not.toThrow();
        expect(createElement).toHaveBeenCalledTimes(1);
        expect(createElement).toHaveBeenCalledWith('span', null, 'hello there!');
        expect(mockGetDisplayName).not.toHaveBeenCalled();
      });

      it('with multiple argument children', () => {
        expect(() => {
          FakeReact.createElement('div', null, 'hello there ', 'you');
        }).not.toThrow();
        expect(createElement).toHaveBeenCalledTimes(1);
        expect(createElement).toHaveBeenCalledWith('div', null, 'hello there ', 'you');
        expect(mockGetDisplayName).not.toHaveBeenCalled();
      });

      it('with prop children', () => {
        expect(() => {
          FakeReact.createElement('div', { children: ['hello there ', 'you'] });
        }).not.toThrow();
        expect(createElement).toHaveBeenCalledTimes(1);
        expect(createElement).toHaveBeenCalledWith('div', { children: ['hello there ', 'you'] });
        expect(mockGetDisplayName).not.toHaveBeenCalled();
      });

      it('with no children', () => {
        expect(() => {
          FakeReact.createElement('div', null);
        }).not.toThrow();
        expect(createElement).toHaveBeenCalledTimes(1);
        expect(createElement).toHaveBeenCalledWith('div', null);
        expect(mockGetDisplayName).not.toHaveBeenCalled();
      });
    });

    describe('tests for', () => {
      it('ugly single quotes', () => {
        expect(() => {
          FakeReact.createElement('span', null, 'it\'s a shame you didn\'t use a “curly quote” here');
        }).not.toThrow();
        expect(mockInfractionReporter).toHaveBeenCalledTimes(1);
        expect(mockInfractionReporter.mock.calls).toMatchSnapshot();
      });

      it('ugly double quotes', () => {
        expect(() => {
          FakeReact.createElement('span', null, 'it’s a shame you didn’t use a "curly quote" here');
        }).not.toThrow();
        expect(mockInfractionReporter).toHaveBeenCalledTimes(1);
        expect(mockInfractionReporter.mock.calls).toMatchSnapshot();
      });

      it('unbalanced double quotes', () => {
        expect(() => {
          FakeReact.createElement('span', null, 'This quote" is lonely!');
        }).not.toThrow();
        expect(mockInfractionReporter).toHaveBeenCalledTimes(1);
        expect(mockInfractionReporter.mock.calls).toMatchSnapshot();
      });

      it('full-stops as ellipses', () => {
        expect(() => {
          FakeReact.createElement('span', null, 'this typography sucks...');
        }).not.toThrow();
        expect(mockInfractionReporter).toHaveBeenCalledTimes(1);
        expect(mockInfractionReporter.mock.calls).toMatchSnapshot();
      });

      it('full-stops as ellipses', () => {
        expect(() => {
          FakeReact.createElement('span', null, 'this typography *really* sucks ...');
          FakeReact.createElement('span', null, 'this typography *really* sucks, too …');
        }).not.toThrow();
        expect(mockInfractionReporter).toHaveBeenCalledTimes(2);
        expect(mockInfractionReporter.mock.calls).toMatchSnapshot();
      });
    });

    it('ignores React children', () => {
      expect(() => {
        FakeReact.createElement('span', null, realCreateElement('span', null, 'hi there'));
      }).not.toThrow();
      expect(mockInfractionReporter).not.toHaveBeenCalled();
    });

    it('ignores monospace-by-default elements', () => {
      expect(() => {
        FakeReact.createElement('code', null, 'export BASH_VAR="$(echo \'this is a gnarly string but if you\\\'ve put it in here you probably want it\')"');
      }).not.toThrow();
      expect(mockInfractionReporter).not.toHaveBeenCalled();
    });

    it('gracefully handles multiple suggestions', () => {
      expect(() => {
        FakeReact.createElement('span', null, 'you didn\'t make very good use of Unicode here ...');
      }).not.toThrow();
      expect(mockInfractionReporter).toHaveBeenCalledTimes(1);
      expect(mockInfractionReporter.mock.calls).toMatchSnapshot();
    });
  });
});