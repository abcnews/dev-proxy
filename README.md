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

You can use [this bookmarklet](<https://bookmarklet-topaz.vercel.app/?name=Proxy&source=const%20project%20=%20prompt(%20%20%20%20%27Project%27,%20%20%20%20Array.from(document.querySelectorAll(%27script%5Bsrc%5D%27))%20%20%20%20%20%20.map(x%20=%3E%20%7B%20%20%20%20%20%20%20%20const%20m%20=%20x.getAttribute(%27src%27).match(/news-projects%5C/(%5B%5Cw-%5D+)/);%20%20%20%20%20%20%20%20return%20m%20?%20m%5B1%5D%20:%20false;%20%20%20%20%20%20%7D)%20%20%20%20%20%20.filter(d%20=%3E%20!!d)%20%20%20%20%20%20.join(%27,%27)%20%20);%20%20if%20(!project)%20return;%20%20project.split(%27,%27).forEach(project%20=%3E%20%7B%20%20%20%20const%20replace%20=%20prompt(%27Replacement%20for%20%27%20+%20project);%20%20%20%20if%20(!replace)%20return;%20%20%20%20localStorage%5B%27proxy_%27%20+%20project%5D%20=%20replace;%20%20%7D);>) to help setup the config.
