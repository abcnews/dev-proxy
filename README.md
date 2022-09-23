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

## How does it work?

The `proxy` function returns a promise that will either:
- **resolve successfully**, indicating that the script initialisation should go ahead (i.e. the `.then(init)` part of the above implementation example), or
- **be rejected**, indicating that an alternative script has been successfully identified and added to the document and the init function should not be run.

For the `proxy` function to successfully identify a script to run instead a few criteria need to be met:
- The script importing the `proxy` function should not have a `NODE_ENV` of 'development' (this prevents infinite loops when this `proxy` function is used on a dev server.
- The script should not be running on a production URL.
- `localStorage` must contain an entry identifying a suitable replacement hosted on an ABC url (including `localhost` aliases that include `abc.net.au`).

## Bookmarklet

You can use [this bookmarklet](<https://bookmarklet-topaz.vercel.app/?name=Proxy%20news-project&source=!function()%7Bconst%20t%3Dprompt(%22Project%22%2CArray.from(document.querySelectorAll(%22script%5Bsrc%5D%22)).map((t%3D%3E%7Bconst%20r%3Dt.getAttribute(%22src%22).match(%2Fnews-projects%5C%2F(%5B%5Cw-%5D%2B)%2F)%3Breturn!!r%26%26r%5B1%5D%7D)).filter((t%3D%3E!!t)).join(%22%2C%22))%3Bt%26%26t.split(%22%2C%22).forEach((t%3D%3E%7Bconst%20r%3Dprompt(%22Replacement%20for%20%22%2Bt)%3Br%26%26(localStorage%5B%22proxy_%22%2Bt%5D%3Dr)%7D))%7D()%3B>) to help setup the config.
