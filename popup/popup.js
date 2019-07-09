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

function show_updates(new_version) {
  var update_div = document.getElementById('updates');
  update_div.style.display = 'block';
  var new_version_div = document.getElementById('new-version');
  new_version_div.innerHTML = new_version;
}

function check_updates() {
  var last_update_check = window.localStorage.getItem('searchbook-last-update-check');
  var curr_time = Date.now();
  var manifest = browser.runtime.getManifest();
  var current_version = manifest.version;
  if(!last_update_check || (curr_time - last_update_check) > (12*60*60*1000)) {    
    console.log('Checking updates...');
    var update_url = 'https://raw.githubusercontent.com/sowdust/searchbook/master/manifest.json';
    var http = new XMLHttpRequest();
    http.open("GET", update_url);
    http.send();
    var new_manifest = '';
    http.onreadystatechange = (e) => {
      if(http.readyState === 4 && http.status === 200) {
        new_manifest = JSON.parse(http.responseText);
        if(new_manifest.version > current_version) {
          show_updates(new_manifest.version);
          window.localStorage.setItem('searchbook-latest-version',new_manifest.version);
        }
        window.localStorage.setItem('searchbook-last-update-check',curr_time);
      }
    }  
  }else{
    var new_vers_av = window.localStorage.getItem('searchbook-latest-version');
    if( new_vers_av > current_version) {
      show_updates(new_vers_av)
    }
    return;
  }
}

// fill Entity ID and current query
document.onload = fill_values();
// add email address 
document.onload = email_link();
// check for updates
document.onload = check_updates();


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
