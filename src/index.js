const crypto = require('crypto');

function createDigest(src) {
    return crypto.createHash('sha1').update(src).digest('hex');
}


async function installScript(redis, digest, src) {
    const result = await redis.script('load', src);

    if (result !== digest) {
        throw new Error('digest mismatch');
    }
}


exports.createScript = function(redis, src) {
    const digest = createDigest(src);

    return async function runScript(numKeys, ...args) {
        let result, err;
        try {
            result = await redis.evalsha(digest, numKeys, ...args);
        } catch(e) {
            err = e;
        }

        if (err && err.message.includes('NOSCRIPT')) {
            await installScript(redis, digest, src);
            // try again
            result = await redis.evalsha(digest, numKeys, ...args);
        }

        return result;
    };
}
