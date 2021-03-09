warlock-script
=======

Easily run redis scripts from Node.

# Requirements

* [ioredis](https://github.com/luin/ioredis)
* Redis `v2.6` or above
* Node 10+

# Install

    npm install warlock-script

# Usage

```javascript
const Redis = require('ioredis');
const redis = new Redis();
const { createScript } = require('warlock-script');

const incrbyExSrc = `
  local current
  current = redis.call('incrby',KEYS[1],ARGV[1])
  redis.call('expire',KEYS[1],ARGV[2]);
  return current
`;

// give it a redis client and script source
const incrbyEx = createScript(redis, incrbyExSrc);
// you get back a function that runs your script with given args
// redis requires you to tell it how many keys to expect
const numKeys = 1;
const key = 'test';
const incr = 1;
const ex = 10;
const result = await incrbyEx(numKeys, key, incr, ex);
// Should print 1
console.log(result);
```

# Test
```bash
# install docker & docker-compose for local redis setup
npm test
```
