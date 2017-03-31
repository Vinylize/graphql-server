import babel from 'gulp-babel';
import envFile from 'node-env-file';
import gulp from 'gulp';
import nodemon from 'gulp-nodemon';
import rimraf from 'rimraf';
import sourcemaps from 'gulp-sourcemaps';

const SOURCE = {
  ALL: 'src/**/*.js',
  DIST: 'dist'
};

gulp.task('dev', ['build'], () => {
  envFile('./env.dev.list');
  return nodemon({
    script: './dist/server/app.js',
    watch: [SOURCE.ALL],
    tasks: ['build'],
    env: { NODE_ENV: 'development' }
  });
});

gulp.task('prod', ['build'], () => {
  envFile('./env.prod.list');
  return nodemon({
    script: './dist/server/app.js',
    watch: [SOURCE.ALL],
    tasks: ['build'],
    env: { NODE_ENV: 'production' }
  });
});

gulp.task('build', ['clean'], () => gulp.src(SOURCE.ALL)
    .pipe(sourcemaps.init())
    .pipe(babel())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('dist')));

gulp.task('clean', () => rimraf.sync(SOURCE.DIST));
