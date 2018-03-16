var kbds = (function() {

  var consts = (function() {
    var loaclKey = '__URL__MAP__';
    var keys = [
      ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
      ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
      ['z', 'x', 'c', 'v', 'b', 'n', 'm']
    ];
  
    var keyUrlMap = {
      q: 'www.qiniu.com',
      w: 'www.weibo.com',
      e: 'www.ele.me',
      t: 'jx.tmall.com',
      y: 'youtube.com',
      u: 'www.uc.cn',
      i: 'www.iqiyi.com',
      o: 'opera.com',
      p: 'www.pinduoduo.com',
      z: 'zhihu.com',
      m: 'www.mcdonalds.com.cn',
      j: 'juejin.im',
      x: 'xiedaimala.com',
      b: 'www.baidu.com',
      v: 'www.v2ex.com'
    };
    var kdbRowClsName = 'kbd-row';
    var kbdClsName = 'kbd-item';
    var defaultIcon = '//i.loli.net/2017/11/10/5a05afbc5e183.png';

    function saveToLocal(key, newUrl) {
      newUrl.trim() === '' ? delete keyUrlMap[key] : keyUrlMap[key] = newUrl;
      localStorage.setItem(loaclKey, JSON.stringify(keyUrlMap));
    }

    return {
      getKeys: function() { return keys; },
      getKeyUrlMap: function() {
        return localStorage.getItem(loaclKey) ? JSON.parse(localStorage.getItem(loaclKey)) : keyUrlMap;
      },
      getKbdClsName: function() { return kbdClsName; },
      getKbdRowClsName: function() { return kdbRowClsName; },
      getDefaultIcon: function() { return defaultIcon; },
      saveToLocal: saveToLocal
    }
  })();

  function init(el) {
    if (!isElement(el)) throw new Error('please give a dom element');
    var keys = consts.getKeys();
    for(var i = 0; i < keys.length; i++) {
      el.appendChild(renderRow(keys[i]));
    }
    document.addEventListener('keypress', keyPressListener);
    el.addEventListener('click', editUrl);
  }

  function renderRow(list) {
    var len = list.length;
    var div = tag('div');
    div.className = consts.getKbdRowClsName();
    var kbd;
    for(var i = 0; i < len; i++) {
      kbd = renderKbd(list[i]);
      div.appendChild(kbd);
    }
    return div;
  }

  function renderKbd(item) {
    var kbd = tag('kbd');
    var textSpan = tag('span');
    var editIcon = tag('span');
    var domain = consts.getKeyUrlMap()[item]
    kbd.className = consts.getKbdClsName();
    textSpan.className = consts.getKbdClsName() + '__text';
    editIcon.className = consts.getKbdClsName() + '__edit';
    textSpan.textContent = item;
    
    kbd.appendChild(textSpan);
    kbd.appendChild(renderImg(domain));
    kbd.appendChild(editIcon);
    return kbd;
  }
  
  
  function renderImg(domain) {
    var img = tag('img');
    var iconSrc = domain ? 'http://' + domain + '/favicon.ico' : consts.getDefaultIcon();
    img.className = consts.getKbdClsName() + '__img';
    img.width = 18;
    img.height = 18;
    img.src = iconSrc;
    img.onerror = function(e) {
      e.target.src = consts.getDefaultIcon();
    }
    return img;
  }

  function tag(tag) {
    return document.createElement(tag);
  }

  function isElement(el) {
    return el.nodeType !== undefined && el.nodeType === 1;
  }

  function keyPressListener(e) {
    var key = e.key;
    var domain = consts.getKeyUrlMap()[key];
    domain ? window.open('http://' + domain, '_blank') : alert('暂无对应网址');
    e.preventDefault();
  }

  function editUrl(e) {
    if (e.target.tagName.toLowerCase() === 'span' && e.target.className === consts.getKbdClsName() + '__edit') {
      var newUrl = prompt('请输入新的地址，如：www.baidu.com');
      var key = e.target.parentElement.textContent;
      var img = e.target.parentElement.getElementsByClassName(consts.getKbdClsName() + '__img')[0];

      consts.saveToLocal(key, newUrl);
      img.src = newUrl.trim() ? 'http://' + newUrl + '/favicon.ico' : consts.getDefaultIcon();
      img.onerror = function(e) {
        e.target.src = consts.getDefaultIcon();
      };
    }
  }

  return {
    init: init
  };
})();  