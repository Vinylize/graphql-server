import babel from 'gulp-babel';
import envFile from 'node-env-file';
import fs from 'fs';
import gulp from 'gulp';
import nodemon from 'gulp-nodemon';
import istanbul from 'gulp-istanbul';
import mocha from 'gulp-mocha';
import rimraf from 'rimraf';
import sourcemaps from 'gulp-sourcemaps';
import { spawn } from 'child_process';

const SOURCE = {
  ALL: 'src/**/*.js',
  SERVER: 'src/server/**/*.js',
  SHARED: 'src/shared/**/*.js',
  TEST: 'src/test/**/*.js',
  MIGRATION: 'src/server/util/sequelize/*.js',
  DIST: 'dist',
  DIST_TEST: 'dist-test',
  DIST_MIGRATION: 'migration'
};

gulp.task('start:dev', () => {
  envFile('./env.dev.list');
  const env = Object.create(process.env);
  env.NODE_ENV = 'development';
  spawn('node', ['./dist/server/app.js'], { stdio: 'inherit', env });
});

gulp.task('dev', ['build'], () => {
  envFile('./env.dev.list');
  return nodemon({
    script: './dist/server/app.js',
    watch: [SOURCE.SERVER, SOURCE.SHARED],
    tasks: ['build'],
    env: { NODE_ENV: 'development' }
  });
});

gulp.task('prod', ['build'], () => {
  envFile('./env.prod.list');
  // /TODO : delete nodemon when prod mode.
  return nodemon({
    script: './dist/server/app.js',
    watch: [SOURCE.SERVER, SOURCE.SHARED],
    tasks: ['build'],
    env: { NODE_ENV: 'production' }
  });
});

gulp.task('build', ['clean'], () => gulp.src(SOURCE.ALL)
  .pipe(sourcemaps.init())
  .pipe(babel())
  .pipe(sourcemaps.write('.'))
  .pipe(gulp.dest(SOURCE.DIST)));

gulp.task('test', ['istanbul'], () => {
  if (fs.existsSync('./env.test.list')) {
    envFile('./env.test.list');
  }

  return gulp.src([
    'dist-test/test/index.js'
  ])
    .pipe(mocha())
    .pipe(istanbul.writeReports())
    // we should make threshholds to upper then 80% ~ 90%
    .pipe(istanbul.enforceThresholds({ thresholds: { global: 0 } }));
});

gulp.task('istanbul', ['build:test'], () => gulp.src(['dist-test/server/**/*.js'])
  .pipe(istanbul({ includeUntested: true }))
  .pipe(istanbul.hookRequire()));

gulp.task('build:test', ['clean:test'], () => gulp.src(SOURCE.ALL)
  .pipe(sourcemaps.init())
  .pipe(babel())
  .pipe(sourcemaps.write())
  .pipe(gulp.dest(SOURCE.DIST_TEST)));

gulp.task('build:migration', ['clean:migration'], () => gulp.src(SOURCE.MIGRATION)
  .pipe(sourcemaps.init())
  .pipe(babel())
  .pipe(sourcemaps.write())
  .pipe(gulp.dest(SOURCE.DIST_MIGRATION)));

gulp.task('clean', () => rimraf.sync(SOURCE.DIST));
gulp.task('clean:test', () => rimraf.sync(SOURCE.DIST_TEST));
gulp.task('clean:migration', () => rimraf.sync(SOURCE.DIST_MIGRATION));
