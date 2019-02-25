# Gulp Bufferify

A package for gulp developer to catch pipe stream content and modify it easily.

## Install

```
npm install --save-dev gulp-bufferify
```

## Usage

ES6:

```js
import gulp from 'gulp'
import bufferify from 'gulp-bufferify'
```

CommonJS:

```js
var gulp = require('gulp')
var { bufferify } = require('gulp-bufferify')
```

```js
gulp.src('./some.html')
    .pipe(bufferify((content, file, context) => {
        content = content.toString()
        content = content.replace(/aws/g, 'gogo')
        return content
    }))
    .pipe(gulp.dest('.'))
```

Pass `bufferify(factory)` into .pipe.

## Options

`factory` is a function, with four parameters.

**content**

The buffer content of the file. Use `content.toString()` to convert it to be text.

You can change the content, and return new content which will be used in next pipe in callback function. If no content returned, original content will be used in next pipe.

**file**

Buffer file, use `file.path` `file.cwd` `file.base` to get file info which is from previous pipe (so, gulp-rename will make sense, the position of this pipe is important).

For example, you can use this to change the file name and relative path. Previous `content` is always equal `file.contents` as metioned before.

**context**

Use this to modify pipe stream. For example:

```js
gulp.src('./file.scss')
    .pipe(bufferify((content, file, context) => {
        let newfile = file.clone() // you can use clone property
        newfile.path = '...'
        newfile.contents = new Buffer(...)
        context.push(newfile)
    }))
```

Do like this, a new file will be added into pipe stream.

**callback**

You can pass the fourth argument *callback* for an async program. For example:

```js
gulp.src('...')
    .pipe(bufferify((content, file, context, callback) => {
        // ...modify file
        setTimeout(() => callback(null, file), 10000)
    }))
```

*Notice:* if you use callback as an argument, you must call it in your function, or the pipe-line will be hold all the time.

If you have ever use through2, you may know this `callback`. In previous examples, I use `context.push(file)` to add a new file, in fact, in through2, you can use `callback(null, file)` to change file in pipe stream. So you can also do:

```js
gulp.src('...')
    .pipe(bufferify((content, file, context, callback) => {
        // ...modify file
        setTimeout(() => {
          context.push(file)
          callback()
        }, 10000)
    }))
```
