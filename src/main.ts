import { RESOLUTION_REASONS, domainMatcher } from '.';

declare global {
  interface Window {
    __DEV_PROXY__: boolean;
  }
}

export const init = (project: string): Promise<RESOLUTION_REASONS> => {
  return new Promise((resolve, reject) => {
    // If we're already in a dev environment, there's nothing to do here.
    if (process.env.NODE_ENV === 'development') {
      return resolve(RESOLUTION_REASONS.DEV_ENV);
    }

    // Okay, we can run and see if there is a script to proxy

    let src: string | null;

    // Even though local storage has wide support, some in-app browsers or web
    // views (including our own app may not have it) so we wrap it in a try/catch
    try {
      src = localStorage.getItem('proxy_' + project);
    } catch (e) {
      src = null;
    }

    if (src === null || src.trim() === '') {
      return resolve(RESOLUTION_REASONS.NO_PROXY_SCRIPT);
    }

    let url: URL;
    try {
      url = new URL(src);
    } catch (e) {
      return resolve(RESOLUTION_REASONS.BAD_SCRIPT_URL);
    }

    // Don't allow proxying of scripts that aren't loaded from the ABC domain.
    if (url.hostname.match(domainMatcher) === null) {
      return resolve(RESOLUTION_REASONS.NON_ABC_SCRIPT);
    }

    const scr = document.createElement('script');
    scr.src = src;
    document.head.appendChild(scr);
    const msg = '[dev-proxy] Loaded script: ' + src + ` (${project})`;
    console.info(msg);

    // A rejection means the proxy script has been successfully loaded
    // and consuming scripts should not continue any further.
    return reject(msg);
  });
};

const listener = (event: KeyboardEvent) => {
  if (event.altKey && event.code === 'KeyM') {
    let modified = false;
    const project = prompt(
      'Project',
      Array.from(document.querySelectorAll('script[src]'))
        .map((script) => {
          const m = script
            .getAttribute('src')
            ?.match(/news-projects\/([\w-]+)/);
          return m ? m[1] : false;
        })
        .filter((d) => !!d)
        .join(',')
    );
    if (!project) return;
    project.split(',').forEach((project) => {
      const replace = prompt(
        'Replacement for ' + project,
        localStorage['proxy_' + project]
      );
      if (replace === localStorage['proxy_' + project]) return;
      modified = true;
      localStorage['proxy_' + project] = replace;
    });
    if (modified) document.location.reload();
  }
};

export const manager = () => {
  if (window.__DEV_PROXY__) return;
  document.addEventListener('keydown', listener);
  window.__DEV_PROXY__ = true;
};
