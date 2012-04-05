(function () {
var suite = new Skeleton('Mason.js'),
    objToString = Object.prototype.toString,
    getObjType = function (item) {
      return objToString.call(item);
    },
    isDocFrag = function (item) {
      return getObjType(item) === '[object DocumentFragment]';
    },
    sandbox = document.getElementById('TESTsandbox');

// First batch: Basics
suite.addBatch({
  'Mason': {
    topic: function () {
      return Mason;
    },
    'is a function': function (Mason) {
      assert(typeof Mason === 'function');
    }
  },
  'An XML string': {
    topic: function () {
      var xmlString = '<div>Hello World!</div>';
      return xmlString;
    },
    'when parsed by Mason': {
      topic: function (xmlString) {
        var retVal = Mason(xmlString);
        return retVal;
      },
      'returns an item': {
        'which when appended to the DOM': {
          topic: function (docFrag) {
            var sandbox = document.getElementById('TESTsandbox');
            sandbox.appendChild(docFrag);
            return sandbox;
          },
          'contains the expected child nodes': function (sandbox) {
            assert(sandbox.innerHTML.indexOf('<div>Hello World!</div>') >= 0);
          }
        }
      }
    },
  },
  'can parse an HTML fragment': '',
  'can parse an array of HTMLNodes/Objects': '',
  'can parse an HTMLNode/Object': ''
});

// Second batch: Intermediate
suite.addBatch({
  // 'if a method doesnt exist': {
    // 'should gracefully degrade to normal': ''
  // },
  // 'if a method doesnt exist': {
    // 'and the tag normally does not exist': {
      // 'should gracefully degrade to normal': ''
    // }
  // },
  // 'an onclick attribute in HTML on a normal tag': {
    // 'should stay in rendering': {
      // 'and work properly after': ''
    // }
  // },
  // 'an onclick attribute in HTML on a custom tag': {
    // 'should stay in rendering': {
      // 'and work properly after': ''
    // }
  // },
  // 'when use modules is disabled': {
    // 'and a would-be custom tag is being rendered': {
      // 'it is rendered as a normal tag': ''
    // }
  // }
});

// Third batch: Advanced
// TODO: TEST ME FIRST
suite.addBatch({
  'A custom module (dropdown)': {
    'when used': {
      topic: function () {
        // TODO: Include some line breaks and carriage returns for realism
        var dropdownStr = '<dropdown id="TESTdropdown"><text>My Dropdown</text><option>Option 1</option><option>Option 2</option><option>Option 3</option></dropdown>',
            docFrag = Mason(dropdownStr);
        sandbox.appendChild(docFrag);
        var dropdown = document.getElementById('TESTdropdown');
        return dropdown;
      },
      'creates the expected item': function (dropdown) {
        assert(dropdown);
      },
      // TODO: Add listeners to dropdown OR use tabs
      'reacts to custom events': 'a' || function (dropdown) {
        var $dropdown = new DOMNormalizer(dropdown),
            list = dropdown.getElementsByTagName('ul')[0];

        assert(list.style.display === 'none');
        $dropdown.trigger('expand');

        assert(list.style.display !== 'none');
      },
      'fires custom events': 'TODO: Figure out how to do the "click". Probably need a Selenium =/',
      'has a non-standard value (array)': '',
      'has a direct non-standard methods': function (dropdown) {
        var list = dropdown.getElementsByTagName('ul')[0];

        // Make sure there is a expand and collapse function
        assert(dropdown.expand);
        assert(dropdown.collapse);

        // Collapse the dropdown and make sure it worked
        dropdown.collapse();
        assert(list.style.display === 'none');

        // Expand the dropdown and make sure it worked
        dropdown.expand();
        assert(list.style.display !== 'none');

        // Double verify the collapse
        dropdown.collapse();
        assert(list.style.display === 'none');
      }
    }
  }
});

suite.exportTo('Mocha');
}());