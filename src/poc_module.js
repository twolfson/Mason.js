(function () {
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
  'codedemo': function (codedemo) {
    // FIXME: This is reliant on using XML parser initially
    // Create a <code> node and a <div> for the demo
    var frag = document.createDocumentFragment(),
        demo = document.createElement('div'),
    // Get the XML used by the codedemo
        xml = codedemo.xml;

    // If the xml was not found, use an XmlSerializer
    if (xml === undefined) {
      xml = (new XMLSerializer()).serializeToString(codedemo);
    }

    // Remove the <codedemo> wrapping
    xml = xml.replace(/^<codedemo>[^\n]*\n/, '\n');
    xml = xml.replace(/\s*<\/codedemo>$/, '');
    xml = xml.replace(/\n      /g, '\n').replace(/^\n/, '');

    // Replace all HTML entities to proper HTML counterparts
    xml = xml.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br/>').replace(/\t/g, '  ').replace(/ /g, '&nbsp;');

    // Create a code node via Mason
    var codeHtml = [
        '<div style="border: 1px solid black; min-width: 50%; float: left; margin: 0 5px;">',
          '<div style="border-bottom: 1px solid black; padding: 5px;">',
            'Code',
          '</div>',
          '<div style="background: navy; color: white; padding: 5px;">',
            '<code>~~~</code>',
          '</div>',
        '</div>'
        ].join(''),
        code = Mason(codeHtml);

    // Set up the innerHTML
    // FIXME: Injecting directly inside of <code> broke things
    code.childNodes[0].innerHTML = code.childNodes[0].innerHTML.replace('~~~', xml);

    // Render a fragment for the demo and append it
    var demoFrag = Mason(codedemo.childNodes);
    demo.appendChild(demoFrag);

    // Append the code and demo to the fragment
    frag.appendChild(code);
    frag.appendChild(demo);

    // Return the generated fragment
    return frag;
  },
  'dropdown': function (dropdown) {
    // Collect the child nodes and their lengths
    var childNodes = dropdown.childNodes || [],
        i = 0,
        len = childNodes.length;

    // If there are no children, throw an error
    if (len < 1) {
      throw new Error('dropdown requires at least 1 child nodes');
    }

    // Create a containing div for the buttons
    var container = document.createElement('div'),
        headRow = document.createElement('div');

    // Style the container
    headRow.setAttribute('style', 'padding: 0 5px; cursor: pointer;');
    container.setAttribute('style', 'border: 1px solid black; float: left;');

    // Create a 'caret' for the expand
    var caret = document.createElement('div'),
        caretText = document.createTextNode('v');
    caret.appendChild(caretText);
    caret.setAttribute('style', 'border-left: 1px solid black; margin-left: 5px; padding-left: 5px; float: right;');
    headRow.appendChild(caret);

    // Place the head row inside of the container
    container.appendChild(headRow);

    // Create a ul for the dropdown
    var list = document.createElement('ul'),
        listItem,
        childNode,
        childFrag;

    // Remove default styling of the list
    list.setAttribute('style', 'list-style-type: none; border-top: 1px solid black; padding: 0 5px; margin: 0;');

    // Iterate the child nodes
    for (; i < len; i++) {
      childNode = childNodes[i];

      // If the node is a 'text' node, generate it as a part of the head row
      if (childNode.nodeName === 'text') {
        // Override the textNode's type to a span
        var spanNode = Mason.mergeNode(childNode, {'nodeName': 'span'}),
        // Create its default text via Mason
            defaultText = Mason(spanNode);

        // Insert the default text into the head row
        headRow.appendChild(defaultText);
      } else if (childNode.nodeType === Node.ELEMENT_NODE) {
      // Otherwise, if the node is a tag, generate a new list item
        listItem = document.createElement('li');

        // Render the child node via Mason and append it to the list item
        childFrag = Mason(childNode);
        listItem.appendChild(childFrag);

        // Append the list item to the list
        list.appendChild(listItem);
      }
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

// Expost DOM normalizer for the sake of PoC
window.DOMNormalizer = DOMNormalizer;
}());