(function () {
Mason.addModuleBatch({
  'tabs': function (tabs) {
    // Collect the child nodes and their lengths
    var tabNodes = tabs.childNodes || [];

    // Filter out all textNodes
    tabNodes = Mason.filterTextNodes(tabNodes);

    // Set up the remaining variables
    var i = 0,
        len = tabNodes.length,
        tabNode,
        tabChildren,
        tabChildNode,
        nodeName;

    // If there are no children, throw an error
    if (len < 1) {
      throw new Error('tabs requires at least 1 child nodes');
    }

    var container = document.createElement('div'),
        $container = $(container),
        tabRow = document.createElement('div'),
        tabArr = [],
        tabIndex = 0,
        currentTab,
        Tab = function (index, head, content) {
          this.index = index;
          this.$head = $(head);
          this.$content = $(content);
        };

    // Set up the attributes of the container
    Mason.setAttributes(container, tabs);
    tabRow.className = 'tabRow';

    Tab.prototype = {
      'select': function () {
        var $head = this.$head;

        // Deselect the last tab
        currentTab.deselect();

        // Visually select the next tab
        $head.addClass('isSelected');
        this.$content.css('display', 'block');

        // Save the current tab
        container.value = this.index;
        container.currentTab = currentTab = this;

        // Fire an event
        $head.trigger('select', this);
      },
      'deselect': function () {
        var $head = this.$head;
        $head.removeClass('isSelected');
        this.$content.css('display', 'none');

        // Fire an event
        $head.trigger('deselect', this);
      }
    };

    // Function to change tabs
    container.changeTab = function (index) {
      // Select the tab and trigger an onchange event
      var tab = tabArr[index];
      tab.select();
      $container.trigger('change', tab);
    };

    // Append the tabRow to the container
    container.appendChild(tabRow);

    // Filter out textNodes from the tabs
    for (; i < len; i++) {
      (function (i) {
      var tabNode = tabNodes[i],
          tab,
          tabHead,
          tabContent,
          tabChildren = tabNode.childNodes || [],
          j = 0,
          len2 = tabChildren.length;

      // Create a head for the tab and content for the tab
      tabHead = document.createElement('div');
      tabHead.className = 'tabHead';
      tabContent = document.createElement('div');

      // Sub-interate the tab child nodes
      for (; j < len2; j++) {
        tabChildNode = tabChildren[j];
        nodeName = tabChildNode.nodeName;

        // If the nodeName is 'text'
        if (nodeName === 'text') {
          // Append its childNodes to the tabHead
          Mason.appendChildren(tabHead, tabChildNode);
        } else if (nodeName === 'content') {
        // Otherwise, if the nodeName is 'content', append its childNodes to the tabContent
          Mason.appendChildren(tabContent, tabChildNode);
        }
      }

      // Append the tabHead to the tabRow
      tabRow.appendChild(tabHead);

      // Hide the tabContent
      $(tabContent).css('display', 'none');

      // and the tabContent to the container
      container.appendChild(tabContent);

      // Create a tab object for bindings
      tab = new Tab(i, tabHead, tabContent);

      // When the tab head is clicked on, select it
      $(tabHead).on('click', function() {
        tab.select();
      });

      // Memoize the tab to the tabArr
      tabArr.push(tab);
      }(i));
    }

    // Change to the tab index
    currentTab = tabArr[tabIndex];
    currentTab.select();
    
    // Expose the amount of tabs
    container.tabLength = tabArr.length;

    return container;
  }
});
}());