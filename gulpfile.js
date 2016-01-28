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
var gutil = require('gulp-util');

var customOpts = {
  entries: ['dev/assets/scripts/app.js'],
  debug: true
};
var opts = assign({}, watchify.args, customOpts);
var b = watchify(browserify(opts).transform("babelify", {extensions: [".js"]})); 

// add transformations here
// i.e. b.transform(coffeeify);

gulp.task('browserify', bundle); // so you can run `gulp js` to build the file
b.on('update', bundle); // on any dep update, runs the bundler
b.on('log', gutil.log); // output build logs to terminal

function bundle() {
  return b.bundle()
    // log errors if they happen
    .on('error', gutil.log.bind(gutil, 'Browserify Error'))
    
    .pipe(source('app.js'))
    // optional, remove if you don't need to buffer file contents
    // Add transformation tasks to the pipeline here.
    .pipe(gulp.dest('./public'));
}

gulp.task('default', ['templates', 'browserify']);
