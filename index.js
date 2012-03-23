(function () {
// TODO: Rename this to MasonFactory and move the static methods as prototypal methods
function Mason(htmlArr) {
  // Create a document fragment (collection of HTMLElements) to return
  var retFrag = document.createDocumentFragment(),
      node,
      nodeType,
      tagName,
      elt,
      childNodes,
      childFrag,
      i = 0,
      len = htmlArr.length,
      modules = Mason.modules;

  // Iterate each node in the HTML array
  for (; i < len; i++) {
    node = htmlArr[i];
    nodeType = node.nodeType;

    // Based on the type of the node
    switch (nodeType) {
      case 'tag':
        tagName = node.tagName;

        // TODO: If the tagName is in the map of modules
        if (modules.hasOwnProperty(tagName)) {
          // Render it via that method
          elt = modules[tagName](node);
        } else {
        // Otherwise, create the element of the type
          elt = document.createElement(tagName);

          // If it has any children
          childNodes = node.childNodes;
          if (childNodes !== undefined) {
            // Render the child nodes
            childFrag = Mason(childNodes);

            // and append them to this node
            elt.appendChild(childFrag);
          }
        }
        break;
      case 'text':
        // Create a text node
        elt = document.createTextNode(node.textContent);
        break;
    }

    // Append the element to the collection
    retFrag.appendChild(elt);
  }

  // Return the rendered fragment
  return retFrag;
}

// Static properties/methods for Mason
Mason.modules = {};

// TODO: Accept objects via addModules 'sugar' method
/**
 * Add module method for Mason
 * @param {Object} module Object containing key value pairs of tags and their respective functions
 * @param {Function} module.* Function that will render a document fragment/HTMLElement. The key that this is stored under will affect what tags it renders to.
 */
Mason.addModule = function (module) {
  // Iterate the keys in the module
  var modules = Mason.modules,
      key;
  for (key in module) {
    if (module.hasOwnProperty(key)) {
      // Set each function to the static modules property (overloads pre-existing methods)
      modules[key] = module[key];
    }
  }

  // TODO: Return this for a fluent interface
};

// TODO: Mason.removeModule

// TODO: Mason.clone?

// // Proof of concept (Simple): Make a button fancier
// Mason.addModule({
  // 'button': function (buttonNode) {
    // // Create the button
    // var button = document.createElement('button'),
        // childNodes = buttonNode.childNodes;
    // button.setAttribute('style', 'background: black; border: 0; color: white; box-shadow: 0px 0px 5px 5px skyblue; margin: 10px; cursor: pointer;');

    // // If there are any children
    // // TODO: Give a flag in the function or a static method for this
    // if (childNodes !== undefined) {
      // button.appendChild(Mason(childNodes));
    // }

    // return button;
  // }
// });

// Proof of concept (Advanced): Make a new foray of elements
Mason.addModule({
  'dropdown': function (dropdown) {
    // Collect the child nodes and their lengths
    var childNodes = dropdown.childNodes || [],
        i,
        len = childNodes.length;

    // If there are no children or the first child node is not a button, throw an error
    if (len < 2 || childNodes[0].tagName !== 'text') {
      throw new Error('dropdown requires at least 2 child nodes, the first of which is a "text" node');
    }

    // Create a containing div for the buttons
    var container = document.createElement('div'),
        headRow = document.createElement('div'),
    // Grab the first child node
        textNode = childNodes[0],
    // Create its default text via Mason
        defaultText = Mason(textNode.childNodes || []);

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
      // TODO: Auto-upcast non-arrays in Mason
      childFrag = Mason([childNode]);
      listItem.appendChild(childFrag);

      // Append the list item to the list
      list.appendChild(listItem);
    }

    // Set up state for the dropdown
    var isExpanded = false,
        // Render function for the dropdown
        render = function () {
          list.style.display = isExpanded ? '' : 'none';
        };

    // When the head row is clicked on
    // TODO: Move to .addEventListener
    headRow.onclick = function () {
      // Update the state
      isExpanded = !isExpanded;

      // and re-render the dropdown
      render();
    };

    // Render the dropdown now
    render();

    // Append the list to the container
    container.appendChild(list);

    // Return the container
    return container;
  }
});

// Proof of concept (Advanced): Add in new event triggers corresponding to the UI element

/*
  <dropdown>
    <text>My Dropdown</text>
    <a href="#">First Link</a>
    <a href="#">Second Link</a>
    <a href="#">Third Link</a>
  </dropdown>
*/
// Get the insertion area
var insertArea = document.getElementById('insertArea'),
    // Create an array of "HTML elements" to render
    // TODO: A plaintext HTML interpretter will come later -- maybe borrowed from another project
    htmlArr = [{
      'nodeType': 'tag',
      'tagName': 'dropdown',
      'childNodes': [{
        'nodeType': 'tag', // TODO: Use real constant
        'tagName': 'text',
        'childNodes': [{
          'nodeType': 'text',
          'textContent': 'My Dropdown'
        }]
      },{
        'nodeType': 'tag',
        'tagName': 'a',
        'childNodes': [{
          'nodeType': 'text',
          'textContent': 'First link'
        }]
      }, {
        'nodeType': 'tag',
        'tagName': 'a',
        'childNodes': [{
          'nodeType': 'text',
          'textContent': 'Second link'
        }]
      },{
        'nodeType': 'tag',
        'tagName': 'a',
        'childNodes': [{
          'nodeType': 'text',
          'textContent': 'Third link'
        }]
      }]
    }],
    // Render the HTML elements into a document fragment
    htmlFrag = Mason(htmlArr);

// Append the fragment
// TODO: onexpand bindings, onclick binding for menu button as a whole [triggers will be set up by Mason]
// TODO: These triggers and such will automatically be done with the modules that have been mixed in to Mason
insertArea.appendChild(htmlFrag);
}());