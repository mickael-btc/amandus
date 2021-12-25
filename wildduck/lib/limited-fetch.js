'use strict';

const Transform = require('stream').Transform;

class LimitedFetch extends Transform {
    constructor(options) {
        super();
        this.options = options || {};
        this.bytes = 0;
    }

    _transform(chunk, encoding, done) {
        this.bytes += chunk.length;
        this.push(chunk);
        done();
    }

    _flush(done) {
        if (!this.options.maxBytes) {
            return done();
        }
        this.options.ttlcounter(this.options.key, this.bytes, this.options.maxBytes, false, () => done());
    }
}

module.exports = LimitedFetch;
