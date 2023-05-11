declare global {
  interface Window {
    __DEV_PROXY__: boolean;
  }
}

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
