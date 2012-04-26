/**
 * This is a file of untested potentially useful helper functions for Mason
 */
(function () {
var Node = window.Node || {},
    ELEMENT_NODE_VAL = Node.ELEMENT_NODE || 1,
    TEXT_NODE_VAL = Node.TEXT_NODE || 3,
    DOCUMENT_NODE_VAL = Node.DOCUMENT_NODE || 9,
    DOCUMENT_FRAG_VAL = Node.DOCUMENT_FRAGMENT_NODE || 11;

/**
 * Helper method to determine if a node is a textNode or not
 * @param {Object} node Node to check on
 * @returns {Boolean} True if the node is a text node
 */
Mason.isTextNode = function (node) {
  return node.nodeType === TEXT_NODE_VAL;
};

/**
 * Helper method to determine if a node is a document/documentFragment or not
 * @param {Object} node Node to check on
 * @returns {Boolean} True if the node is a document/documentFragment node
 */
Mason.isDocumentNode = function (node) {
  var nodeType = node.nodeType;
  return nodeType === DOCUMENT_NODE_VAL || nodeType === DOCUMENT_FRAG_VAL;
};

/**
 * Helper method to determine if a node is an element node or not
 * @param {Object} node Node to check on
 * @returns {Boolean} True if the node is an element node
 */
Mason.isElementNode = function (node) {
  return node.nodeType === ELEMENT_NODE_VAL;
};

/**
 * Node replacement utility
 * @param {Node} newNode Node to replace origNode with
 * @param {Node} origNode Node to be replaced
 */
Mason.replaceNode = function (newNode, origNode) {
  var parentNode = origNode.parentNode;
  parentNode.replaceChild(newNode, origNode);
};

/**
 * Method to initiate and replace any nodes that have the attribute 'data-mason'
 * @param {Object} options Options to run Mason with (see Mason)
 */
Mason.processPage = function (options) {
  // Get all elements from the page
  var pageElts = document.getElementsByTagName('*') || [],
  // Copy over all elements into an array instead of using an active DOM collection
      elts = [].slice.call(pageElts),
      elt,
      i = 0,
      len = elts.length,
      htmlFrag;

  // Iterate the elements
  for (; i < len; i++) {
    elt = elts[i];

    // If the type matches text/Mason, process it
    if (elt.hasAttribute('data-mason')) {
      htmlFrag = Mason(elt, options);
      Mason.replaceNode(htmlFrag, elt);
    }
  }
};

/**
 * Method to initiate and replace any 'script[type="text/Mason"]' tags in the page
 * @param {Object} options Options to run Mason with (see Mason)
 */
Mason.masonScriptType = /^text\/Mason/i;
Mason.processScripts = function (options) {
  // Get all scripts from the page
  var pageScripts = document.getElementsByTagName('script') || [],
  // Copy over all scripts into an array instead of using an active DOM collection
      scripts = [].slice.call(pageScripts),
      script,
      i = 0,
      len = scripts.length,
      typeRegexp = Mason.masonScriptType,
      htmlString,
      htmlFrag;

  // Iterate the scripts
  for (; i < len; i++) {
    script = scripts[i];

    // If the type matches text/Mason, process it
    if (script.type.match(typeRegexp)) {
      htmlString = script.innerHTML;
      htmlFrag = Mason(htmlString, options);
      Mason.replaceNode(htmlFrag, script);
    }
  }
};
}());