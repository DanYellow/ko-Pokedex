var gulp = require('gulp');
var watch = require('gulp-watch');

var nunjucksRender = require('gulp-nunjucks-render');


gulp.task('templates', function(req, res) {
  nunjucksRender.nunjucks.configure(['./dev/views/'], {watch: false});
    return gulp.src('./dev/views/*.html')
      .pipe(nunjucksRender())
      .pipe(gulp.dest('public'));
});


var browserify = require('browserify');
var watchify = require('watchify');
var source = require('vinyl-source-stream');
var assign = require('lodash.assign');
var babelify = require("babelify");

var customOpts = {
  entries: ['dev/assets/scripts/app.js'],
  debug: true
};

gulp.task('browserify', function() {
    return browserify('./dev/assets/scripts/app.js')
      .transform("babelify", {extensions: [".js"]})
        .bundle()
        //Pass desired output filename to vinyl-source-stream
        .pipe(source('app.js'))
        // Start piping stream to tasks!
        .pipe(gulp.dest('./public/'));
});

gulp.task('default', ['templates', 'browserify']);
