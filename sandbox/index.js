require.config({
  'paths': {
    // Mason.js
    'Mason': '../src/Mason',

    // Require.js plugins
    'mason': '../requirejs/mason',
    'text': '../requirejs/text'
  }
});
define(['Mason', '../src/html_to_xml.js'], function (Mason) {
  var body = document.body;

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
  
  // Generate tab rows
  // TODO: Integrate tpl and Mason into a build chain
  require(['text!tabrow.ejs', 'template'], function (tabrow, tpl) {
    var renderHtml = tpl(tabrow),
        docFrag = Mason(renderHtml);
    body.appendChild(docFrag);
  });
});