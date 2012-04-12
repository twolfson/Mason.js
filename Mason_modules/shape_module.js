(function () {
Mason.addModule('square', function (square) {
  // Create our square
  var state = {'color': 'red'},
      retSquare = document.createElement('div'),
      $retSquare = new DOMNormalizer(retSquare),
      attrs = square.attributes,
      attr,
      attrName,
      i = 0,
      len = attrs.length;

  // Set the styles for the square
  var squareStyle = retSquare.style;
  squareStyle.width = '100px';
  squareStyle.height = '100px';
  squareStyle.border = '1px solid #000';

  // Set the value as the state
  retSquare.value = state;

  // Iterate the attributes of the square
  for (; i < len; i++) {
    attr = attrs[i];
    attrName = attr.nodeName;

    // If the attribute is a color, set it up in the state
    if (attrName === 'color') {
      state.color = attr.nodeValue;
    } else {
    // Otherwise, set it as a normal attribute
      retSquare.setAttribute(attrName, attr.nodeValue);
    }
  }

  // Render the square
  function render() {
    // If this is a color attribute, set one
    squareStyle.background = state.color;
  }
  render();

  // Set up custom methods
  function setColor(color) {
    var curColor = state.color;

    // If the new color is different from current color
    if (color !== curColor) {
      // Update the state
      state.color = color;

      // Fire a colorchange event
      $retSquare.trigger('colorchange', color);

      // Render the shape
      render();
    }
  }

  retSquare.color = function (color) {
    // If this is a getter request, return the current color
    if (color === undefined) {
      return state.color;
    }

    // Otherwise, update the color
    setColor(color);
  }

  // Set up a custom event listener for setColor events
  function generateColor() {
    var color = (Math.random() * 16777215) | 0,
        hexColor = color.toString(16),
        hexStr = '#' + hexColor;
    return hexStr;
  }

  $retSquare.on('scramblecolor', function () {
    var color = state.color;

    while (color === state.color) {
      color = generateColor();
    }

    setColor(color);
  });

  return retSquare;
});
}());