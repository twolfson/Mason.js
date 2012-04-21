// TODO: Step back from vows and review perspective (i.e. what is the golden BDD engine?)
// TODO: async() will set an async flag on functions themselves and pass through a this.callback handler
(function () {
/**
 * Constructor for a Skeleton (test suite)
 * @param {String} name Name to call this test suite (may not apply to all BDD)
 */
function Skeleton(name) {
  this.name = name;
  this.batches = [];
}

// Static methods for Skeleton
Skeleton.modules = {};
/**
 * Static module handler for test engines
 * @param {String} name Name of module to add
 * @param {Function} fn Function that will process batches
 */
Skeleton.addModule = function (name, fn) {
  Skeleton.modules[name] = fn;
};

// Prototypal setup for Skeleton
Skeleton.prototype = {
  /**
   * Method to add test batches to this test suite
   * @param {Object} batch Batch of tests to add to this test suite
   * @param {Object} batch.* Context containing a set of tests to run
   * @param {Function} batch.*.topic Topic function which takes the place of 'describe' in Mocha and 'topic' in Vows
   * @param {Function} batch.*.* Function that will run a test on the current topic
   * @param {String} batch.*.* Placeholder for a test that will be created later. These will be skipped for test suites that don't support them
   * @returns {this} Skeleton test suite that is being worked on
   */
  'addBatch': function (batch) {
    this.batches.push(batch);
    return this;
  },
  /**
   * Run method for a test suite (currently only supporting Mocha)
   * @param {String} engineName Name of test engine to export to
   * @returns {Mixed} Returns result of engine
   */
   'exportTo': function (engineName) {
      // Find the engine that is being requested
      var engine = Skeleton.modules[engineName];

      // If it is not found, throw an error
      if (engine === undefined) {
        throw new Error('Test engine was not found: ' + engineName);
      }

      // Run and return the engine in the context of this with batches as the first parameter
      return engine.call(this, this.batches);
   }
};

// Add a Mocha engine
// TODO: Separate into another file
Skeleton.addModule('Mocha', function (batches) {
  // Loop through each batch and recurse each topic
  var i = 0,
      len = batches.length,
      batch;
  for (; i < len; i++) {
    batch = batches[i];
    parseBatch(batch);
  }

  function parseBatch(batch) {
    // Mocha does not use batches
    var description;

    // Iterate the keys of the batch
    for (description in batch) {
      if (batch.hasOwnProperty(description)) {
        (function (description) {
          var context = batch[description];
          
          // If the context is an object, describe it
          if (typeof context === 'object') {
            describe(description, function () {
              parseContext(context, []);
            });
          }
        }(description));
      }
    }
  }

  function parseContext(context, topicChain) {
    // Fallback topicChain
    topicChain = topicChain || [];

    // If the context has a topic, grab it
    // TODO: Handle before, after
    var topicFn = context.topic,
        topic;
    if (topicFn !== undefined) {
      // TODO: Handle async portion for 'this' (e.g. this.callback)
      topic = topicFn.apply({}, topicChain);
      topicChain.unshift(topic);
    }

    // Loop through the descriptions (skipping topic)
    var description,
        firstTopic = topicChain[0];
    for (description in context) {
      if (description !== 'topic' && context.hasOwnProperty(description)) {
        (function (description) {
          var item = context[description],
              itemType = typeof item;

          // If the item is an object, it is a sub-context
          if (itemType === 'object') {
            // Describe and recurse the sub-context
            describe(description, function () {
              parseContext(item, topicChain);
            });
          } else if (itemType === 'function') {
          // Otherwise, if it is a function, it is a vow
            // Run the vow as an 'it'
            it(description, function () {
              item(firstTopic);
            });
          }
          // Otherwise, it is a promise
            // Mocha does not support promises
        }(description));
      }
    }
  }
});

// Export to global scope
// TODO: Prepare for node, requirejs, etc
window.Skeleton = Skeleton;
}());