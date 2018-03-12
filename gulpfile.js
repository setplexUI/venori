'use strict'

const gulp = require('gulp')
const cleanCSS = require('gulp-clean-css')
const sourcemaps = require('gulp-sourcemaps')
const htmlmin = require('gulp-htmlmin')
const concat = require('gulp-concat')
const imagemin = require('gulp-imagemin')
const clean = require('gulp-clean')
const htmlreplace = require('gulp-html-replace')
const rename = require('gulp-rename')
const connect = require('gulp-connect')
const uglify = require('gulp-uglify-es').default;
const pump = require('pump')

/* constants */

const src = './src'
const dest = './dist'

/* tasks */

// clean destination folder
gulp.task('clean',
    () =>
gulp.src(`${dest}`, { read: false })
    .pipe(clean())
)

// minify and copy images
gulp.task('images',
    () =>
gulp.src(`${src}/img/**`)
    .pipe(imagemin())
    .pipe(gulp.dest(`${dest}/img`))
)

// minify and copy styles
gulp.task('css',
    () =>
gulp.src(`${src}/css/*.css`)
    .pipe(
        cleanCSS({ debug: true }, (details) => {
            console.log(details.name + ': ' + details.stats.originalSize)
console.log(details.name + ': ' + details.stats.minifiedSize)
})
)
.pipe(gulp.dest(`${dest}/css`))
)

// minify and copy js
gulp.task('js',
    (cb) => {
    pump([
             gulp.src(`${src}/js/*.js`),
             uglify(),
             gulp.dest(`${dest}/js`)
         ], cb)
}
)




// minify and copy html
gulp.task('html',
    () =>
gulp.src(`${src}/**/*.html`)
    .pipe(
        htmlmin({
            collapseWhitespace: true
        })
    )
    .pipe(gulp.dest(`${dest}/`))
)



// run all tasks
gulp.task('all', ['images', 'html', 'css', 'js'])

// clean and run all tasks
gulp.task('dist', ['clean'],
    () =>
gulp.start(['all'])
)

// run all tasks and start webserver over `dest` directory
gulp.task('serve', ['dist'],
    () =>
connect.server({
    root: `${dest}`,
    livereload: true,
    port: 9000
})
)
