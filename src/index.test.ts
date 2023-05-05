import { proxy, RESOLUTION_REASONS } from './index';

const PROJECT = 'abc';

beforeEach(() => {
  process.env.NODE_ENV = 'test';
  localStorage.clear();
});

describe('proxy', () => {
  it('returns a promise', () => {
    expect(proxy(PROJECT)).toBeInstanceOf(Promise);
  });

  describe('resolves', () => {
    it('in dev environment', () => {
      expect.assertions(1);
      process.env.NODE_ENV = 'development';
      return expect(proxy(PROJECT)).resolves.toEqual(
        RESOLUTION_REASONS.DEV_ENV
      );
    });

    // TODO Figure out how to actually test code that reads document.location
    // it('in production', () => {
    //   expect.assertions(1);
    //   return expect(proxy(PROJECT)).resolves.toEqual(
    //     RESOLUTION_REASONS.IN_PRODUCTION
    //   );
    // });

    it('with a bad script URL', () => {
      expect.assertions(1);
      localStorage.setItem('proxy_' + PROJECT, 'not a url');
      return expect(proxy(PROJECT)).resolves.toEqual(
        RESOLUTION_REASONS.BAD_SCRIPT_URL
      );
    });

    it('with a non-ABC script URL', () => {
      expect.assertions(1);
      localStorage.setItem(
        'proxy_' + PROJECT,
        'https://www.abb.net.au/script.js'
      );
      return expect(proxy(PROJECT)).resolves.toEqual(
        RESOLUTION_REASONS.NON_ABC_SCRIPT
      );
    });
  });

  describe('rejects', () => {
    it('with a valid proxy config in localStorage', () => {
      expect.assertions(1);
      const src = 'https://www.abc.net.au/res/sites/news-projects/blurgh.js';
      localStorage.setItem('proxy_' + PROJECT, src);
      return expect(proxy(PROJECT)).rejects.toEqual(
        '[dev-proxy] Loaded script: ' + src + ` (${PROJECT})`
      );
    });
  });
});
