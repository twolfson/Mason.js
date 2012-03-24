(function () {
var ELEMENT_NODE_VAL = Node.ELEMENT_NODE,
    TEXT_NODE_VAL = Node.TEXT_NODE,
    DOCUMENT_NODE_VAL = Node.TEXT_NODE;

/**
 * Mason function that takes arrays of HTML objects and converts them into HTMLElements
 * @param {String|Object|Object[]} htmlArr String of HTML, single HTML objects, or array of HTML objects to convert
 * @param {Number} htmlArr[i].nodeType Numeric constant representing nodeType
 * @param {String} [htmlArr[i].nodeValue] If the nodeType is a text node, this will be the text returned
 * @param {String} [htmlArr[i].nodeName] If the nodeType is a tag, this will be the tag created. If the tag is a module, it will be created there
 * @param {Object} [htmlArr[i].attributes] If the nodeType is a tag and not a module, these will be the attributes to apply to the node
 * @param {Object[]} [htmlArr[i].childNodes] If the nodeType is a tag and not a module, these will be the children nodes to append to this node
 */
function Mason(htmlArr) {
  // If the input is a string
  if (typeof htmlArr === 'string') {
    // Parse it and grab the childNodes
    htmlArr = Mason.parseXML(htmlArr).childNodes;
  } else if (htmlArr.length === undefined) {
  // Otherwise, if the htmlArr is not an array
    // If the htmlArr is a document node, use the childNodes as the input
    if (htmlArr.nodeType === DOCUMENT_NODE_VAL) {
      htmlArr = htmlArr.childNodes;
    } else {
    // Otherwise, upcast it as an array
      htmlArr = [htmlArr];
    }
  }

  // Create a document fragment (collection of HTMLElements) to return
  var retFrag = document.createDocumentFragment(),
      node,
      nodeType,
      nodeName,
      elt,
      i = 0,
      len = htmlArr.length,
      modules = Mason.modules;

  // Iterate each node in the HTML array
  for (; i < len; i++) {
    node = htmlArr[i];
    nodeType = node.nodeType;
    elt = null;

    // Based on the type of the node
    switch (nodeType) {
      case ELEMENT_NODE_VAL:
        nodeName = node.nodeName;

        // If the nodeName is in the map of modules
        if (Mason.useModules && modules.hasOwnProperty(nodeName)) {
          // Render it via that method
          elt = modules[nodeName](node);
        } else {
        // Otherwise, create the element of the type
          elt = document.createElement(nodeName);

          // Set any attributes if available
          Mason.setAttributes(elt, node);

          // Create and append any children if available
          Mason.appendChildren(elt, node);
        }
        break;
      case TEXT_NODE_VAL:
        // Create a text node
        elt = document.createTextNode(node.nodeValue);
        break;
    }

    // If an element was created, append it to the collection
    if (elt) {
      retFrag.appendChild(elt);
    }
  }

  // Return the rendered fragment
  return retFrag;
}

// Static properties/methods for Mason
Mason.modules = {};

// Boolean for whether Mason should or should not use modules
Mason.useModules = true;

/**
 * Add module method for Mason
 * @param {String} name Name of the module to set up for Mason
 * @param {Function} fn Function that will render a document fragment/HTMLElement
 * @returns {Function} Returns Mason
 */
Mason.addModule = function (name, fn) {
  // Set up the module on Mason
  Mason.modules[name] = fn;

  // Return Mason for a fluent interface
  return Mason;
};

/**
 * Remove module method for Mason
 * @param {String} name Name of the module to remove from Mason
 * @returns {Function} Returns Mason
 */
// TODO: Write a test for this before enabling
// Mason.removeModule = function (name) {
  // // Remove the module from Mason
  // delete Mason.modules[name];

  // // Return Mason for a fluent interface
  // return Mason;
// };

/**
 * Batch add module method for Mason
 * @param {Object} module Object containing key value pairs of tags and their respective functions
 * @param {Function} module.* Function that will render a document fragment/HTMLElement. The key that this is stored under will affect what tags it renders to.
 * @returns {Function} Returns Mason
 */
Mason.addModuleBatch = function (module) {
  // Iterate the keys in the module
  var key;
  for (key in module) {
    if (module.hasOwnProperty(key)) {
      // Set each function to the static modules property (overloads pre-existing methods)
      Mason.addModule(key, module[key]);
    }
  }

  // Return Mason for a fluent interface
  return Mason;
};

/**
 * Batch remove module method for Mason
 * @param {Object} module Object containing modules that should be removed as keys
 * @returns {Function} Returns Mason
 */
// TODO: Write a test for this before enabling
// Mason.removeModuleBatch = function (module) {
  // // Iterate the keys in the module
  // var key;
  // for (key in module) {
    // if (module.hasOwnProperty(key)) {
      // // Remove each module from Mason
      // Mason.removeModule(key);
    // }
  // }

  // // Return Mason for a fluent interface
  // return Mason;
// };

/**
 * Method that enables modules for Mason
 * @returns {Function} Returns Mason
 */
Mason.enableModules = function () {
  Mason.useModules = true;
  return Mason;
};

/**
 * Method that disabled modules for Mason
 * @returns {Function} Returns Mason
 */
Mason.disableModules = function () {
  Mason.useModules = false;
  return Mason;
};

/**
 * Static method to set attributes from an HTML object onto an element
 * @param {HTMLElement} elt Element to set attributes on
 * @param {Object} node HTML object to set attributes from.
 * @param {Object[]} node.attributes Array of attribute objects to set. If not specified, node becomes promoted to attributes itself
 * @param {String} node.attributes[i].nodeName Name of the attribute to set
 * @param {String} node.attributes[i].nodeValue Value of the attribute to set
 */
Mason.setAttributes = function (elt, node) {
  var attributes = node.attributes || node || [],
      i = 0,
      len = attributes.length,
      attribute;

  for (; i < len; i++) {
    attribute = attributes[i];
    elt.setAttribute(attribute.nodeName, attribute.nodeValue);
  }
};

/**
 * Static method to create and append child nodes from an HTML object onto an element
 * @param {HTMLElement} elt Element to set attributes on
 * @param {Object} node HTML object to set attributes from.
 * @param {Object[]} node.childNodes Array of HTML objects to render and append to the element. If not specified, node falls back as childNodes
 */
Mason.appendChildren = function (elt, node) {
  var childNodes = node.childNodes || node,
      childFrag;
  if (childNodes !== undefined) {
    // Render the child nodes
    childFrag = Mason(childNodes);

    // and append them to this node
    elt.appendChild(childFrag);
  }
};

/**
 * String to XML Parser -- Attribution to jQuery for XML interpretter
 * @param {String} data String of XML to read through
 * @returns {Document} Document object containing the parsed XML
 */
// TODO: Reduce the overkill being done by this and potential side-effects of using XML
// Found potential issue: standalone attributes (e.g. selected)
Mason.parseXML = function (data) {
  var xml, tmp;
  try {
    if ( window.DOMParser ) { // Standard
      tmp = new DOMParser();
      xml = tmp.parseFromString( data , "text/xml" );
    } else { // IE
      xml = new ActiveXObject( "Microsoft.XMLDOM" );
      xml.async = "false";
      xml.loadXML( data );
    }
  } catch( e ) {
    xml = undefined;
  }

  if ( !xml || !xml.documentElement || xml.getElementsByTagName( "parsererror" ).length ) {
    throw new Error('Invalid XML: ' + data);
  }

  return xml;
}

/**
 * DOM normalizer for event bindings
 * @param {HTMLElement} elt Element to normalize for
 * @returns {Object<DOMNormalizer>} DOMNormalizer object with elt as the element to normalize for
 */
function DOMNormalizer(elt) {
  this.elt = elt;
}

/**
 * Static method for making events
 * @param {Object} options Options to specify with respect to the event
 * @param {String} [options.eventType='HTMLEvents'] Type of event to create
 */
DOMNormalizer.makeEvent = (function () {
  var createEvent = document.createEvent || document.createEventObject || function () { return {}; };
  return function (options) {
    // Fallback options
    options = options || {};

    // Grab the event type and create the event
    var eventType = options.eventType || 'HTMLEvents',
        // TODO: Test IE createEventObject
        event = createEvent.call(document, eventType);

    // Return the created event
    return event;
  };
}());

DOMNormalizer.prototype = (function () {
  // Determine what are the available event listener's
  var div = document.createElement('div'),
      onHandler = function (evtName, fn) {
        this.elt['on' + evtName] = fn;
      },
      offHandler = function (evtName) {
        this.elt['on' + evtName] = null;
      },
      triggerHandler = function (evtName) {
        // Create and init an event to trigger
        // TODO: Robustify init for Mouse and UIEvents
        var event = DOMNormalizer.makeEvent();
        event.initEvent(evtName, true, true);

        // Fire the event on the element
        var elt = this.elt,
            method = elt['on' + evtName];

        // If there is a method, trigger the event on the object
        if (method) {
          method.call(elt, event);
        }
      };

  // If there is an addEventListener handler
  if (div.addEventListener) {
    // Override onHandler
    onHandler = function (evtName, fn) {
      this.elt.addEventListener(evtName, fn, false);
    };
  } else if (div.attachEvent) {
  // Otherwise, if there is an attachEvent handler
    // Override onHandler
    onHandler = function (evtName, fn) {
      this.elt.attachEvent('on' + evtName, fn);
    };
  }

  // If there is an removeEventListener handler
  if (div.removeEventListener) {
    // Override offHandler
    offHandler = function (evtName, fn) {
      this.elt.removeEventListener(evtName, fn, false);
    };
  } else if (div.detachEvent) {
  // Otherwise, if there is an detachEvent handler
    // Override offHandler
    offHandler = function (evtName, fn) {
      this.elt.detachEvent('on' + evtName, fn);
    };
  }

  // If there is an dispatchEvent handler
  if (div.dispatchEvent) {
    // Override triggerHandler
    triggerHandler = function (evtName) {
      var event = DOMNormalizer.makeEvent();
      event.initEvent(evtName, true, true);
      this.elt.dispatchEvent(event);
    };
  } else if (div.fireEvent) {
  // Otherwise, if there is an fireEvent handler
    // Override triggerHandler
    // TODO: Test me
    triggerHandler = function (evtName) {
      var event = DOMNormalizer.makeEvent();
      this.elt.fireEvent(evtName, event);
    };
  }

  return {
    'on': onHandler,
    'off': offHandler,
    'trigger': triggerHandler
  };
}());


// Proof of concept (Advanced): Make a new foray of elements
// Proof of concept (Advanced): Add in new event triggers corresponding to the UI element
Mason.addModuleBatch({
  'dropdown': function (dropdown) {
    // Collect the child nodes and their lengths
    var childNodes = dropdown.childNodes || [],
        i,
        len = childNodes.length;

    // If there are no children or the first child node is not a button, throw an error
    if (len < 2 || childNodes[0].nodeName !== 'text') {
      throw new Error('dropdown requires at least 2 child nodes, the first of which is a "text" node');
    }

    // Create a containing div for the buttons
    var container = document.createElement('div'),
        headRow = document.createElement('div'),
    // Grab the first child node
        textNode = childNodes[0];

    // Override the textNode's type to a span
    textNode.nodeName = 'span';
    // Create its default text via Mason
    var defaultText = Mason(textNode);

    // Style the container
    headRow.setAttribute('style', 'padding: 0 5px; cursor: pointer;');
    container.setAttribute('style', 'border: 1px solid black; float: left;');

    // Create a 'caret' for the expand
    var caret = document.createElement('div'),
        caretText = document.createTextNode('v');
    caret.appendChild(caretText);
    caret.setAttribute('style', 'border-left: 1px solid black; margin-left: 5px; padding-left: 5px; float: right;');
    headRow.appendChild(caret);

    // Inject the default text into the container
    headRow.appendChild(defaultText);
    container.appendChild(headRow);

    // Create a ul for the dropdown
    var list = document.createElement('ul'),
        listItem,
        childNode,
        childFrag;

    // Remove default styling of the list
    list.setAttribute('style', 'list-item-style: none; border-top: 1px solid black; padding: 0 5px; margin: 0;');

    // Iterate the child nodes
    for (i = 1; i < len; i++) {
      childNode = childNodes[i];
      listItem = document.createElement('li');

      // Render the child node via Mason and append it to the list item
      childFrag = Mason(childNode);
      listItem.appendChild(childFrag);

      // Append the list item to the list
      list.appendChild(listItem);
    }

    // Set up state for the dropdown
    var isExpanded = false,
        // Render function for the dropdown
        render = function () {
          list.style.display = isExpanded ? '' : 'none';
        },
        $headRow = new DOMNormalizer(headRow),
        $dropdown = new DOMNormalizer(container);

    // When the head row is clicked on
    $headRow.on('click', function (e) {
      // Update the state
      isExpanded = !isExpanded;

      // and re-render the dropdown
      render();

      // Fire the expand/collapsed event
      $dropdown.trigger(isExpanded ? 'expand' : 'collapse');
    });

    // Render the dropdown now
    render();

    // Set any attributes for the container
    Mason.setAttributes(container, dropdown);

    // Append the list to the container
    container.appendChild(list);

    // Return the container
    return container;
  }
});

/*
  <dropdown id="dropdown">
    <text style="color: red; font-weight: bold;">My Dropdown</text>
    <a href="#first">First Link</a>
    <a href="#second">Second Link</a>
    <a href="#third">Third Link</a>
  </dropdown>
*/
// Get the insertion area
var insertArea = document.getElementById('insertArea'),
    htmlString = '<dropdown id="dropdown"><text style="color: red; font-weight: bold;">My Dropdown</text><a href="#first">First Link</a><a href="#second">Second Link</a><a href="#third">Third Link</a></dropdown>',
    // Render the HTML string into a document fragment
    htmlFrag = Mason(htmlString);
// Append the fragment
insertArea.appendChild(htmlFrag);

// Listen for expand events
var dropdown = document.getElementById('dropdown'),
    $dropdown = new DOMNormalizer(dropdown);
$dropdown.on('expand', function (e) {
  console.log('expand');
});
$dropdown.on('collapse', function (e) {
  console.log('collapse');
});
}());