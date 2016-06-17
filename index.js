const map = require( 'map-stream' ),
    fs = require( 'fs' ),
    gutil = require( 'gulp-util' );

const PLUGIN_NAME = 'gulp-file-override';

function fileOverride( defaultPath, modifiedPath ) {

    var replaceRex = new RegExp( defaultPath.replace( /\*/g, '(.*)' ), 'g' );

    return map(
        ( originalFile, callback ) => {

            var appFileLoc = {
                path: originalFile.path.replace( replaceRex, modifiedPath ),
                cwd: originalFile.cwd.replace( replaceRex, modifiedPath ),
                base: originalFile.base.replace( replaceRex, modifiedPath )
            };

            if( fs.existsSync( appFileLoc.path ) ) {

                //console.log( 'Override file found' );

                var appFile = new gutil.File(
                    {
                        base: appFileLoc.base,
                        cwd: originalFile.cwd,
                        path: appFileLoc.path,
                        contents: new Buffer( fs.readFileSync( appFileLoc.path ) )
                    }
                );

                // var file = appFile.clone({contents: false});
                // var parsedPath = parsePath(file.relative);
                // path = Path.join(parsedPath.dirname, parsedPath.basename + parsedPath.extname);
                // file.path = Path.join(file.base, path);

                if( appFile.sourceMap ) {
                    appFile.sourceMap.file = appFile.relative;
                }

                callback( null, appFile );

            } else {

                callback( null, originalFile );

            }

        }
    );
}

module.exports = fileOverride;