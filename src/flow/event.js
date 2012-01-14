/// event.js --- General event handling + bubbling
//
// Copyright (c) 2011 Quildreen Motta
//
// Permission is hereby granted, free of charge, to any person
// obtaining a copy of this software and associated documentation files
// (the "Software"), to deal in the Software without restriction,
// including without limitation the rights to use, copy, modify, merge,
// publish, distribute, sublicense, and/or sell copies of the Software,
// and to permit persons to whom the Software is furnished to do so,
// subject to the following conditions:
//
// The above copyright notice and this permission notice shall be
// included in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
// EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
// NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
// LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
// OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
// WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

/// Module khaos.flow.event

//// - Dependencies
var Base = require('boo').Base
var type = require('../type')

//// - Aliasing
var keys       = Object.keys
var callable_p = type.callable_p
var str_p      = type.str_p



//// Data DROP
// Used as a return value of a listener to indicate that the listener
// should be removed.
//
// DROP :: Object
var DROP = {}


///// Interface Filter
// Describes a subset objects that should have their events
// handled. This is used in conjunction with the {:obj:Handler} object
// for selectively dispatching an event callback.
//
// A filter may be:
//
// A predicate function:
//    The function will be given the object where the event
//    originated, and should return whether the filter passed or not.
//
// An array:
//     A list of all the event origins that are allowed by the
//     filter. Comparison is done through object identity.
//
// An object:
//     Similar to the array, but allows only a single origin.
//
// Any false value:
//     No filtering is done, the dispatching will always happen.
//
// Filter :: (Obj → Bool) | [Obj] | Obj | Falsy



//// - Helpers
// These functions are provided as a nice abstraction of their
// underlying concepts. Use them wisely, dear padawan.

///// Function make_handler
// Constructs or initialises a Handler.
//
// make_handler :: a:Handler -> a
// make_handler :: Fun, Filter -> Handler
function make_handler(fun, filter) {
  return fun.exec?  Handler.init.call(fun, fun.fun, filter)
  :                 Handler.make(fun, filter) }


///// Function make_event
// Constructs or initialises an Event.
//
// make_event :: a:Event -> a
// make_event :: String, Eventful -> Event
function make_event(event, target) {
  return str_p(event)?  Event.make(target, event)
  :                     event }


///// Function each
// Calls a function for each key in the object.
//
// each :: {String -> [Handler]}, (String -> Undefined) -> Undefined
function each(object, callback) {
  keys(object).forEach(function(key) {
    callback(key, object[key], object) })}


///// Function searchable_p
// Tests if an object implements an `indexOf' method.
//
// searchable_p :: Any -> Bool
function searchable_p(subject) {
  return subject
  &&     typeof subject.indexOf == 'function' }


///// Function listeners
// Returns a list of listeners for the given event type.
//
// If the event type isn't defined yet, it's also *initialised* to an
// empty array.
//
// listeners! :: Eventful, String -> [Handler]
function listeners(eventful, type) {
  return eventful.listeners[event]
  ||    (eventful.listeners[event] = []) }



//// Object Event
// Stores information about the event that was generated in the system,
// and allows this event to be manipulated — propagated or stopped as
// one sees fit.
//
// Events will bubble all the way up, unless they are handled before
// that. Events can also be halted (which implies being handled), so
// that we won't try to call any other callback for that event.
//
// Event :: { "target"  -> Eventful
//          , "current" -> Eventful
//          , "type"    -> String
//          , "halted"  -> Bool
//          , "handled" -> Bool
//          }
var Event = Base.derive({
  ///// Function init
  // Initialises an Event's instance
  //
  // init :: @this:Object, String, Eventful -> this
  init:
  function _init(type, target) {
    this.type    = type
    this.target  = target
    this.current = target
    this.halted  = false
    this.handled = false
    return this }


  ///// Function halt
  // Immediately stops any processing and bubbling for this event.
  //
  // halt :: @this:Eventful, () -> this
, halt:
  function _halt() {
    this.halted = true
    this.handle()
    return this }


  ///// Function handle
  // Stops further bubbling for this event.
  //
  // handle :: @this:Eventful, () -> this
, handle:
  function _handle() {
    this.handled = true
    return this }


  ///// Function bubble
  // Continues the processing of this event by executing the event
  // handlers defined in the parent object of the current context, if
  // any.
  //
  // bubble :: @this:Eventful, () -> this
, bubble:
  function _bubble(args) {
    if (this.current) {
      this.current = this.current.parent
      this.current.trigger.apply(this.current, args) }
    return this }
})



//// Object Handler
// A `Handler' is a simple wrapper over an event callback that's meant
// to save state, and abstract a bit of the conditional delegation
// through arbitrary filters (as defined by the `Filter' interface).
//
// Handler :: { "fun"    -> Fun
//            , "filter" -> Filter
//            }
var Handler = Base.derive({
  ///// Function init
  // Initialises a Handler's instance.
  //
  // init :: @this:Object, Fun, Filter -> this
  init:
  function _init(fun, filter) {
    this.fun    = fun
    this.filter = filter
    return this }


  ///// Function can_exec_p
  // Checks whether the handler should be executed, taking into account
  // the handler's `filter' and the object originating the event.
  //
  // can_exec_p :: Eventful -> Bool
, can_exec_p:
  function _can_exec_p(origin) {
    var filter = this.filter

    return !filter?                true
    :      callable_p(filter)?     filter(origin)
    :      searchable_p(filter)?   !~filter.indexOf(origin)
    :                              filter === origin }


  ///// Function exec
  // If the `filter' allows events from the event's target, returns
  // whatever the callback returns.
  //
  // exec :: Event, Any... -> Any
, exec:
  function _exec(event) {
    var origin = event.target

    return this.can_exec_p(origin)?  this.fun.apply(origin, arguments)
    :                                null }
})



//// Object Eventful
// The base event emiter, that implements a bubbling event model.
//
// Each `Eventful' instance is a single-parented object. Once an event
// happens in one `Eventful' instance, the object is set as the current
// context.
//
// The contexts will have each its turn to try and handle the event. For
// such, they'll fire all the listeners attached for that event and
// expect them to do some processing.
//
// If a context cant handle the event — none of the handlers call the
// `Event.handle' method — then this event is reissued to the parent of
// the current context.
//
// :see also:
//   - `Event.bubble': Describes bubbling at the `Event' level.
//
// Eventful :: { "listeners" -> { String -> [Handler] }
//             , "parent"    -> Eventful
//             }
var Eventful = Base.derive({
  listeners: {}

  ///// Function init
  // Initialises an Eventful instance.
  //
  // init :: @this:Object, Eventful? -> this
, init:
  function _init(parent) {
    this.listeners = {}
    this.parent    = parent
    return this }


  ///// Function on
  // Adds a handler for the given event.
  //
  // on :: @Eventful, String, Fun, Filter? -> Handler
  // on :: @Eventful, String, a:Handler, Filter? -> a
, on:
  function _on(event, handler, filter) {
    handler = make_handler(handler, filter)
    listeners(this, event).push(handler)
    return handler }


  ///// Function once
  // Adds a handler for the given event, but calls it at most once.
  //
  // once :: @Eventful, String, Fun, Filter? -> Handler
  // once :: @Eventful, String, a:Handler, Filter? -> a
, once:
  function _once(event, handler, filter) {
    var fun
    handler     = this.on(event, handler, filter)
    fun         = handler.fun
    handler.fun = function() {
      fun.apply(this, arguments)
      return DROP }

    return handler }


  ///// Function remove
  // Removes one or more event listeners.
  //
  // The parameters given act as filters for which handlers should be
  // removed.
  //
  // If `event' is a String, only the handlers for that event will be
  // removed.
  //
  // If `handler' is given, only the handlers matching the given one (by
  // identity) will be removed.
  //
  // remove :: @this:Eventful, String?, Handler? -> this
, remove:
  function _remove(event, handler) {
    var self = this

    event?  this.listeners[event] = all_but(handler)
    :       each(this.listeners, clean)
    return this

    function keep_p(hd)  { return handler && handler !== hd             }
    function all_but(hd) { return listeners(self, event).filter(keep_p) }
    function clean(ev)   { return self.remove(ev, handler)              }}


  ///// Function trigger
  // Notifies the `Eventful' object of the given event.
  //
  // The `trigger' method may be used to initiate an event, if a
  // `String' is given, or to reissue a previous event, passing the
  // `Event' object along.
  //
  // In the first case, a new `Event' instance is created, which can be
  // later used for bubbling.
  //
  // trigger :: @this:Eventful, String, Any... -> this
  // trigger :: @this:Eventful, Event, Any... -> this
, trigger:
  function _trigger(event) {
    event        = make_event(event, this)
    arguments[0] = event

    this.listeners[event.type] = filter(listeners(this, event.type))
    if (!event.handled)  event.bubble(arguments)
    return this

    function keep_p(value) { return value !== DROP }
    function filter(hooks) {
      var result = []
      hooks.every(function(handler) {
        if (keep_p(handler.exec.apply(handler, arguments)))
          result.push(handler)
        return !event.halted })

      return result }}
})


//// - Exports
module.exports = { DROP     : DROP
                 , Event    : Event
                 , Handler  : Handler
                 , Eventful : Eventful

                 , internal : { make_handler : make_handler
                              , make_event   : make_event
                              , each         : each
                              , searchable_p : searchable_p
                              , listeners    : listeners }
                 }