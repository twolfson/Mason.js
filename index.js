(function () {
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
      len = htmlArr.length;

  // Iterate each node in the HTML array
  for (; i < len; i++) {
    node = htmlArr[i];
    nodeType = node.nodeType;

    // Based on the type of the node
    switch (nodeType) {
      case 'tag':
        tagName = node.tagName;
        // TODO: If the tagName is in the map of modules
        if (false) {
          // Render it via that method
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

// Get the insertion area
var insertArea = document.getElementById('insertArea'),
    // Create an array of "HTML elements" to render
    // TODO: A plaintext HTML interpretter will come later -- maybe borrowed from another project
    htmlArr = [{
      'nodeType': 'tag',
      'tagName': 'button',
      'childNodes': [{
        'nodeType': 'text',
        'textContent': 'I am a button!'
      }]
      // 'menubutton': {
        // 'childNodes': [{
          // 'nodeType': 'tag', // TODO: Use real constant
          // 'tagName': 'button',
          // 'childNodes': [{
            // 'nodeType': 'text',
            // 'textContent': 'First button'
          // }]
        // }, {
          // 'nodeType': 'tag',
          // 'tagName': 'button',
          // 'childNodes': [{
            // 'nodeType': 'text',
            // 'textContent': 'Second button'
          // }]
        // },{
          // 'nodeType': 'tag',
          // 'tagName': 'button',
          // 'childNodes': [{
            // 'nodeType': 'text',
            // 'textContent': 'Third button'
          // }]
        // }]
      // }
    }],
    // Render the HTML elements into a document fragment
    htmlFrag = Mason(htmlArr);

// Append the fragment
// TODO: onexpand bindings, onclick binding for menu button as a whole [triggers will be set up by Mason]
// TODO: These triggers and such will automatically be done with the modules that have been mixed in to Mason
insertArea.appendChild(htmlFrag);
}());