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

// First batch - Part Two
suite.addBatch({
  'A standard non-module tag (&lt;p&gt;)': {
    topic: function () {
      return '<p id="hello">World</p>';
    },
    'parsed by Mason': {
      topic: function (tag) {
        return Mason(tag);
      },
      // TODO: Get a properly working 'before' which cleans out past items from the sandbox
      'returns an item which functions normally': function (docFrag) {
        var sandbox = document.getElementById('TESTsandbox');
        sandbox.appendChild(docFrag);

        var tag = document.getElementById('hello');
        assert(tag);
        assert(tag.nodeName.toLowerCase() === 'p');
        assert(tag.innerHTML === 'World');
      }
    }
  },
  'A non-standard non-module tag (&lt;dance&gt;)': {
    topic: function () {
      return '<dance id="everybody">dance</dance>';
    },
    'parsed by Mason': {
      topic: function (tag) {
        return Mason(tag);
      },
      'returns an item which functions normally': function (docFrag) {
        var sandbox = document.getElementById('TESTsandbox');
        sandbox.appendChild(docFrag);

        var tag = document.getElementById('everybody');
        assert(tag);
        assert(tag.nodeName.toLowerCase() === 'dance');
        assert(tag.innerHTML === 'dance');
      }
    }
  },
  'A standard module tag (&lt;table&gt;)': {
    topic: function () {
      Mason.addModule('table', function () {
        // TODO: Write out module
      });
      return '<table id="myTable">round</table>';
    },
    'parsed by Mason': {
      topic: function (tag) {
        return Mason(tag);
      },
      'returns an item which functions normally': function (docFrag) {
        var sandbox = document.getElementById('TESTsandbox');
        sandbox.appendChild(docFrag);

        var tag = document.getElementById('myTable');
        assert(tag);
        assert(tag.nodeName.toLowerCase() === 'table');
        assert(tag.innerHTML === 'round');
      }
    }
  },
  'A non-standard module tag (&lt;spring&gt;)': {
    topic: function () {
      Mason.addModule('spring', function () {
        // TODO: Write out module
      });
      return '<spring id="sproing">sprung</spring>';
    },
    'parsed by Mason': {
      topic: function (tag) {
        return Mason(tag);
      },
      'returns an item which functions normally': function (docFrag) {
        var sandbox = document.getElementById('TESTsandbox');
        sandbox.appendChild(docFrag);

        var tag = document.getElementById('sproing');
        assert(tag);
        assert(tag.nodeName.toLowerCase() === 'spring');
        assert(tag.innerHTML === 'sprung');
      }
    }
  }
});

// Second batch: Intermediate
suite.addBatch({
  'an onclick attribute in HTML on a normal tag': {
    'should stay in rendering': {
      'and work properly after': ''
    }
  },
  'an onclick attribute in HTML on a custom tag': {
    'should stay in rendering': {
      'and work properly after': ''
    }
  },
  'when use modules is disabled': {
    'and a would-be custom tag is being rendered': {
      'it is rendered as a normal tag': ''
    }
  }
});

// Third batch: Advanced
suite.addBatch({
  'A custom module (square)': {
    'when used': {
      topic: function () {
        var squareStr = '<square id="TESTsquare" color="blue">\
        \
        </square>',
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
        var $square = new DOMNormalizer(square),
            lastColor = square.value.color;

        $square.trigger('scramblecolor');

        assert(square.value.color !== lastColor);
      },
      'supports direct non-standard methods': function (square) {
        assert(square.value.color !== 'green');
        assert(square.color);

        square.color('green');

        assert(square.value.color === 'green');
      },
      'fires custom events': function (square) {
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