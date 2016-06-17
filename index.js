const map = require('map-stream');
const fs = require('fs');
const gutil = require('gulp-util');

const PLUGIN_NAME = 'gulp-file-override';

function fileOverride(original, app) {

    original = original.replace(/\*/g, '(.*)');

    var replaceRex = new RegExp(original, 'g');

    return map(
        (file, cb) => {

            var appFile = {
                path: file.path.replace(replaceRex, app),
                cwd: file.cwd.replace(replaceRex, app),
                base: file.base.replace(replaceRex, app)
            };
            console.log('-----------------------------------------------');

            console.log('file.cwd:     ' + file.cwd);
            console.log('file.base:    ' + file.base);
            console.log('file.path:    ' + file.path);
            console.log('original:     ' + original);
            console.log('mod:          ' + app);
            console.log('appFile.cwd:  ' + appFile.cwd);
            console.log('appFile.base: ' + appFile.base);
            console.log('appfile.path: ' + appFile.path);

            if (fs.existsSync(appFile.path)) {

                console.log('App file found');

                console.log(file);
                file = new gutil.File({
                    base: appFile.base,
                    cwd: appFile.cwd,
                    path: appFile.path,
                    contents: new Buffer(fs.readFileSync(appFile.path))
                });

                console.log(file);

                cb(null, file);

            } else {

                cb(null, file);

            }

        });
}

module.exports = fileOverride;