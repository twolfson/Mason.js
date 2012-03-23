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
  'multibutton': function (buttonNode) {
    // Collect the child nodes and their lengths
    var childNodes = buttonNode.childNodes || [],
        buttonNode,
        buttonNodeChildren,
        button,
        buttonChildren,
        i = 0
        len = childNodes.length;

    // If there are no children or the first child node is not a button, throw an error
    if (len < 1 || childNodes[0].tagName !== 'button') {
      throw new Error('multibutton requires at least 1 child button node');
    }

    // Create a containing div for the buttons
    var container = document.createElement('div');

    // Iterate the child nodes
    for (; i < len; i++) {
      buttonNode = childNodes[i];

      // If the child node is not a button, throw an error
      if (buttonNode.nodeType === 'tag' && buttonNode.tagName !== 'button') {
        throw new Error('multibutton requires that all child nodes are buttons');
      }

      // Create a button node
      button = document.createElement('button');
      buttonNodeChildren = buttonNode.childNodes;

      // If there are child nodes
      if (buttonNodeChildren) {
        // Render them and append them to the button
        buttonChildren = Mason(buttonNodeChildren)
        button.appendChild(buttonChildren);
      }

      // Append the button node to the container
      container.appendChild(button);
    }

    // Return the container
    return container;
  }
});

// Proof of concept (Advanced): Add in new event triggers corresponding to the UI element

// Get the insertion area
var insertArea = document.getElementById('insertArea'),
    // Create an array of "HTML elements" to render
    // TODO: A plaintext HTML interpretter will come later -- maybe borrowed from another project
    htmlArr = [{
      'nodeType': 'tag',
      'tagName': 'multibutton',
      'childNodes': [{
        'nodeType': 'tag', // TODO: Use real constant
        'tagName': 'button',
        'childNodes': [{
          'nodeType': 'text',
          'textContent': 'First button'
        }]
      }, {
        'nodeType': 'tag',
        'tagName': 'button',
        'childNodes': [{
          'nodeType': 'text',
          'textContent': 'Second button'
        }]
      },{
        'nodeType': 'tag',
        'tagName': 'button',
        'childNodes': [{
          'nodeType': 'text',
          'textContent': 'Third button'
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