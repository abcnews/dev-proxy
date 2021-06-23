// Checks if a proxy is requested for this project and loads it if required.
// The returned promise will only resolve if no proxy is loaded.
export const proxy = (project: string) =>
  new Promise<void>((resolve, reject) => {
    // If we're already in a dev environment, there's nothing to do here.
    if (process.env.NODE_ENV === 'development') return resolve();
    // Never run on live/production.
    if (document.location.host === 'www.abc.net.au') return resolve();

    let src: string | null;

    try {
      src = localStorage.getItem('proxy_' + project);
    } catch (e) {
      src = null;
    }

    if (src) {
      const scr = document.createElement('script');
      scr.src = src;
      document.head.appendChild(scr);
      const msg = '[dev-proxy] Loaded script: ' + src + ` (${project})`;
      console.info(msg);
      return reject(msg);
    }

    resolve();
  });
