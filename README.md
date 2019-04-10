<p align="center">
  <img alt="served-hot" src="https://image.flaticon.com/icons/svg/924/924514.svg" width="100">
</p>

<h3 align="center">
  served hot
</h3>

<p align="center">
  Server-side hot-reloading for Express
</p>

<p align="center">
  <img src="https://img.shields.io/github/release/justinsisley/served-hot.svg?style=for-the-badge" alt="GitHub release" /> <img src="https://img.shields.io/github/license/justinsisley/served-hot.svg?style=for-the-badge" alt="license" />
</p>

---

__served-hot__ brings the hot-reloading you know and love from the client-side to Express servers. It can greatly improve your development experience across the entire stack.

__It's not a pure drop-in solution__ (yet), and your mileage may vary depending on how you've set up your Express server. Nevertheless, this documentation will walk you through the setup and configuration it was built to function with.

Additionally, the code behind __served-hot__ is quite simple, and I encourage you to dig in and steal it as necessary in order to suit your specific needs.

---

# Table of Contents

- [Features](#features)
- [Documentation](#documentation)
  - [Install](#install)
  - [Configuration](#configuration)
  - [Development](#development)
- [(in)Frequently Asked Questions](#faq)
- [Releases](https://github.com/justinsisley/served-hot/releases)
- [Credits](#credits)

# Features

- __Vastly improves your developer experience__
- __Only watches your server-side files__ _(via Chokidar)_

# Documentation

## Install

```bash
npm install served-hot
```

## Configuration

__served-hot__ expects that your server-side routing, or API, is served under a root path, such as `/api`.

It also expects your server to have a root router file, which is a module that exports an Express router that all of your routes are defined on.

For example, let's say you have a server entry point at `src/index.js` that starts an Express server:

```javascript
const express = require('express');
const api = require('./api');

const app = express();

// The "/api" path is defined as the root path for all server-side routing
app.use('/api', api);

app.listen(8080);
```

And you also have a file at `src/api.js` that exports your root router:

```javascript
const Router = require('express').Router;
const router = Router();

router.get('/users', (req, res) => {
  res.json(['list', 'of', 'users']);
});

router.post('/hello', (req, res) => {
  res.json({ data: 'world' });
});

module.exports = router;
```

With the above configuration, your Express server configuration is kept separate from your route definitions, which is generally considered a good practice even outside of using __served-hot__.

Using the above configuration, to enable hot-reloading for all of your Express routes, modify your `src/index.js` to use __served-hot__:

```javascript
const express = require('express');
const hot = require('served-hot');

const app = express();

hot(app, {
  // Tell served-hot that "/api" is your root path
  rootPath: '/api',
  // Tell served-hot where your root router file is
  routerPath: './api',
  // Tell served-hot which directory to watch for file changes
  watchPath: './',
});

app.listen(8080);
```

Alternatively, you'll probably want to do this based on the environment, for example:

```javascript
const express = require('express');
const hot = require('served-hot');
const api = require('./api');

const app = express();
const env = process.env.NODE_ENV;

if (env === 'production') {
  app.use('/api', api);
} else {
  hot(app, {
    rootPath: '/api',
    routerPath: './api',
    watchPath: './',
  });
}

app.listen(8080);
```

# FAQ

Coming soon...

# Credits
<div>Icon made by <a href="https://www.flaticon.com/authors/freepik" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a> is licensed by <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0" target="_blank">CC 3.0 BY</a></div>