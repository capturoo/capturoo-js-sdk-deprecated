# Capturoo - Leads capture and management system

## Overview

[Capturoo](https://www.capturoo.com) provides the tools and infrastructure
you need to capture and manage leads. This package supports web (browser)
and server (Node.js) clients.

For more information, visit our online docs.

This SDK is intended for end-user client access from environments such as the
Web, mobile Web (e.g. React Native, Vue), Node.js desktop (e.g. Electron), or
IoT devices running Node.js.

## Installation

Install the Capturoo npm module:

```
$ npm init
$ npm install --save capturoo
```

### Include only the features you need

The full Capturoo JavaScript client includes support for Capturoo Authentication, the
Capturoo Manage SDK and Capturoo Capture. Including code via the above snippets
will pull in all of these features.

You can reduce the amount of code your app uses by just including the features
you need. The individually installable services are:

- `capturoo-app` - The core `capturoo` client (required).
- `capturoo-auth` - Capturoo Authentication (optional).
- `capturoo-capture` - Capturoo Lead Capture (optional).
- `capturoo-manage` - Capturoo Account, Project and Lead Manager (optional).

When using the firebase npm package, you can `require()` just the services that
you use:

```
var capturoo = require('capturoo/app');
require('capturoo/auth');
require('capturoo/capture');

var app = capturoo.initApp({ ... });
```

For ES7-style imports with the npm package, you canimport just the services
you use:

```
// This import loads the capturoo namespace
import capturoo from 'capturoo/app';

// These imports load individual services into the capturoo namespace.
import 'capturoo/auth';
import 'capturoo/capture';
```

