/** 
  * SearchBook 
  *
  * @author sowdust<mattia.vinci@mediaservice.net>
  * @url    https://github.com/sowdust/searchbook
  * 
  * License:  free
  * 
*/

function set_query() {
  query = document.getElementById('query').value;
  browser.runtime.sendMessage({
    command: "set_query",
    query: document.getElementById('query').value
  });
  window.localStorage.setItem('facebook-search-query',query);
  var text = '<span style="width:40em"><b>Current query:</b></span> ' + document.getElementById('query').value;
  document.getElementById('current_query').innerHTML = text;
}

function clear_query() {
  console.log('Removing query');
  browser.runtime.sendMessage({ command: "clear_query" });
  window.localStorage.setItem('facebook-search-query','');
  document.getElementById('current_query').innerHTML = '';
  document.getElementById('query').value = '';
}

function fill_values() {
  var query = window.localStorage.getItem('facebook-search-query');
  if(query) {
    document.getElementById('query').value = query;
    var text = '<b>Current query:</b> ' + query;
    document.getElementById('current_query').innerHTML = text;
  }
}

function set_facebook_id(facebook_id,facebook_type) {
  if(-1 == facebook_id) {
    var html = '';
  } else {
    var html = '<span style="width:70px">';
    html += '<b>' + facebook_type.charAt(0).toUpperCase() + facebook_type.slice(1) + ' ID:</b> ';
    html += '</span>';
    html += '<input id="fb_id" type="text" value="' + facebook_id + '" size="' + (facebook_id.length+1) + '"> '; 
    html += '[ <a class="cpy" title="copy to clipboard" href="#">copy</a> ]';
  }
  document.getElementById('facebook_id').innerHTML = html;
}

function email_link() {
  div = document.getElementById('sowdust');
  div.innerHTML = atob("PGEgaHJlZj0ibWFpbHRvOm1hdHRpYS52aW5jaUBtZWRpYXNlcnZpY2UubmV0Ij5zb3dkdXN0PC9hPg==");
}

// fill Entity ID and current query
document.onload = fill_values();
// add email address 
document.onload = email_link();


document.addEventListener("click", (e) => {

    if (e.target.classList.contains("set")) {
      set_query();
    }
    if (e.target.classList.contains("rem")) {
      clear_query();
    }
    if (e.target.classList.contains("cpy")) {
      // copy current id to clipboard
      var selector = document.getElementById('fb_id');
      selector.select();
      document.execCommand('copy');
    }
    if (e.target.classList.contains("tos")) {
      var disclaimer = div.getElementById('disclaimer');
      disclaimer.style.display = 'block';
    }
});

// set listener for printing Facebook IDs
browser.runtime.onMessage.addListener((message) => {
  if (message.command === "set_facebook_id") {
    facebook_id = message.facebook_id;
    facebook_type = message.facebook_type;
    set_facebook_id(facebook_id,facebook_type);
  }
});

// trying to get facebook ID of element
browser.tabs.executeScript({ file: '/get_fb_id.js' });
