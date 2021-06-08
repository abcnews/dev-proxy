import { proxy } from '../src';

describe('proxy', () => {
  it('returns a promise', () => {
    expect(proxy('abc')).toBeInstanceOf(Promise);
  });
});
