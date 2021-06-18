export enum RESOLUTION_REASONS {
  'DEV_ENV',
  'IN_PRODUCTION',
  'NON_ABC_SCRIPT',
  'BAD_SCRIPT_URL',
  'OTHER',
}

// Checks if a proxy is requested for this project and loads it if required.
// The returned promise will only resolve if no proxy is loaded.
export const proxy = (project: string) =>
  new Promise<number>((resolve, reject) => {
    // If we're already in a dev environment, there's nothing to do here.
    if (process.env.NODE_ENV === 'development')
      return resolve(RESOLUTION_REASONS.DEV_ENV);

    // Never run on live/production.
    if (
      document.location.host === 'www.abc.net.au' &&
      !document.location.pathname.match(/news-projects/)
    )
      return resolve(RESOLUTION_REASONS.IN_PRODUCTION);

    const src = localStorage.getItem('proxy_' + project);

    if (src) {
      let url: URL;
      try {
        url = new URL(src);
      } catch (e) {
        return resolve(RESOLUTION_REASONS.BAD_SCRIPT_URL);
      }

      if (url.hostname.match(/abc\.net\.au$/) === null) {
        return resolve(RESOLUTION_REASONS.NON_ABC_SCRIPT);
      }
      const scr = document.createElement('script');
      scr.src = src;
      document.head.appendChild(scr);
      const msg = '[dev-proxy] Loaded script: ' + src + ` (${project})`;
      console.info(msg);
      return reject(msg);
    }

    resolve(RESOLUTION_REASONS.OTHER);
  });
