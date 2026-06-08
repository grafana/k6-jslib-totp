function TOTP(key, digits = 6) {
    this.key = key
    this.digits = digits
}

TOTP.prototype = {
    gen: async function (timeStep = 30, bias = 0) {
        const _hex = this._base32tohex(this.key)
        const _hexi = BigInt('0x' + _hex)
        const _keybytes = this._bigIntToByteArray(_hexi)
        const _time = Math.floor((Date.now() / 1000 - bias) / timeStep)
        const _timeFactor = this._int32ToByteArray(_time)
        const key = await crypto.subtle.importKey(
            'raw',
            _keybytes,
            { name: 'HMAC', hash: { name: 'SHA-1' } },
            false,
            ['sign']
        )
        const signature = await crypto.subtle.sign('HMAC', key, _timeFactor)
        return this._truncate(new Uint8Array(signature))
    },

    _int32ToByteArray: function (time) {
        const _buf = new ArrayBuffer(8)
        const _view = new DataView(_buf)
        _view.setUint32(4, time, false)
        return _buf
    },

    _bigIntToByteArray: function (bigNumber) {
        let bytes = []
        while (bigNumber > 0) {
            bytes.push(Number(bigNumber % BigInt(256)))
            bigNumber = bigNumber / BigInt(256)
        }
        let result = Uint8Array.from(bytes)
        return result.reverse()
    },

    _truncate: function (hmac) {
        const offset = hmac[hmac.length - 1] & 0xf
        const bin_code =
            ((hmac[offset + 0] & 0x7f) << 24) |
            ((hmac[offset + 1] & 0xff) << 16) |
            ((hmac[offset + 2] & 0xff) << 8) |
            (hmac[offset + 3] & 0xff)
        let code = (bin_code % Math.pow(10, this.digits)).toString().padStart(this.digits, '0')
        return code
    },

    verify: async function (code, timeStep = 30) {
        return code === (await this.gen(timeStep))
    },

    _base32tohex: function (base32) {
        const base32chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'
        let bits = ''
        let hex = ''
        for (let i = 0; i < base32.length; i++) {
            const val = base32chars.indexOf(base32.charAt(i).toUpperCase())
            bits += val.toString(2).padStart(5, '0')
        }
        for (let i = 0; i + 4 <= bits.length; i += 4) {
            const chunk = bits.substr(i, 4)
            hex += parseInt(chunk, 2).toString(16)
        }
        return hex
    },
}

export { TOTP }
