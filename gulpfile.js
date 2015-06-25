
// Get all that JS up to snuff
// gulp.task( 'jq', function() {
//   var jqFiles = [
//     './bower_components/foundation/js/foundation.js'
//   ];

//   gulp.src( jqFiles )
//     .pipe( concat( 'app.js' ) )
//     .pipe( wrap( '(function(\$){\n<%= contents %>\n})(jQuery);' ) )
//     .pipe( gulp.dest( './build/js/' ) );
// });



// 1. LIBRARIES
// - - - - - - - - - - - - - - -

var gulp       = require('gulp'),
    $          = require('gulp-load-plugins')(),
    del        = require('del'),
    sequence   = require('run-sequence'),
    path       = require('path'),
    modRewrite = require('connect-modrewrite'),
    wrap       = require('gulp-wrap');
    // router     = require('./bower_components/foundation-apps/bin/gulp-dynamic-routing');

// 2. SETTINGS VARIABLES
// - - - - - - - - - - - - - - -

// Sass will check these folders for files when you use @import.
var sassPaths = [
  'client/assets/scss',
  'bower_components/foundation/scss'
];
// These files include Foundation for Apps and its dependencies
var wrapJS = [
  'bower_components/foundation/js/foundation.js',
  'client/assets/js/app.js'
];

var vendJS = [
  'bower_components/fastclick/lib/fastclick.js',
  'bower_components/modernizer/modernizer.js'
];

var otherJS = [
  
];

// 3. TASKS
// - - - - - - - - - - - - - - -

// Clean up! Clean up! Everybody everywhere!
gulp.task('clean', function(cb) {
  del('./build', cb);
});

// Copies user-created files and Foundation assets
// gulp.task('copy', function() {
//   var dirs = [
//     './client/**/*.*',
//     '!./client/templates/**/*.*',
//     '!./client/assets/{scss,js}/**/*.*'
//   ];

//   // Everything in the client folder except templates, Sass, and JS
//   gulp.src(dirs, {
//     base: './client/'
//   })
//     .pipe(gulp.dest('./build'));

//   // Iconic SVG icons
//   gulp.src('./bower_components/foundation-apps/iconic/**/*')
//     .pipe(gulp.dest('./build/assets/img/iconic/'));

//   // Foundation's Angular partials
//   return gulp.src(['./bower_components/foundation-apps/js/angular/components/**/*.html'])
//     .pipe(gulp.dest('./build/components/'));
// });

// Compiles Sass
gulp.task('sass', function() {
  return gulp.src('client/assets/scss/app.scss')
    .pipe($.rubySass({
      loadPath: sassPaths,
      style: 'nested',
      bundleExec: true
    })).on('error', function(e) {
      console.log(e);
    })
    .pipe($.autoprefixer({
      browsers: ['last 2 versions', 'ie 10']
    }))
    .pipe(gulp.dest('./build/assets/css/'));
});

// Compiles and copies the Foundation for Apps JavaScript, as well as your app's custom JS
gulp.task('uglify', function() {
  // Foundation JavaScript
  gulp.src(wrapJS)
    .pipe($.uglify({
      beautify: true,
      mangle: false
    }).on('error', function(e) {
      console.log(e);
    }))
    .pipe($.concat('foundation.js'))
    // .pipe( wrap( '(function(\$){\n<%= contents %>\n})(jQuery);' ) )
    .pipe(gulp.dest('./build/assets/js/'))
  ;

  // App JavaScript
  // return gulp.src(appJS)
  //   .pipe($.uglify({
  //     beautify: true,
  //     mangle: false
  //   }).on('error', function(e) {
  //     console.log(e);
  //   }))
  //   .pipe($.concat('app.js'))
  //   .pipe(gulp.dest('./build/assets/js/'))
  // ;
});

// Copies your app's page templates and generates URLs for them
// gulp.task('copy-templates', ['copy'], function() {
//   return gulp.src('./client/templates/**/*.html')
//     .pipe(router({
//       path: 'build/assets/js/routes.js',
//       root: 'client'
//     }))
//     .pipe(gulp.dest('./build/templates'))
//   ;
// });

// Starts a test server, which you can view at http://localhost:8080
// gulp.task('server:start', function() {
//   $.connect.server({
//     root: './build',
//     middleware: function() {
//       return [
//         modRewrite(['^[^\\.]*$ /index.html [L]'])
//       ];
//     },
//   });
// });

// Builds your entire app once, without starting a server
gulp.task('build', function() {
  sequence('clean', [/*'copy',*/ 'sass', 'uglify'], function() {
    console.log("Successfully built.");
  })
});

// Default task: builds your app, starts a server, and recompiles assets when they change
gulp.task('default', ['build'/*, 'server:start'*/], function() {
  // Watch Sass
  gulp.watch(['./client/assets/scss/**/*', './scss/**/*'], ['sass']);

  // Watch JavaScript
  gulp.watch(['./client/assets/js/**/*', './js/**/*'], ['uglify']);

  // Watch static files
  // gulp.watch(['./client/**/*.*', '!./client/templates/**/*.*', '!./client/assets/{scss,js}/**/*.*'], ['copy']);

  // Watch app templates
  // gulp.watch(['./client/templates/**/*.html'], ['copy-templates']);
});
