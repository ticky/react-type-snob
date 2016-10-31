/* global describe, it, expect */
import getDisplayName from './get-display-name';

describe('getDisplayName', () => {
  it('returns expected value for a type with an implicit function name', () => {
    expect(getDisplayName(function ExpectedValue() {})).toMatchSnapshot();
  });

  it('returns expected value for a type with a displayName', () => {
    function component() {}
    component.displayName = 'ExpectedValue';

    expect(getDisplayName(component)).toMatchSnapshot();
  });

  it('returns expected value for a string type with no id or className', () => {
    expect(getDisplayName('ExpectedValue')).toMatchSnapshot();
  });

  it('returns expected value for a string type with an id', () => {
    expect(getDisplayName('div', { id: 'expectedId' })).toMatchSnapshot();
    expect(getDisplayName('div', { id: 'expectedId', className: 'notExpected' })).toMatchSnapshot();
  });

  it('returns expected value for a string type with class names', () => {
    expect(getDisplayName('div', { className: 'expectedClassName anotherExpectedClassName' })).toMatchSnapshot();
  });

  it('falls back when an unidentified type is supplied', () => {
    expect(getDisplayName({})).toMatchSnapshot();
  });
});