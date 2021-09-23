const gulp = require("gulp")
const {
    watch,
    series,
    parallel,
} = require("gulp")
const autoprefixer = require("gulp-autoprefixer")
const browserSync = require("browser-sync")
const concat = require("gulp-concat")
const cssmin = require("gulp-cssmin")
const minify = require("gulp-minify")
const rename = require("gulp-rename")
const cleanCss = require("gulp-clean-css")
const rev = require("gulp-rev")
const del = require("del")
const sass = require("gulp-sass")(require("sass"))
const phpConnect = require("gulp-connect-php")
const util = require("util")
//
const js_mdb_destination_file_name = "mdb"
const js_site_destination_file_name = "site"
const js_mdb_source_files = "./js/mdb.js"
const js_mdb_source_modules = "./js/mdb"
const js_site_source_file = "./js/modules.js"
const js_site_source_modules = "./js/modules"
const js_destination_path = "./public_html/assets/js/"
const css_addons_path = "modules"
const css_destination_path = "./public_html/assets/css/"


function get_site_scripts () {
    delete require.cache[require.resolve(js_site_source_file)]
    return require(js_site_source_modules)
}


function get_mdb_scripts () {
    delete require.cache[require.resolve(js_mdb_source_files)]
    return require(js_mdb_source_modules)
}


function start (cb) {
    console.clear()
    cb()
}


function clean_scripts (cb) {
    del([
        js_destination_path + js_site_destination_file_name + ".*",
    ])
    cb()
}


function bundle_scripts (cb) {
    const plugins = get_site_scripts()
    gulp.src(plugins.modules)
      .pipe(concat(js_site_destination_file_name + ".js"))
      .pipe(gulp.dest(js_destination_path))
    cb()
}


function pack_scripts (cb) {
    const plugins = get_site_scripts()
    gulp.src(plugins.modules)
      .pipe(concat(js_site_destination_file_name + ".js"))
      .pipe(minify({
          ext: {
              min: ".min.js",
          },
          noSource: true,
      }))
      .pipe(gulp.dest(js_destination_path))
    cb()
}


function clean_css (cb) {
    del([
        css_destination_path + "*.css",
    ])
    cb()
}


function css_compile (cb) {
    gulp.src("scss/*.scss")
      .pipe(sass({
          outputStyle: "compressed",
      }).on("error", sass.logError))
      .pipe(autoprefixer())
      .pipe(gulp.dest(css_destination_path))
    cb()
}


function css_minify (cb) {
    gulp.src(["./public_html/assets/css/*.css", "!./public_html/assets/css/*.min.css", "!./public_html/assets/css/bootstrap.css"])
      .pipe(cssmin())
      .pipe(rename({
          suffix: ".min",
      }))
      .pipe(gulp.dest(css_destination_path))
    cb()
}


function copy_js_files (cb) {
    let move_js_to = "/wamp64/www/public_html/assets/js"
    let filesToMove = [
        "./public_html/assets/js/*.*",
    ]
    gulp.src(filesToMove).pipe(gulp.dest(move_js_to))
    cb()
}


function copy_vendor_files (cb) {
    let move_vendor_to = "/wamp64/www/public_html/assets/vendor"
    let filesToMove = [
        "./public_html/assets/vendor/**/*.*",
    ]
    gulp.src(filesToMove).pipe(gulp.dest(move_vendor_to))
    cb()
}


function copy_site_js_files (cb) {
    let move_css_to = "/wamp64/www/public_html/assets/js/"
    let filesToMove = [
        "./public_html/assets/js/site.min.js",
        "./public_html/assets/js/site.js",
    ]
    gulp.src(filesToMove).pipe(gulp.dest(move_css_to))
    cb()
}


function copy_mdb_js_files (cb) {
    let move_css_to = "/wamp64/www/public_html/assets/js/"
    let filesToMove = [
        "./public_html/assets/js/mdb.min.js",
        "./public_html/assets/js/mdb.js",
    ]
    gulp.src(filesToMove).pipe(gulp.dest(move_css_to))
    cb()
}


function copy_css_files (cb) {
    let move_css_to = "/wamp64/www/public_html/assets/css"
    let filesToMove = [
        "./public_html/assets/css/*.*",
    ]
    gulp.src("./public_html/assets/css/*.*").pipe(gulp.dest(move_css_to))
    cb()
}


function complete (cb) {
    console.log("-- COMPLETE --")
    cb()
}


function clean_mdb (cb) {
    del([
        js_destination_path + js_mdb_destination_file_name + ".*",
    ])
    cb()
}


function bundle_mdb (cb) {
    const plugins = get_mdb_scripts()
    gulp.src(plugins.modules)
      .pipe(concat(js_mdb_destination_file_name + ".js"))
      .pipe(gulp.dest(js_destination_path))
    cb()
}


function pack_mdb (cb) {
    
    const plugins = get_mdb_scripts()
    gulp.src(plugins.modules)
      .pipe(concat(js_mdb_destination_file_name + ".js"))
      .pipe(minify({
          ext: {
              min: ".min.js",
          },
          noSource: true,
      }))
      .pipe(gulp.dest(js_destination_path))
    cb()
}


function connect_sync () {
    phpConnect.server({
        keepalive: true,
        base: "./public_html",
    }, function () {
        browserSync({
            proxy: "127.0.0.1:8000",
            open: false,
        })
    })
}


function connect_live_server (cb) {
    browserSync.init({
        server: {
            baseDir: "./public_html",
            directory: true,
        },
        notify: false,
    })
    
    cb()
}


function browserSyncReload (done) {
    browserSync.reload()
    done()
}


function php (cb) {
    return gulp.src("./framework/**/*.php").pipe(gulp.dest("./public_html"))
    //return gulp.src("./src/**/*.php").pipe(gulp.dest("./public_html"))
}


function watch_all_reload (cb) {
    watch("framework/**/*.php", series(php, browserSyncReload))
}


function watch_css (cb) {
    
    watch("scss/**/*.scss", series(
        clean_css,
        css_compile,
        css_minify,
        copy_css_files,
        //browserSyncReload,
        //complete,
      ),
    )
    cb()
}


function watch_scripts (cb) {
    
    watch(["js/modules/**/*.js", "js/modules.js"], series(
        clean_scripts,
        bundle_scripts,
        pack_scripts,
        copy_site_js_files,
      ),
    )
    cb()
}


function watch_all (cb) {
    
    watch(["js/modules/**/*.js", "js/modules.js"], series(
        clean_scripts,
        bundle_scripts,
        pack_scripts,
        copy_site_js_files,
        browserSyncReload,
        complete,
      ),
    )
    
    watch(["js/mdb/**/*.js", "js/mdb.js"], series(
        clean_mdb,
        bundle_mdb,
        pack_mdb,
        copy_mdb_js_files,
        browserSyncReload,
        complete,
      ),
    )
    
    watch("scss/**/*.scss", series(
        clean_css,
        css_compile,
        css_minify,
        copy_css_files,
        browserSyncReload,
        complete,
      ),
    )
    
}


exports.build_scripts = series(
  clean_scripts,
  bundle_scripts,
  pack_scripts,
  copy_site_js_files,
  //browserSyncReload,
  //complete,
)

exports.build_mdb = series(
  clean_mdb,
  bundle_mdb,
  pack_mdb,
  copy_mdb_js_files,
  //browserSyncReload,
  complete,
)

exports.build_css = series(
  clean_css,
  css_compile,
  css_minify,
  copy_css_files,
  //browserSyncReload,
  complete,
)

exports.build = series(
  parallel(clean_scripts, clean_mdb, clean_css),
  parallel(bundle_scripts, bundle_mdb, css_compile),
  parallel(pack_scripts, pack_mdb, css_minify),
  parallel(copy_css_files, copy_js_files, copy_vendor_files),
  complete,
)

exports.move_all = series(
  parallel(
    copy_css_files, copy_js_files, copy_vendor_files,
  ), complete,
)

exports.move_css = series(
  copy_css_files, complete,
)

exports.move_mdb_js = series(
  copy_mdb_js_files, complete,
)

exports.move_site_js = series(
  copy_site_js_files,
)

exports.move_js = series(
  copy_js_files,
)

exports.move_vendor = series(
  copy_vendor_files,
)

exports.watcher = series(
  start,
  parallel(
    watch_css,
    watch_scripts,
  ),
  copy_css_files,
  copy_js_files,
)

exports.dev_watch = function (done) {
    watch_all()
    done()
}

exports.live_server = parallel([watch_all, watch_all_reload, connect_sync])

exports.precompile = series(
  series(clean_scripts,
    bundle_scripts,
    pack_scripts),
  
  copy_js_files,
  copy_site_js_files,
)

exports.default = series(
  clean_scripts,
  bundle_scripts,
  pack_scripts,
  copy_site_js_files,
)
