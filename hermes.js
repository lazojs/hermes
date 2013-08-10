// HERMES, sweet llamas of the bahamas
// ----------------------------------
// v0.0.1
//
// Copyright (c)2013 Jason Strimpel
// Distributed under MIT license
;(function (window) {
    var hermes;

    function augment(receiver, giver) {
        for (var k in giver) {
            receiver[k] = giver[k];
        }

        return receiver;
    }

    function isRegExp(obj) {
       return Object.prototype.toString.call(obj) === '[object RegExp]';
    }

    function isFunction(thing) {
        return typeof thing === 'function';
    }

    // thank you backbone
    var optionalParam = /\((.*?)\)/g;
    var namedParam    = /(\(\?)?:\w+/g;
    var splatParam    = /\*\w+/g;
    var escapeRegExp  = /[\-{}\[\]+?.,\\\^$|#\s]/g;
    var rootStripper = /^\/+|\/+$/g;
    var trailingSlash = /\/$/;

    hermes = {

        start: function (options) {
            var self = this;
            if (this._started || !window.history.pushState) {
                return this;
            }

            options = options || {};
            this._handlers = this._handlers || [];
            augment(this, options);
            this.root = this.root ? ('/' + this.root + '/').replace(rootStripper, '/') : void 0;
            window.history.replaceState(options.data || {}, document.title, window.location.pathname + window.location.search);
            this._lastUrl = { pathname: window.location.pathname, search: window.location.search };
            self._backboneEvents();
            self._bindRoutes();
            setTimeout(function () {
                self._bindPopState();
            }, 0);
            this._started = true;
            return this;
        },

        stop: function () {
            window.removeEventListener('popstate', this._popstateListener);
            this._started = false;
        },

        route: function (route, name, callback) {
            var args,
                self = this;
            route = !isRegExp(route) ? this._routeToRegExp(route) : route;
            if (isFunction(name)) {
                callback = name;
                name = '';
            }

            this._handlers.unshift({ route: route, callback: function (data) {
                args = self._getParams();
                if (isFunction(callback)) {
                    callback.apply(self, [window.location.pathname, args, data]);
                }
                if (self._backboneEventsAugmented) {
                    self.trigger.apply(self, ['route:' + name].concat(args, data));
                    self.trigger('route', name, args, data);
                }
            } });

            return this;
        },

        destroyRoutes: function () {
            this._handlers = [];
        },

        navigate: function (pathname, options) {
            options = options || {};
            options.state = options.state || {};
            window.history[options.replace ? 'replaceState' : 'pushState'](options.state, document.title, pathname);
            if (options.trigger === void 0 || options.trigger) {
                this._loadUrl(options.state);
            }
        },

        _getParams: function (urlParts) {
            var match,
                pl     = /\+/g,  // Regex for replacing addition symbol with a space
                search = /([^&=]+)=?([^&]*)/g,
                decode = function (s) { return decodeURIComponent(s.replace(pl, ' ')); },
                query  = urlParts ? urlParts.search.substring(1) : window.location.search.substring(1),
                params = {};

            while ((match = search.exec(query))) {
                params[decode(match[1])] = decode(match[2]);
            }

            return params;
        },

        // thank you backbone
        _routeToRegExp: function (route) {
            route = route.replace(escapeRegExp, '\\$&')
                       .replace(optionalParam, '(?:$1)?')
                       .replace(namedParam, function(match, optional){
                         return optional ? match : '([^\/]+)';
                       })
                       .replace(splatParam, '(.*?)');
            return new RegExp('^' + route + '$');
        },

        _stripRoot: function (pathname) {
            var root;
            if (!this.root) {
                return pathname;
            }

            root = this.root.replace(trailingSlash, '');
            if (pathname.indexOf(root) === 0) {
                pathname = pathname.substr(root.length);
            } else {
                pathname = void 0;
            }

            return pathname;
        },

        _backboneEvents: function () {
            if (!this.Backbone || this._backboneEventsAugmented) {
                return this;
            }

            augment(this, Backbone.Events);
            this._backboneEventsAugmented = true;
        },

        _bindPopState: function () {
            var self = this;

            this._popstateListener = window.addEventListener('popstate', function (e) {
                self._loadUrl(e.state);
            });
        },

        _bindRoutes: function () {
            var routes;
            if (!this.routes || this._routesBound) {
                return this;
            }

            routes = isFunction(this.routes) ? this.routes() : this.routes;
            for (var k in this.routes) {
                this.route(k, this.routes[k]);
            }
            this._routesBound = true;

            return this;
        },

        _isNewUrl: function () {
            var currentParams = this._getParams(),
                prevParms = this._getParams(this._lastUrl);
            if (!this.onNewUrlOnly) {
                return true;
            }

            for (var k in currentParams) {
                if (currentParams[k] !== prevParams[k]) {
                    return true;
                }
            }

            return window.location.pathname !== this._lastUrl.pathname;
        },

        _loadUrl: function (state) {
            var handlers = this._handlers,
                routePathName = this._stripRoot(window.location.pathname),
                len = routePathName ? handlers.length : 0;

            state = state || {};
            len = this._isNewUrl() ? len : 0;
            for (var i = 0; i < len; i++) {
                if (handlers[i].route.test(routePathName)) {
                    handlers[i].callback(state);
                    this._lastUrl = { pathname: window.location.pathname, search: window.location.search };
                    break;
                }
            }

            return this;
        }

    };

    if (window.define && isFunction(window.define)) {
        window.define(hermes);
    } else {
        window.hermes = hermes;
    }
})(this);