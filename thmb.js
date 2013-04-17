const fs     = require('fs')
    , after  = require('after')
    , xtend  = require('xtend')
    , rsz    = require('rsz')
    , crp    = require('crp')
    , sz     = require('sz')

module.exports = function thmb (
    origFile
  , newFile
  , options
  , callback) {

    if (typeof options.height != 'number' || typeof options.width != 'number')
      return callback(new Error('must provide a `height` and `width` in your options'))

    var size
      , origDate
      , newDate

      , done = after(3, function (err) {
          if (err)
            return callback(err)

          if (origDate == null || (newDate != null && newDate >= origDate))
            return callback(null, size)

          var nheight = (options.width / size.width) * size.height
            , nwidth  = (options.height / size.height) * size.width

          if (nheight < options.height)
            nheight = options.height
          else
            nwidth = options.width

          rsz(
              origFile
            , { height: nheight, width: nwidth }
            , function (err, buf) {
                if (err)
                  return callback(err)

                crp(
                    buf
                  , options
                  , newFile
                  , function (err) {
                      if (err)
                        return callback(err)

                      callback(null, size)
                    }
                )
              }
          )

        })

      sz(origFile, function (err, _size) {
        if (err)
          return done(err)
        size = _size
        done()
      })

      fs.stat(origFile, function (err, stat) {
        if (err)
          return done(err)
        origDate = stat.mtime
        done()
      })

      fs.stat(newFile, function (err, stat) {
        if (!err)
          newDate = stat.mtime
        done()
      })
}