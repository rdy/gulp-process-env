require('./spec_helper');

describe('gulp-process-env', () => {
  let subject;
  const {env: originalEnv} = process;

  beforeEach(() => {
    subject = require('../index');
    process.env = {NODE_ENV: 'development'};
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe('when piped into an existing stream', () => {
    let es, stream, environment, env, callbackSpy;
    beforeEach(() => {
      es = require('event-stream');
      const {Readable} = require('stream');
      stream = new Readable({objectMode: true}).wrap(es.readArray([1, 2, 3]));
      environment = {NODE_ENV: 'test', other: 'property'};
      callbackSpy = jasmine.createSpy('callback');
    });

    afterEach(() => {
      stream.destroy();
    });

    describe('when a callback is provided', () => {
      beforeEach(() => {
        env = subject(environment, callbackSpy);
      });

      it('sets the environment', done => {
        stream
          .pipe(env)
          .pipe(es.map((data, callback) => {
            Object.entries(environment).forEach(([key, value]) => {
              expect(process.env[key]).toEqual(value);
            });
            callback(null, data);
          }))
          .pipe(es.wait(done));
      });

      it('does not call the provided callback', () => {
        expect(callbackSpy).not.toHaveBeenCalled();
      });

      describe('when piping the restored environment', () => {
        beforeEach(done => {
          stream
            .pipe(env)
            .pipe(env.restore())
            .pipe(es.wait(done))
            .once('finish', done);
        });

        it('restores the environment when the stream is finished', () => {
          expect(Object.keys(process.env).length).toBe(1);
          expect(process.env.NODE_ENV).toEqual('development');
        });

        it('calls the provided callback', () => {
          expect(callbackSpy).toHaveBeenCalled();
        });
      });
    });

    describe('when a callback is not provided', () => {
      beforeEach(() => {
        env = subject(environment);
      });

      it('sets the environment', done => {
        stream
          .pipe(env)
          .pipe(es.map((data, callback) => {
            Object.entries(environment).forEach(([key, value]) => {
              expect(process.env[key]).toEqual(value);
            });
            callback(null, data);
          }))
          .pipe(es.wait(done));
      });

      it('does not call the provided callback', () => {
        expect(callbackSpy).not.toHaveBeenCalled();
      });

      describe('when piping the restored environment', () => {
        beforeEach(done => {
          stream
            .pipe(env)
            .pipe(env.restore())
            .pipe(es.wait(done))
            .once('finish', done);
        });

        it('restores the environment when the stream is finished', () => {
          expect(Object.keys(process.env).length).toBe(1);
          expect(process.env.NODE_ENV).toEqual('development');
        });

        it('does not call the provided callback', () => {
          expect(callbackSpy).not.toHaveBeenCalled();
        });
      });
    });
  });
});