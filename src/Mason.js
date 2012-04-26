(function (name, definition) {
  var define = window.define,
      exports = window.exports,
      that = this || window;
  if (typeof define === 'function') {
    define(definition);
  } else if (typeof window.exports !== 'undefined') {
    exports[name] = definition;
  } else {
    that[name] = definition;
  }
}('Mason', (function () {
var Node = window.Node || {},
    ELEMENT_NODE_VAL = Node.ELEMENT_NODE || 1,
    TEXT_NODE_VAL = Node.TEXT_NODE || 3,
    DOCUMENT_NODE_VAL = Node.DOCUMENT_NODE || 9,
    DOCUMENT_FRAG_VAL = Node.DOCUMENT_FRAGMENT_NODE || 11;

/**
 * Mason function that takes arrays of HTML objects and converts them into HTMLElements
 * @param {String|Object|Object[]} htmlArr String of HTML, single HTML objects, or array of HTML objects to convert
 * @param {Number} htmlArr[i].nodeType Numeric constant representing nodeType
 * @param {String} [htmlArr[i].nodeValue] If the nodeType is a text node, this will be the text returned
 * @param {String} [htmlArr[i].nodeName] If the nodeType is a tag, this will be the tag created. If the tag is a module, it will be created there
 * @param {Object} [htmlArr[i].attributes] If the nodeType is a tag and not a module, these will be the attributes to apply to the node
 * @param {Object} [htmlArr[i].attributes[j].nodeName] Name of the attribute to set
 * @param {Object} [htmlArr[i].attributes[j].nodeValue] Value of the attribute to set
 * @param {Object[]} [htmlArr[i].childNodes] If the nodeType is a tag and not a module, these will be the children nodes to append to this node
 * @param {Object} [options] Options for Mason to render with
 * @param {Boolean} [options.useModules=true] Flag to use modules while parsing
 * @param {Boolean} [options.returnFirst=false] Flag to return the first item without the document fragment wrapping
 */
function Mason(htmlArr, options) {
  var nodeType = htmlArr.nodeType;
  // If the input is a string
  if (typeof htmlArr === 'string') {
    // Parse it and grab the childNodes
    htmlArr = Mason.parseXML(htmlArr).childNodes;
  } else if (nodeType !== undefined) {
  // Otherwise, if the htmlArr has a node type
    // and it is not a document or document fragment node, upcast it as an array
    if (nodeType !== DOCUMENT_NODE_VAL && nodeType !== DOCUMENT_FRAG_VAL) {
      htmlArr = [htmlArr];
    } else {
    // Otherwise, use the childNodes as the input
      htmlArr = htmlArr.childNodes;
    }
  }

  // Fallback and set up options for quick reference
  options = options || {};
  var useModules = options.hasOwnProperty('useModules') ? options.useModules : true,
      returnFirst = options.returnFirst;

  // Delete the returnFirst flag to prevent single node trees
  delete options.returnFirst;

  // Create a document fragment (collection of HTMLElements) to return
  var retFrag = document.createDocumentFragment(),
      node,
      nodeName,
      elt,
      i = 0,
      len = htmlArr.length,
      modules = Mason.modules;

  // Iterate each node in the HTML array
  for (; i < len; i++) {
    node = htmlArr[i];
    nodeType = node.nodeType;
    elt = null;

    // Based on the type of the node
    switch (nodeType) {
      case ELEMENT_NODE_VAL:
        nodeName = node.nodeName;

        // If the nodeName is in the map of modules
        if (useModules && modules.hasOwnProperty(nodeName)) {
          // Render it via that method
          elt = modules[nodeName](node);
        } else {
        // Otherwise, create the element of the type
          elt = document.createElement(nodeName);

          // Set any attributes if available
          Mason.setAttributes(elt, node);

          // Create and append any children if available
          Mason.appendChildren(elt, node, options);
        }
        break;
      case TEXT_NODE_VAL:
        // Create a text node
        elt = document.createTextNode(node.nodeValue);
        break;
    }

    // If an element was created, append it to the collection
    if (elt) {
      retFrag.appendChild(elt);
    }
  }

  // Return the rendered fragment
  var retVal = returnFirst && len > 0 ? retFrag.childNodes[0] : retFrag;
  return retVal;
}

// Static properties/methods for Mason
Mason.modules = {};

/**
 * Add module method for Mason
 * @param {String} name Name of the module to set up for Mason
 * @param {Function} fn Function that will render a document fragment/HTMLElement
 * @returns {Function} Returns Mason
 */
Mason.addModule = function (name, fn) {
  // Set up the module on Mason
  Mason.modules[name] = fn;

  // Return Mason for a fluent interface
  return Mason;
};

/**
 * Remove module method for Mason
 * @param {String} name Name of the module to remove from Mason
 * @returns {Function} Returns Mason
 */
// TODO: Write a test for this before enabling
// Mason.removeModule = function (name) {
  // // Remove the module from Mason
  // delete Mason.modules[name];

  // // Return Mason for a fluent interface
  // return Mason;
// };

/**
 * Batch add module method for Mason
 * @param {Object} module Object containing key value pairs of tags and their respective functions
 * @param {Function} module.* Function that will render a document fragment/HTMLElement. The key that this is stored under will affect what tags it renders to.
 * @returns {Function} Returns Mason
 */
Mason.addModuleBatch = function (module) {
  // Iterate the keys in the module
  var key;
  for (key in module) {
    if (module.hasOwnProperty(key)) {
      // Set each function to the static modules property (overloads pre-existing methods)
      Mason.addModule(key, module[key]);
    }
  }

  // Return Mason for a fluent interface
  return Mason;
};

/**
 * Batch remove module method for Mason
 * @param {Object} module Object containing modules that should be removed as keys
 * @returns {Function} Returns Mason
 */
// TODO: Write a test for this before enabling
// Mason.removeModuleBatch = function (module) {
  // // Iterate the keys in the module
  // var key;
  // for (key in module) {
    // if (module.hasOwnProperty(key)) {
      // // Remove each module from Mason
      // Mason.removeModule(key);
    // }
  // }

  // // Return Mason for a fluent interface
  // return Mason;
// };

/**
 * Static method to set attributes from an HTML object onto an element
 * @param {HTMLElement} elt Element to set attributes on
 * @param {Object} node HTML object to set attributes from.
 * @param {Object[]} node.attributes Array of attribute objects to set. If not specified, node becomes promoted to attributes itself
 * @param {String} node.attributes[i].nodeName Name of the attribute to set
 * @param {String} node.attributes[i].nodeValue Value of the attribute to set
 */
Mason.setAttributes = function (elt, node) {
  var attributes = node.attributes || node || [],
      i = 0,
      len = attributes.length,
      attribute;

  for (; i < len; i++) {
    attribute = attributes[i];
    elt.setAttribute(attribute.nodeName, attribute.nodeValue);
  }
};

/**
 * Static method to create and append child nodes from an HTML object onto an element
 * @param {HTMLElement} elt Element to set attributes on
 * @param {Object} node HTML object to set attributes from.
 * @param {Object[]} node.childNodes Array of HTML objects to render and append to the element. If not specified, node falls back as childNodes
 * @param {Object} options See Mason options parameter
 */
Mason.appendChildren = function (elt, node, options) {
  var childNodes = node.childNodes,
      childFrag;
  if (childNodes !== undefined) {
    // Render the child nodes
    childFrag = Mason(childNodes, options);

    // and append them to this node
    elt.appendChild(childFrag);
  }
};

/**
 * String to XML Parser -- Attribution to jQuery for XML interpretter
 * @param {String} data String of XML to read through
 * @returns {Document} Document object containing the parsed XML
 */
// TODO: Reduce the overkill being done by this and potential side-effects of using XML
// Found potential issue: standalone attributes (e.g. selected)
Mason.parseXML = function (data) {
  var xml,
      parser;
  try {
    // In standard browsers, use the DOMParser
    if (window.DOMParser) {
      parser = new DOMParser();
      xml = parser.parseFromString(data , 'text/xml');
    } else {
    // Otherwise, attempt to use IE's XMLDOM parser
      xml = new ActiveXObject('Microsoft.XMLDOM');
      xml.async = 'false';
      xml.loadXML(data);
    }
  } catch (e) {
    // If an error occurs, erase the XML
    xml = null;
  }

  // If there is no xml or no document element was created, throw an error
  if (!xml || !xml.documentElement) {
    throw new Error('Invalid XML: ' + data);
  }
  
  // Collect the deep errors
  var parseerrors = xml.getElementsByTagName('parsererror'),
      errors = [],
      i = 0,
      len = parseerrors.length;
  for (; i < len; i++) {
    errors.push(parseerrors[i].textContent);
  }
  
  // If there were deep errors, throw them nicely
  if (len > 0) {
    throw new Error(errors.join('\n'));
  }

  // Return the xml
  return xml;
}

/**
 * Shallow merge utility for Mason (object extension utility -- not application specific)
 * @param {Object} nodeChanges Changes to apply to the node
 * @param {Object} baseNode Base node to copy from
 * @returns {Object} Object with baseNode properties overriden with nodeChanges properties
 */
function mergeNode(nodeChanges, baseNode) {
  var retObj = {},
      key;

  // In the interim, copy over the nodeType, nodeValue, childNodes, and attributes
  retObj.nodeName = baseNode.nodeName;
  retObj.nodeType = baseNode.nodeType;
  retObj.nodeValue = baseNode.nodeValue;
  retObj.childNodes = baseNode.childNodes;
  retObj.attributes = baseNode.attributes;

  for (key in nodeChanges) {
    if (nodeChanges.hasOwnProperty(key)) {
      retObj[key] = nodeChanges[key];
    }
  }

  return retObj;
};
Mason.mergeNode = mergeNode;

/**
 * Sugar method for creation of a new node
 * @param {String} nodeName Name of the node to create
 * @param {Object} [baseNode] Optional baseNode to collect attributes and childNodes from
 * @returns {Object} Returns HTML node for easy .setAttribute-ing
 */
Mason.createNode = function (nodeName, baseNode) {
  // Create a standard element node for parsing by Mason
  var parseNode = {'nodeName': nodeName, 'nodeType': ELEMENT_NODE_VAL};

  // If there is a baseNode, merge it in
  if (baseNode) {
    parseNode = mergeNode(parseNode, baseNode);
  }

  // Create an element via Mason
  var retNode = Mason(parseNode, {'returnFirst': true});

  // Return the element
  return retNode;
};

return Mason;
}())));
