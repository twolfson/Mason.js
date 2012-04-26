require.config({
  'paths': {
    // Mason.js
    'Mason': '../src/Mason',
    
    // Require.js plugins
    'mason': '../requirejs/mason',
    'text': '../requirejs/text'
  }
});
define(['Mason'], function (Mason) {
  var body = document.body;
console.log(Mason);
  // The big 3 items I would like to knock out
  Mason.addModuleBatch({
    'tabrow': function (tabrow) {
      return Mason.createNode('div', tabrow);
    },
    'expand': function (expand) {
      return Mason.createNode('div', expand);
    },
    'list': function (list) {
      return Mason.createNode('div', list);
    }
  });
});