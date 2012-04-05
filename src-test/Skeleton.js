// TODO: JSHint me
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
    // Mocha does not use batches
    (function (batch) {
      var description;
      // Iterate the keys of the batch
      for (description in batch) {
        if (batch.hasOwnProperty(description)) {
          context = batch[description];

          // Describe the context
          // TODO: Handle before, after
          describe(description, function () {
            var context = batch[description];

            // If the context has a topic, grab it
            var topicFn = context.topic,
                topic,
            // TODO: When recursing, use a built up topic chain
                topicChain = [];
            if (topicFn !== undefined) {
              // TODO: Handle async portion for 'this'
              topic = topicFn.apply({}, topicChain);
              topicChain.push(topic);
            }

            // Loop through the descriptions (skipping topic)
            // TODO: The head of this function is where recursion is introduced
            var subdescription,
            // TODO: Use the length for push and re-use it here
                lastTopic = topicChain[topicChain.length - 1],
                subitem,
                subitemType;
            for (subdescription in context) {
              if (subdescription !== 'topic' && context.hasOwnProperty(subdescription)) {
                subitem = context[subdescription];
                subitemType = typeof subitem;

                // If the item is an object, it is a sub-context
                if (subitemType === 'object') {
                  // Describe and recurse the sub-context
                  describe(subdescription, function () {
                    // TODO: Recurse here
                  });
                } else if (subitemType === 'function') {
                // Otherwise, if it is a function, it is a vow
                  // Run the vow as an 'it'
                  it(subdescription, function () {
                    subitem(lastTopic);
                  });
                }
                // Otherwise, it is a promise
                  // Mocha does not support promises
              }
            }
          });
        }
      }
    }(batches[i]));
  }
});

// describe('Array', function(){
  // before(function(){
    // // ...
  // });

  // describe('#indexOf()', function(){
    // it('should return -1 when not present', function(){
      // [1,2,3].indexOf(4).should.equal(-1);
    // });
  // });
// });

// vows.describe('Array').addBatch({                      // Batch
    // 'An array': {                                      // Context
        // 'with 3 elements': {                           // Sub-Context
            // topic: [1, 2, 3],                          // Topic

            // 'has a length of 3': function (topic) {    // Vow
                // assert.equal(topic.length, 3);
            // }
        // },
        // 'with zero elements': {                        // Sub-Context
            // topic: [],                                 // Topic

            // 'has a length of 0': function (topic) {    // Vow
                // assert.equal(topic.length, 0);
            // },
            // 'returns *undefined*, when `pop()`ed': function (topic) {
                // assert.isUndefined(topic.pop());
            // }
        // }
    // }
// });


// Export to global scope
// TODO: Prepare for node, requirejs, etc
window.Skeleton = Skeleton;
}());