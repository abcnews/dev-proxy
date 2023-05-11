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

## Usage

As of version 1.2.0 pressing the key combination `Alt-M` when you're in an approprate dev or preview environment offers an easy way to set the appropriate localStorage values to proxy relevant scripts on the page.
