const os     = require('os')
    , fs     = require('fs')
    , path   = require('path')
    , test   = require('tap').test
    , canvas = require('canvas')
    , sz     = require('sz')
    , thmb   = require('./')

// NOTE: these are basically resize tests, I don't have a good way
// at the moment to test an actual crop and not just a resize has occurred
// but if you're reading this and can think of an easy way then please
// go ahead and suggest it!


test('test no such file', function (t) {
  t.plan(2)
  thmb('foobar.gif', 'foobar_10x10.gif', { width: 10, height: 10 }, function (err, size) {
    t.ok((/error/i).test(err), 'got error message')
    t.ok(size === undefined, 'no size provided')
  })
})

test('test basic thumbnail', function (t) {
  var src = path.join(__dirname, 'node_modules/sz/test-data/avatar.jpg')
    , dst = path.join(os.tmpDir(), String(Math.random()) + 'avatar.png')

  t.plan(3)
  thmb(src, dst, { width: 100, height: 200 }, function (err) {
    t.notOk(err, 'no error')
    sz(dst, function (err, size) {
      t.notOk(err, 'no error')
      t.deepEqual(size, { width: 100, height: 200 }, 'cropped image is correct size')
      fs.unlinkSync(dst)
    })
  })
})

test('test thumbnail jpg smaller than png', function (t) {
  var src  = path.join(__dirname, 'node_modules/sz/test-data/avatar.jpg')
    , dstp = path.join(os.tmpDir(), String(Math.random()) + 'avatar.png')
    , dstj = path.join(os.tmpDir(), String(Math.random()) + 'avatar.jpg')

  t.plan(3)
  thmb(src, dstp, { width: 100, height: 200 }, function (err) {
    t.notOk(err, 'no error')

    thmb(src, dstj, { width: 100, height: 200, type: 'jpeg' }, function (err) {
      t.notOk(err, 'no error')

      var psize = fs.statSync(dstp).size
        , jsize = fs.statSync(dstj).size

      fs.unlinkSync(dstp)
      fs.unlinkSync(dstj)
      t.ok(psize > jsize, 'PNG (' + psize + ') is larger than JPEG (' + jsize + ') of same image')
    })
  })
})

test('test thumbnail jpg low-quality smaller than jpg high-quality', function (t) {
  var src  = path.join(__dirname, 'node_modules/sz/test-data/avatar.jpg')
    , dsth = path.join(os.tmpDir(), String(Math.random()) + 'avatar.jpg')
    , dstl = path.join(os.tmpDir(), String(Math.random()) + 'avatar.jpg')

  t.plan(3)
  thmb(src, dsth, { width: 100, height: 200, type: 'jpeg', quality: 70 }, function (err) {
    t.notOk(err, 'no error')

    thmb(src, dstl, { width: 100, height: 200, type: 'jpeg', quality: 30 }, function (err) {
      t.notOk(err, 'no error')

      var hsize = fs.statSync(dsth).size
        , lsize = fs.statSync(dstl).size

      fs.unlinkSync(dsth)
      fs.unlinkSync(dstl)
      t.ok(
          hsize > lsize
        , 'JPG high-quality (' + hsize + ') is larger than JPEG low-quality (' + lsize + ') of same image'
      )
    })
  })
})
