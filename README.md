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

For now, here is a quick and dirty copy from the source file:

Mason
-----
 * Mason function that takes arrays of HTML objects and converts them into HTMLElements
 * @param {String|Object|Object[]} htmlArr String of HTML, single HTML objects, or array of HTML objects to convert
 * @param {Number} htmlArr[i].nodeType Numeric constant representing nodeType
 * @param {String} [htmlArr[i].nodeValue] If the nodeType is a text node, this will be the text returned
 * @param {String} [htmlArr[i].nodeName] If the nodeType is a tag, this will be the tag created. If the tag is a module, it will be created there
 * @param {Object} [htmlArr[i].attributes] If the nodeType is a tag and not a module, these will be the attributes to apply to the node
 * @param {Object} [htmlArr[i].attributes[j].nodeName] Name of the attribute to set
 * @param {Object} [htmlArr[i].attributes[j].nodeValue] Value of the attribute to set
 * @param {Object[]} [htmlArr[i].childNodes] If the nodeType is a tag and not a module, these will be the children nodes to append to this node
 * @param {Object} [options] Options for Mason to render with
 * @param {Boolean} [options.useModules=true] Flag to use modules while parsing
 * @param {Boolean} [options.returnFirst=false] Flag to return the first item without the document fragment wrapping

Mason.addModule
---------------
 * Add module method for Mason
 * @param {String} name Name of the module to set up for Mason
 * @param {Function} fn Function that will render a document fragment/HTMLElement
 * @returns {Function} Returns Mason

Mason.addModuleBatch
--------------------
 * Batch add module method for Mason
 * @param {Object} module Object containing key value pairs of tags and their respective functions
 * @param {Function} module.* Function that will render a document fragment/HTMLElement. The key that this is stored under will affect what tags it renders to.
 * @returns {Function} Returns Mason

Mason.setAttributes
-------------------
 * Static method to set attributes from an HTML object onto an element
 * @param {HTMLElement} elt Element to set attributes on
 * @param {Object} node HTML object to set attributes from.
 * @param {Object[]} node.attributes Array of attribute objects to set. If not specified, node becomes promoted to attributes itself
 * @param {String} node.attributes[i].nodeName Name of the attribute to set
 * @param {String} node.attributes[i].nodeValue Value of the attribute to set

Mason.appendChildren
--------------------
 * Static method to create and append child nodes from an HTML object onto an element
 * @param {HTMLElement} elt Element to set attributes on
 * @param {Object} node HTML object to set attributes from.
 * @param {Object[]} node.childNodes Array of HTML objects to render and append to the element. If not specified, node falls back as childNodes
 * @param {Object} options See Mason options parameter

Mason.parseXML - Not intended for public use (see source)
----------------------------

Mason.mergeNode - Not intended for public use (see source)
----------------------------------------------------------

Mason.createNode
----------------
 * Sugar method for creation of a new node
 * @param {String} nodeName Name of the node to create
 * @param {Object} [baseNode] Optional baseNode to collect attributes and childNodes from
 * @returns {Object} Returns HTML node for easy .setAttribute-ing

Tested in
=========
- FF 10
- Chrome Latest
- IE 7
- [Test it in your browser](http://twolfson.github.com/Mason.js/src-test/Mason.test.html)

Etymology
=========
A [mason](http://en.wikipedia.org/wiki/Mason) can refer to many different crafts but in the end, they all tie back to construction. Mason.js is a tool that is intended to allow you to build your set of materials (UI elements) and re-use that palette over and over at no penalty to construct beautiful buildings (websites).