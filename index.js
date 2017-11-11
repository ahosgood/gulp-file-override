const map = require( 'map-stream' ),
    fs = require( 'fs' ),
    gutil = require( 'gulp-util' );

const PLUGIN_NAME = 'gulp-file-override';

function fileOverride( defaultPath, modifiedPath ) {
    let find = defaultPath.lastIndexOf( '*' ) > -1 ? new RegExp( defaultPath.replace( /\*/g, '(.*)' ), 'g' ) : defaultPath;

    return map( ( originalFile, callback ) => {
            let appFileLoc = {
                path: originalFile.path.replace( find, modifiedPath ),
                cwd: originalFile.cwd.replace( find, modifiedPath ),
                base: originalFile.base.replace( find, modifiedPath )
            };

        if( appFileLoc.path !== originalFile.path &&
                fs.existsSync( appFileLoc.path ) &&
                fs.lstatSync( appFileLoc.path ).isFile() ) {
            console.log( 'Override file found: "' + originalFile.path + '" --> "' + appFileLoc.path + '"' );

            let appFile = new gutil.File(
                {
                    base: appFileLoc.base,
                    cwd: originalFile.cwd,
                    path: appFileLoc.path,
                    contents: new Buffer( fs.readFileSync( appFileLoc.path ) )
                }
            );

            if( appFile.sourceMap ) {
                appFile.sourceMap.file = appFile.relative;
            }

            callback( null, appFile );
        } else {
            callback( null, originalFile );
        }
    } );
}

module.exports = fileOverride;