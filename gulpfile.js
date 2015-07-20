var gulp = require('gulp');
var path = require('path');
var _ = require('lodash');

gulp.task('default', ['compile']);

gulp.task('test', ['compile'], function() {
	var mocha = require('gulp-mocha');
	return gulp.src('dist/test/**/*.js', {read: false})
			.pipe(mocha());
});

gulp.task('compile', ['compile-browser', 'compile-server']);

gulp.task('clean-server', makeCleanTask('dist/server'));
gulp.task('compile-server', ['clean-server'], makeES6CompileTask('src/server'));

gulp.task('compile-browser', makeBrowserifyTask('src/browser/index.js', 'main.js'));

function makeCleanTask(directory) {
  var del = require('del');
  return function(cb) {
    del(directory, cb);
  }
}

function makeES6CompileTask(sourceDirectory) {
  var sources = path.join(sourceDirectory, '**/*.js');
  var destination = path.join('dist', sourceDirectory);

  return function() {
    var babel = require('gulp-babel');
    var sourcemaps = require('gulp-sourcemaps');

    return gulp.src(sources)
      .pipe(sourcemaps.init())
      .pipe(babel({
        retainLines: true
      }))
      .pipe(sourcemaps.write('.', {
        sourceRoot: function(file) {
          // we have to go the right number of directories up
          console.log(file.relative);
          var depth = file.relative.split(path.sep).length + 2;
          var rootRelativePath = _.range(0, depth).map(function() { return '..' + path.sep;} ).join('');
          return rootRelativePath + sourceDirectory;
        }
      }))
      .pipe(gulp.dest(destination));
  }
}

function makeBrowserifyTask(sourceFile, outFileName) {
	var browserify = require('browserify');
	var babelify = require('babelify');
	var source = require('vinyl-source-stream');

	return function() {
	    return browserify({
		    entries: [sourceFile],
		    transform: [babelify]
	    })
	    .bundle()
	    .on('error', logErrors)
	    .pipe(source(outFileName))
	    .pipe(gulp.dest('./dist/browser'));
	};
}

function logErrors(e) {
	console.error("Build error:", e.message);
}
