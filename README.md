Synopsis
========
Mason.js is a HTML power tool that generates robust UI elements from custom HTML/HTML strings. UI elements are defined by an extremely open module system that allows for triggering custom UI events, custom element values (no more .selectedIndex .value), and directly attaching methods to the DOM (e.g. dropdown.close).

Mason.js was initially constructed and intended for browser-side JavaScript applications but can be for static page applications as well.

How it works
============
Mason is a standalone function that takes in either an HTML string, object representing a DOM interpretation of an HTML string, or array of these objects.

The function converts the HTML string into a DOM representation and reads through the nodes listed there. If a tag is registered as a module (e.g. 'dropdown', 'help', 'input[type="datetime"]'), it will be run through that module's function. Otherwise, it will be processed as a normal HTML element. Once all the nodes are processed, a document fragment is returned containing all of the processed DOM nodes.

It is *strongly recommended* that if Mason.js is used while serving to an accessibility-oriented audience, then progressive enhancement should be used with standard HTML elements. See API -> Mason.processPage for more details.

Getting started
===============
I will finish this later. Sorry guys...

API
===============
I will finish this later. Sorry guys...