# thmb [![Build Status](https://secure.travis-ci.org/rvagg/node-thmb.png)](http://travis-ci.org/rvagg/node-thmb)

**Make thumbnails of images**

Depends on [node-canvas](https://github.com/LearnBoost/node-canvas) which has special [build instructions](https://github.com/LearnBoost/node-canvas/wiki/_pages) as it requires **Cairo** to be installed on your system.

## What?

**thmb** takes a source image path and a destination image path and the dimensions of your desired thumbnail.

The created thumbnail image will be a resized and cropped version of the original. If the destination image isn't the same aspect ratio of the original then it'll resize it to fit within the space and crop the remainder. e.g. if your source aspect ratio is wider than your destination aspect ratio then it'll first be resized to the desired height and then the overhanging width will be cropped.

The thumbnail will **not be created if** file destination file already exists and has a newer *mtime* than the source file. If you are planning on using this utility for different size thumbnails then you are advised to use the size in your destination path somewhere as **thmb** won't check the destination file size if it exists, only the last-modified-timestamp of the file.

## Related

**thmb** builds on:

 * **[sz](https://github.com/rvagg/node-sz)** gets the *sizes* of images
 * **[rsz](https://github.com/rvagg/node-rsz)** *resizes* images
 * **[crp](https://github.com/rvagg/node-crp)** *crops* images

## API

<b>thmb(src, dst, options, callback)</b>

Where <b><code>src</code></b> is the source file path, <b><code>dst</code></b> is the destination file path and <b><code>options</code></b> contains your thumbnailing options.

The <b><code>callback</code></b> function will be called with an error object if an error has occurred (such as the file not existing), the second argument in the case of a successful thumbnail creation, or an existing thumbnail that didn't need to be updated will be the *dimensions of the source image* (this happens to be what I needed on the callback but you're welcome to suggest alternative callback data).

### Options

 * <b><code>'height'</code></b> (`Number`, required) the height of the cropped image
 * <b><code>'width'</code></b> (`Number`, required) the width of the cropped image
 * <b><code>'type'</code></b> (`String`, optional, default: `'png'`) set to `'jpeg'` to return a **JPEG** `Buffer` or write a **JPEG** file.
 * <b><code>'quality'</code></b> (`Number`, optional) used when creating a **JPEG**, a number between 1 (lowest quality) and 100 (highest quality).

By default, **thmb** will write a **PNG** file. You can change this by specifying the `'type'` on your `options` object. You can also adjust the JPEG quality with a `'quality'` property.

## Example

```js
var thmb = require('thmb')

thmb(
    '/path/to/nyancat.gif'
  , '/path/to/nyancat_50x50.jpg'
  , { width: 50, height: 50, type: 'jpeg', quality: 40 }
  , function (err, srcSize) {
      // srcSize might be something like `{ width: 400, height: 250 }`
    }
)
```

## Want more options?

Send a pull request or file an issue & I'll gladly consider extensions if you have a use-case.

## Licence

thmb is Copyright (c) 2013 Rod Vagg [@rvagg](https://twitter.com/rvagg) and licensed under the MIT licence. All rights not explicitly granted in the MIT license are reserved. See the included LICENSE file for more details.