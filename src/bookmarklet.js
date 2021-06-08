(function() {
  const project = prompt(
    'Project',
    Array.from(document.querySelectorAll('script[src]'))
      .map(x => {
        const m = x.getAttribute('src').match(/news-projects\/([\w-]+)/);
        return m ? m[1] : false;
      })
      .filter(d => !!d)
      .join(',')
  );
  if (!project) return;
  project.split(',').forEach(project => {
    const replace = prompt('Replacement for ' + project);
    if (!replace) return;
    localStorage['proxy_' + project] = replace;
  });
})();
