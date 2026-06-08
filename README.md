# k6-jslib-totp

TOTP (Time-based One-Time Password) library for k6.

Docs: https://grafana.com/docs/k6/latest/javascript-api/jslib/totp

Download the latest release from https://jslib.k6.io/

## Example

```javascript
import { TOTP } from './src/index.js'

export default async function () {
    const totp = new TOTP('GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQ', 6)
    const code = await totp.gen()
    console.log('TOTP code: ' + code)

    const isValid = await totp.verify(code)
    console.log('Valid: ' + isValid)
}
```

## Tests

This library runs on the k6 JavaScript runtime, so no build step or Node.js
tooling is required. Run the tests directly with k6:

```bash
k6 run tests/totp.js
```

### Publish a new version

`src/index.js` is a self-contained ES module that k6 runs as-is, so there is no
build step.

1. Follow the jslib.k6.io [procedure](https://github.com/grafana/jslib.k6.io#how-to-add-a-new-version-of-a-and-existing-package) for creating a new version.
2. Copy `src/index.js` into the expected folder as `index.js` and open a new PR to [jslib.k6.io](https://github.com/grafana/jslib.k6.io).
