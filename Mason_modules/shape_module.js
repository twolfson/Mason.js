(function () {
Mason.addModule('square', function (square) {
  // Create our square
  var state = {'color': 'red'},
      retSquare = document.createElement('div'),
      $retSquare = $(retSquare),
      attrs = square.attributes,
      attr,
      i = 0,
      len = attrs.length;

  // Set up all of the attribute
  Mason.setAttributes(retSquare, square);

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

    if (attr.nodeName === 'color') {
      state.color = attr.nodeValue;
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
  $retSquare.on('setcolor', setColor);

  return retSquare;
});
}());