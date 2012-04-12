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
            assert(sandbox.innerHTML.match(/<div>Hello World!<\/div>/i));
          }
        }
      }
    }
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
suite.addBatch({
  'A custom module (square)': {
    'when used': {
      topic: function () {
        // TODO: Include some line breaks and carriage returns for realism
        var squareStr = '<square id="TESTsquare" color="blue"></square>',
            docFrag = Mason(squareStr);
        sandbox.appendChild(docFrag);
        var square = document.getElementById('TESTsquare');
        return square;
      },
      'creates the expected item': function (square) {
        assert(square);
      },
      'has a non-standard value (object)': function (square) {
        assert(typeof square.value === 'object');
      },
      'reacts to custom events': function (square) {
        var $square = new DOMNormalizer(square);

        assert(square.value.color !== 'red');
        $square.trigger('setcolor', 'red');

        assert(square.value.color !== 'red');
      },
      'supports direct non-standard methods': function (square) {
        assert(square.value.color !== 'green');
        assert(square.color);

        square.color('green');

        assert(square.value.color === 'green');
      },
      'fires custom events': function (square) {
        // TODO: This may require async failing
        var eventOccurred = false,
            $square = new DOMNormalizer(square);

        assert(square.value.color !== 'magenta');

        $square.on('colorchange', function () {
          eventOccurred = true;
        });

        square.color('magenta');

        assert(eventOccurred);
      }
    }
  }
});

suite.exportTo('Mocha');
}());