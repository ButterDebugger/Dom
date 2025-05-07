# Dom

[![JSR](https://jsr.io/badges/@debutter/dom)](https://jsr.io/@debutter/dom)
[![JSR Score](https://jsr.io/badges/@debutter/dom/score)](https://jsr.io/@debutter/dom)

A lightweight and modern DOM manipulation library designed to make building web
applications easier and more efficient

It provides a simple API with a similar syntax to jQuery allowing you to create,
manipulate, and interact with web pages with ease

This library is meant to be used in a browser environment, so for runtime
environments, you should be bundling this library into your application

## Installation

For Node.js:

```bash
npx jsr add @debutter/dom
```

For Deno:

```bash
deno add jsr:@debutter/dom
```

For Bun:

```bash
bunx jsr add @debutter/dom
```

For Browsers:

```javascript
import {} from "https://esm.sh/jsr/@debutter/dom@VERSION";
```

## Usage

```javascript
import { $ } from "@debutter/dom";

const body = $("body");

body.append("<p>hello world</p>");

$("<button>Click me</button>")
    .on("click", () => {
        alert("clicked");
    })
    .appendTo(body);
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
