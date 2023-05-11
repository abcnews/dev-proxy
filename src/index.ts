export enum RESOLUTION_REASONS {
  'DEV_ENV',
  'IN_PRODUCTION',
  'NON_ABC_SCRIPT',
  'BAD_SCRIPT_URL',
  'OTHER',
  'NO_PROXY_SCRIPT',
}

export const domainMatcher = /^(www|newsapp)\.abc\.net\.au$/;

// Checks if a proxy is requested for this project and loads it if required.
// The returned promise will only resolve if no proxy is loaded.
export const proxy = (project: string) =>
  new Promise<number>((resolve) => {
    // Never run on live/production.
    if (
      document.location.host.match(domainMatcher) &&
      !document.location.pathname.match(/news-projects/)
    ) {
      return resolve(RESOLUTION_REASONS.IN_PRODUCTION);
    }

    // Load in a cheaky management keyboard shortcut
    import('./main').then(({ manager, init }) => {
      manager();
      resolve(init(project));
    });
  });
