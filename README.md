# Dough

[![JSR](https://jsr.io/badges/@debutter/dough)](https://jsr.io/@debutter/dough)
[![JSR Score](https://jsr.io/badges/@debutter/dough/score)](https://jsr.io/@debutter/dough)

A lightweight and modern DOM manipulation library designed to make building web
applications easier and more efficient

It provides a simple API with a similar syntax to jQuery allowing you to create,
manipulate, and interact with web pages with ease

This library is meant to be used in a browser environment, so for runtime
environments, you should be bundling this library into your application

## Installation

For Node.js:

```bash
npx jsr add @debutter/dough
```

For Deno:

```bash
deno add jsr:@debutter/dough
```

For Bun:

```bash
bunx jsr add @debutter/dough
```

For Browsers:

```javascript
import {} from "https://esm.sh/jsr/@debutter/dough@VERSION";
```

## Usage

```javascript
import { $ } from "@debutter/dough";

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
