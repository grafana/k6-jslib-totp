# k6-jslib-totp

TOTP (Time-based One-Time Password) library for k6.

Docs: https://grafana.com/docs/k6/latest/javascript-api/jslib/totp

Download the latest release from https://jslib.k6.io/

## Example

```javascript
import { TOTP } from './src/totp.js'

export default async function () {
    const totp = new TOTP('GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQ', 6)
    const code = await totp.gen()
    console.log('TOTP code: ' + code)

    const isValid = await totp.verify(code)
    console.log('Valid: ' + isValid)
}
```

### Publish a new version

1. Build a new minified version using the webpack command `npm run webpack`.
2. Follow the jslib.k6.io [procedure](https://github.com/grafana/jslib.k6.io#how-to-add-a-new-version-of-a-and-existing-package) for creating a new version.
3. Copy the generated `./build/index.min.js` in the expected folder as `index.js` and open a new PR to [jslib.k6.io](https://github.com/grafana/jslib.k6.io).
