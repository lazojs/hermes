# hermes

A simple pushstate based client router.

## about hermes

Hermes is Backbone inspired client router for pushstate clients. Hermes was built
to support [hybrid web applications](https://blog.twitter.com/2012/implementing-pushstate-twittercom).

* Hermes is a simple object - I don't need no stinking constructors
* Hermes uses Backbone style route definitions
* Hermes always triggers a handler if a route is matched unless told otherwise - no more passing trigger for every single navigate
* Hermes accepts a state object
* Hermes sets the document title if one is passed when navigating and updates the title on popstate
* Hermes will optionally store references state objects in an internal cache (always stored in the history object)
* Hermes does not require Backbone, but will trigger Backbone events if a reference to Backbone is passed as an option on start

## API

When a route handler is called it is passed three arguments:

* pathname
* parameters object (contains named path parameters and the values from window.location.search [given precedence over path parameters])
* state object

### hermes.start(options)
Binds popstate handler and processes options.

```javascript
hermes.start({
   routes: {}, // routes table
   title: '', // title for current page
   state: {}, // state object for the current page
   cache: false, // keep cache of state objects in addition to those stored in the history
   routeNotMatched: function (routePathName) {
      // do something if a route is not matched, e.g., render 404 page
   }
}

});
```

### hermes.stop()
Unbinds popstate handler.

### hermes.route(route, name, callback)
Adds a route handler to Hermes.

### hermes.destroyRoutes()
Deletes route handlers.

### hermes.navigate(url, options)
Calls matching route handler if one is defined.

```javascript
hermes.navigate(url, {
    title: '', // page title to associate to url
    state: {}, // state object to associate to url
    trigger: true // execute route handler; default is true
});
```

### hermes.getItem(url)
Gets cached object for url.

### hermes.updateState(state, title, [url])
Updates the state object for the current url or the url specified. Url = window.location.pathname + window.location.search.

### hermes.clearCache()
Deletes cache object.

### herems.getPreviousUrl()
Gets the previous Url. Useful for looking up the previous page's cache item.