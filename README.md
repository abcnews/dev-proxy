# Dev script proxy

Provides the capability to override an `news-projects` script with a different script with settings defined in `localStorage`.

The script being overridden needs to import and use this library:

```ts
import { proxy } from '@abcnews/dev-proxy';

function init() {
  // The code that kicks off your script goes here.
}

proxy('project-name').then(init);
```

To put the override into effect `localStorage` needs to contain an entry with key `proxy_<project-name>` that contains the URL of the script to override with.

## Bookmarklet

You can use <a href="javascript: (function() {
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
})();">this bookmarklet</a> to help setup the config.
