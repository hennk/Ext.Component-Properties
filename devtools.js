// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// The function below is executed in the context of the inspected page.

var page_getProperties = function() {
  var page_copyCmpProperties = function(copy, cmp){
    ["$className"].map(function(prop){
      copy[prop] = cmp[prop];
    });

    var items = [];
    items.__proto__ = null;
    if (typeof(cmp.getItems) == 'function'){
      cmp.getItems().items.map(function(item, i){
        items[i] = item.rendered && item.element ? item.element.dom : "not rendered yet";
      });
    }
    copy["items"] = items;
  };

  var page_findParentCmp = function(elem){
    var parent = elem.parentNode;
    if (parent){
      var cmp = Ext.getCmp(parent.id);
      if (cmp){
        return cmp;
      } else if (parent){
        return page_findParentCmp(parent);
      }
    }
};

  var data = {};
  var copy = { __proto__: null};

  if (window.Ext && $0){
    var cmp = Ext.getCmp($0.id);

    if (cmp){
      page_copyCmpProperties(copy, cmp);
    }

    var parentCmp = page_findParentCmp($0);
    if (parentCmp && parentCmp.element){
      copy["parent"] = parentCmp.element.dom;
    }
}

  return copy;
};

chrome.devtools.panels.elements.createSidebarPane(
  "Ext.Component Properties",
  function(sidebar) {
    function updateElementProperties() {
      sidebar.setExpression("(" + page_getProperties.toString() + ")()");
    }
    updateElementProperties();
    chrome.devtools.panels.elements.onSelectionChanged.addListener(updateElementProperties);
  }
);
