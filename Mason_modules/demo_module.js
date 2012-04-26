(function () {
function strictEquals(a, b) {
  return a === b;
}
function indexOf(arr, item, comparator) {
  comparator = comparator || strictEquals;
  var index = -1,
      i = 0,
      len = arr.length,
      arrItem;

  for (; i < len; i++) {
    if (comparator(item, arr[i])) {
      index = i;
      break;
    }
  }

  return index;
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
  var createFn = function () { return {}; };

  if (document.createEvent) {
    createFn = function (evtType) {
      return document.createEvent(evtType);
    };
  } else if (document.createEventObject) {
    // Before, we would do a .call on document.createEventObject however IE6 threw a hissy fit
    createFn = function (evtType) {
      return document.createEventObject(evtType);
    };
  }

  return function (options) {
    // Fallback options
    options = options || {};

    // Grab the event type and create the event
    var eventType = options.eventType || 'HTMLEvents',
        event = createFn(eventType);

    // Return the created event
    return event;
  };
}());

/**
 * Static list of events supported by IE6/7
 */
DOMNormalizer.stdEvts = ['activate', 'afterupdate', 'beforeactivate', 'beforecopy', 'beforecut', 'beforedeactivate', 'beforeeditfocus', 'beforepaste', 'beforeupdate', 'blur', 'cellchange', 'click', 'contextmenu', 'controlselect', 'copy', 'cut', 'dataavailable', 'datasetchanged', 'datasetcomplete', 'dblclick', 'deactivate', 'drag', 'dragend', 'dragenter', 'dragleave', 'dragover', 'dragstart', 'drop', 'errorupdate', 'filterchange', 'focus', 'focusin', 'focusout', 'help', 'keydown', 'keypress', 'keyup', 'layoutcomplete', 'losecapture', 'mousedown', 'mouseenter', 'mouseleave', 'mousemove', 'mouseout', 'mouseover', 'mouseup', 'mousewheel', 'move', 'moveend', 'movestart', 'page', 'paste', 'propertychange', 'readystatechange', 'readystatechange', 'resize', 'resizeend', 'resizestart', 'rowenter', 'rowexit', 'rowsdelete', 'rowsinserted', 'scroll', 'selectstart'];

/**
 * Static method to determine if an event is standard or not
 * @param {String} evt Name of the event to check on
 * @returns {Boolean} True if the event is standard, false otherwise
 */
DOMNormalizer.isStdEvt = function (evt) {
  var stdEvts = DOMNormalizer.stdEvts,
      isStd = !!~indexOf(stdEvts, evt);

  return isStd;
};

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

  function compareEvtObj(a, b) {
    return (a.name === b.name && a.fn === b.fn);
  }

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
      if (DOMNormalizer.isStdEvt(evtName)) {
        this.elt.attachEvent('on' + evtName, fn);
      } else {
        var evts = this.elt._events;
        if (evts === undefined) {
          evts = [];
          this.elt._events = evts;
        }
        evts.push({'name': evtName, 'fn': fn});
      }
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
      if (DOMNormalizer.isStdEvt(evtName)) {
        this.elt.detachEvent('on' + evtName, fn);
      } else {
        var evts = this.elt._events || [],
            index = indexOf(evts, fn, compareEvtObj);
        if (!!~index) {
          evts.splice(index, 1);
        }
      }
    };
  }

  // If there is an dispatchEvent handler
  if (div.dispatchEvent) {
    // Override triggerHandler
    triggerHandler = function (evtName) {
      var event = DOMNormalizer.makeEvent();
      event.initEvent(evtName, true, true);
      this.elt.dispatchEvent(event);
      // TODO: Check that property events are triggered
    };
  } else if (div.fireEvent) {
  // Otherwise, if there is an fireEvent handler
    // Override triggerHandler
    triggerHandler = function (evtName) {
      var elt = this.elt,
          event = DOMNormalizer.makeEvent();

      // If the event is standard, dispatch it normally
      if (DOMNormalizer.isStdEvt(evtName)) {
        elt.fireEvent('on' + evtName, event);
      } else {
      // Otherwise, go to the event emitter
        var evts = elt._events || [],
            i = 0,
            len = evts.length,
            evt;
        for (; i < len; i++) {
          evt = evts[i];
          if (evt.name === evtName) {
            evt.fn.call(elt, event);
          }
        }
        // TODO: Also trigger property events
        // TODO: Also bubble event
      }
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
    var frag = document.createElement('div'),
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
        '<div style="float: left; width: 50%">',
          '<div style="border: 1px solid black; margin: 0 5px;">',
            '<div style="background: #EEE; font-weight: bold; border-bottom: 1px solid black; padding: 5px;">',
              'Code',
            '</div>',
            '<div style="background: navy; color: white; padding: 5px; overflow: auto;">',
              '<code>~~~</code>',
            '</div>',
          '</div>',
        '</div>'
        ].join(''),
        code = Mason(codeHtml);

    // Set up the innerHTML
    // FIXME: Injecting directly inside of <code> broke things
    code.childNodes[0].innerHTML = code.childNodes[0].innerHTML.replace('~~~', xml);

    // Render a fragment for the demo and append it
    var demoContainerHtml = [
        '<div style="float: left; width: 50%;">',
          '<div style="border: 1px solid black; margin: 0 5px;">',
            '<div style="background: #EEE; font-weight: bold; border-bottom: 1px solid black; padding: 5px;">',
              'Result',
            '</div>',
            '<div style="padding: 5px;">',
            '</div>',
            '<div style="clear: both; padding-bottom: 5px;">',
            '</div>',
          '</div>',
        '</div>'
        ].join(''),
        demoContainer = Mason(demoContainerHtml),
        demoFrag = Mason(codedemo.childNodes);
    demoContainer.childNodes[0].childNodes[0].childNodes[1].appendChild(demoFrag);
    demo.appendChild(demoContainer);

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
        // Re-create the "text" node as a span
        var defaultText = Mason.createNode('span', childNode);

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

    // Set up methods for directly triggering events
    container.expand = function () {
      isExpanded = true;
      render();
    };

    container.collapse = function () {
      isExpanded = false;
      render();
    };

    // Append the list to the container
    container.appendChild(list);

    // Return the container
    return container;
  },
  'tabs': function (tabs) {
    // Collect the child nodes and their lengths
    var tabNodes = tabs.childNodes || [];

    // Filter out all textNodes
    tabNodes = Mason.filterTextNodes(tabNodes);

    // Set up the remaining variables
    var i = 0,
        len = tabNodes.length,
        tabNode,
        tabChildren,
        tabChildNode,
        nodeName;

    // If there are no children, throw an error
    if (len < 1) {
      throw new Error('tabs requires at least 1 child nodes');
    }

    var container = document.createElement('div'),
        $container = $(container),
        tabRow = document.createElement('div'),
        tabArr = [],
        tabIndex = 0,
        currentTab,
        Tab = function (index, head, content) {
          this.index = index;
          this.$head = $(head);
          this.$content = $(content);
        };

    // Set up the attributes of the container
    Mason.setAttributes(container, tabs);
    tabRow.className = 'tabRow';

    Tab.prototype = {
      'select': function () {
        var $head = this.$head;

        // Deselect the last tab
        currentTab.deselect();

        // Visually select the next tab
        $head.addClass('isSelected');
        this.$content.css('display', 'block');

        // Save the current tab
        container.value = this.index;
        container.currentTab = currentTab = this;

        // Fire an event
        $head.trigger('select', this);
      },
      'deselect': function () {
        var $head = this.$head;
        $head.removeClass('isSelected');
        this.$content.css('display', 'none');

        // Fire an event
        $head.trigger('deselect', this);
      }
    };

    // Function to change tabs
    container.changeTab = function (index) {
      // Select the tab and trigger an onchange event
      var tab = tabArr[index];
      tab.select();
      $container.trigger('change', tab);
    };

    // Append the tabRow to the container
    container.appendChild(tabRow);

    // Filter out textNodes from the tabs
    for (; i < len; i++) {
      (function (i) {
      var tabNode = tabNodes[i],
          tab,
          tabHead,
          tabContent,
          tabChildren = tabNode.childNodes || [],
          j = 0,
          len2 = tabChildren.length;

      // Create a head for the tab and content for the tab
      tabHead = document.createElement('div');
      tabHead.className = 'tabHead';
      tabContent = document.createElement('div');

      // Sub-interate the tab child nodes
      for (; j < len2; j++) {
        tabChildNode = tabChildren[j];
        nodeName = tabChildNode.nodeName;

        // If the nodeName is 'text'
        if (nodeName === 'text') {
          // Append its childNodes to the tabHead
          Mason.appendChildren(tabHead, tabChildNode);
        } else if (nodeName === 'content') {
        // Otherwise, if the nodeName is 'content', append its childNodes to the tabContent
          Mason.appendChildren(tabContent, tabChildNode);
        }
      }

      // Append the tabHead to the tabRow
      tabRow.appendChild(tabHead);

      // Hide the tabContent
      $(tabContent).css('display', 'none');

      // and the tabContent to the container
      container.appendChild(tabContent);

      // Create a tab object for bindings
      tab = new Tab(i, tabHead, tabContent);

      // When the tab head is clicked on, select it
      $(tabHead).on('click', function() {
        tab.select();
      });

      // Memoize the tab to the tabArr
      tabArr.push(tab);
      }(i));
    }

    // Change to the tab index
    currentTab = tabArr[tabIndex];
    currentTab.select();

    // Expose the amount of tabs
    container.tabLength = tabArr.length;

    return container;
  }
});

// Expost DOM normalizer for the sake of PoC
window.DOMNormalizer = DOMNormalizer;
}());