(function () {
var suite = new Skeleton('Mason.js'),
    objToString = Object.prototype.toString,
    getObjType = function (item) {
      return objToString.call(item);
    },
    isDocFrag = function (item) {
      return getObjType(item) === '[object DocumentFragment]';
    };

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
            assert(sandbox.innerHTML === '<div>Hello World!</div>');
          }
        }
      }
    }
  }
    // 'can parse an HTML fragment': '',
    // 'can parse an array of HTMLNodes/Objects': '',
    // 'can parse an HTMLNode/Object': '',
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
  // }
});

suite.exportTo('Mocha');
}());