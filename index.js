(function () {
function Mason(htmlObj) {
  var retFrag = document.createDocumentFragment(),
      div = document.createElement('div');
  div.innerHTML = 'Hey!';
  retFrag.appendChild(div);
  return retFrag;
}

// Get the insertion area
var insertArea = document.getElementById('insertArea'),
    // Create an HTML object to render
    // TODO: A plaintext HTML interpretter will come later -- maybe borrowed from another project
    preRenderHtml = [{
      'menubutton': {
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
      }
    }],
    // Render the JSON into a document fragment
    htmlFrag = Mason(preRenderHtml);

// Append the fragment
// TODO: onexpand bindings, onclick binding for menu button as a whole [triggers will be set up by Mason]
// TODO: These triggers and such will automatically be done with the modules that have been mixed in to Mason
insertArea.appendChild(htmlFrag);
}());