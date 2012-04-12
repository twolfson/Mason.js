(function () {
Mason.addModule('shape', function (shape) {
  // Create our shape
  var state = {'color': 'red', 'shape': 'square'},
      retShape = document.createElement('div'),
      attrs = shape.attributes,
      attr,
      i = 0,
      len = attrs.length;

  // By default, the shape is a square
  retShape.className = 'shape';

  // Iterate the attributes of the shape
  for (; i < len; i++) {
    attr = attrs[i];

    switch (attr.nodeName) {
      case 'color':
        state.color = attr.nodeValue;
        break;
      case 'shape':
        state.shape = attr.nodeValue;
        break;
    }
  }

  // Render the shape
  function render() {
    // If this is a color attribute, set one
    retShape.style.background = state.color;

    // If this is a shape attribute, set it as the class
    retShape.className = 'shape ' + state.shape;
  }
  render();

  // Set up custom methods
  retShape.color = function (color) {
    // If this is a getter request, return the current color
    if (color === undefined) {
      return state.color;
    }

    // Otherwise, update the color
    // TODO: Fire colorchange event
    state.color = color;
    render();
  }
  retShape.shape = function (shape) {
    // TODO: Fire colorchange event
    state.color = color;
    render();
  }

  return retShape;
});
}());