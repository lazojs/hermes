// TODO: test push state related code, i. e., the core functionality of the library
describe('hermes', function () {

    function start() {
        window.hermes.start({
            routes: {
                '/foo/bar(/)': function (pathname, params) {},
                '/hermes.html': function (pathname, params) {}
            }
        });
    }

    afterEach(function() {
        window.hermes.destroyRoutes();
        window.hermes.stop();
    });

    it('should be attached to window', function () {
        expect(window.hermes).toBeDefined();
    });

    it('should start', function () {
        hermes.start();
        expect(window.hermes._started).toBe(true);
    });

    it('should stop', function () {
        hermes.start();
        expect(window.hermes._started).toBe(true);
        window.hermes.stop();
        expect(window.hermes._started).toBe(false);
    });

    it('should destroy route handlers', function () {
        start();
        expect(window.hermes._handlers.length).toEqual(2);
        window.hermes.destroyRoutes();
        expect(window.hermes._handlers.length).toEqual(0);
    });

    it('should add a route', function () {
        hermes.route('/foo/bar(/)', 'foo', function (pathname, params) {});
        expect(window.hermes._handlers.length).toEqual(1);
    });

});