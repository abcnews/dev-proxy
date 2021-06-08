// Checks if a proxy is requested for this project and loads it if required.
// The returned promise will only resolve if no proxy is loaded.
export const proxy = (project: string) =>
  new Promise<void>(resolve => {
    // If we're already in a dev environment, there's nothing to do here.
    if (process.env.NODE_ENV === 'development') return resolve();
    // Never run on live/production.
    if (location.host === 'www.abc.net.au') return resolve();

    let proxied = false;
    const src = localStorage.getItem('proxy_' + project);

    if (src) {
      const scr = document.createElement('script');
      scr.src = src;
      document.head.appendChild(scr);
      proxied = true;
      console.info('[dev-proxy] Loaded script: ' + src + ` (${project})`);
    }

    if (!proxied) resolve();
  });
