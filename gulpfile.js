const gulp = require('gulp'); // подкл сам gulp
const sass = require('gulp-sass')(require('sass')); // подкл sass
const fileinclude = require('gulp-file-include');
const deleteFiles = require('gulp-clean');
const rename = require('gulp-rename');
//ES6 modules
const rollup = require('@rbnlffl/gulp-rollup');

//Для облегчения работы пути храним в объекте

const path = {
  dev: {
      root: 'src',
      html: ['src/**/*.html', '!src/components/**/*.html'],
      allHtml: 'src/**/*.html',
      sass: 'src/sass/**/*.{sass,scss}',
      js: 'src/js/main.js',
      img: 'src/img/**/*.*',
      fonts: 'src/fonts/**/*.*',
  },
  build: {
      root: 'build',
      css: 'build/css',
      js: 'build/js',
      img: 'build/img',
      fonts: 'build/fonts'
  }
}

// Секция создания таск или задач gulp(каждая функция эта задача gulp)

function clean(){
  return gulp.src(path.build.root,{read: false,allowEmpty: true})
    .pipe(deleteFiles())
}

function moveImg(){
  return gulp.src(path.dev.img)
    .pipe(gulp.dest(path.build.img))
}

function moveHtml(){
  return gulp.src(path.dev.html)
    .pipe(fileinclude())
    .pipe(gulp.dest(path.build.root))
}

function styles(){
  return gulp.src(path.dev.sass)
    .pipe(sass())
    .pipe(gulp.dest(path.build.css))
}

function scripts(){
  return gulp.src(path.dev.js)
    .pipe(rollup())
    .pipe(rename('bundle.js'))
    .pipe(gulp.dest(path.build.root))
}

function moveFonts(){
  return gulp.src(path.dev.fonts)
    .pipe(gulp.dest(path.build.fonts))
}

function watcher(done){ // следит за изменениями, колбэк вместо done может быть что угодно исп просто чтобы вернуть все вместо return 
  gulp.watch(path.dev.html, moveHtml)
  gulp.watch(path.dev.img, moveImg) // следи за файлами html если изменятся то запусти задачу moveImg
  gulp.watch(path.dev.sass, styles)
  gulp.watch(path.dev.js, scripts)
  gulp.watch(path.dev.fonts, moveFonts)
  done();
}


exports.moveHtml = moveHtml;
exports.moveImg = moveImg;
exports.watcher = watcher;
exports.styles = styles;
exports.moveFonts = moveFonts;
exports.clean = clean;
exports.scripts = scripts;


exports.devHtml = gulp.series( //dev основной экспорт создает запуск всех задач одной командой (gulp) запуск задач последовательный
    clean,
    gulp.parallel( //dev запуск задач паралельный
        styles,
        moveHtml,
        moveImg,
        moveFonts,
        scripts,
    ),
    watcher
);

exports.buildHtml = gulp.series( //build final основной экспорт создает запуск всех задач одной командой (gulp) запуск задач последовательный
    clean,
    gulp.parallel( //build final запуск задач паралельный
        styles,
        moveHtml,
        moveImg,
        moveFonts,
        scripts,
    ),

);
