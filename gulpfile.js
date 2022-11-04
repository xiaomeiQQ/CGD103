const {
    src,
    dest,
    series,
    parallel,
    watch
} = require('gulp');

function defaultTask(cb){
    console.log('gulp ok');
    cb();
}

exports.c=defaultTask;

// Task A
function A(cb){
    console.log('A mission');
    cb();
}
// Task B
function B(cb){
    console.log('B mission');
    cb();
}

exports.sync=series(A,B);
exports.async=parallel(A,B);

// 以上使用在最後打包的流程控管

function file(){
    return src(['src/*.html','src/*.css','src/**/*.js','!src/about.html']).pipe(dest('dist/')) //打包兩種不同的檔案 !排除 **下一層
}
exports.f=file;

//壓縮css
const cleanCss=require('gulp-clean-css');

function cssminify(){
    return src('src/*.css').pipe(cleanCss()).pipe(dest('dist/css'))
}

exports.css=cssminify;

// 壓縮js
const uglify=require('gulp-uglify');

function js(){
    return src('src/js/*.js').pipe(uglify()).pipe(rename({
        extname:".min.js"
    }))
    .pipe(dest('dist/js'));
}

exports.minijs=js;

// ======同時壓縮 css js ======

exports.combine=parallel(js,cssminify)
// =================end=======================

// rename 改檔名

const rename =require('gulp-rename');

function cssname(){
    return src('src/*.css')
    .pipe(rename({
        extname :'.min.css'
    }))
    .pipe(dest('dist/css'))
}
exports.re=cssname;

//先壓縮 再rename

// =====sass->css
const sass=require('gulp-sass')(require('sass'));

function styleSass(){
    return src('src/sass/*.scss')
    .pipe(sass.sync().on('error',sass.logError))
    .pipe(dest('./dist/css'));
}
exports.style=styleSass;


const fileinclude=require('gulp-file-include');

function html(){
    return src('src/*.html')
        .pipe(fileinclude({
            prefix:'@@',
            basepath:'@file'
        }))
        .pipe(dest('dist'));
}

exports.h=html;

// ----watch----

function watchfile(){
    watch(['src/*.html','src/layout/*.html'],html)
    watch(['src/sass/*.scss','src/sass/**/*.scss'],styleSass)
}
exports.w=watchfile;

// ctrl+c 停止監看

