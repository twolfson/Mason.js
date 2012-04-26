require.config({
  'paths': {
    'Mason': '../src/Mason'
  }
});
define(['Mason'], function (Mason) {
  var body = document.body;

  // The big 3 items I would like to knock out
  Mason.addModuleBatch({
    'tabRow': function () {},
    'expand': function () {},
    'list': function () {}
  });
});