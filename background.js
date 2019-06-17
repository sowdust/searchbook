/** 
  * SearchBook 
  *
  * @author sowdust<mattia.vinci@mediaservice.net>
  * @url    https://github.com/sowdust/searchbook
  * 
  * License:  free
  * 
*/

var query = window.localStorage.getItem('facebook-search-query');
var original_query = '';
var pattern = "https://www.facebook.com/ajax/pagelet/generic.php/BrowseScrollingSetPagelet*";
var query_regex = /%7B%5C%22bqf%5C%22%3A%5C%22(.+?)%5C%22%2C%5C%22browse_sid%5C%22/;
var cursor_regex = /cursor%22%3A%22(.+?)%22/;
var page_regex = /%22page_number%22%3A(\d+)%2C/;
var view_regex = /%7B%22view%22%3A%22([a-z]+)%22/;
var require_grid = ['photos','videos'];
var page_number = 1;

console.log('SearchBook Extension loaded');

function error(error) {
	console.log(error);
}

function add_warning() {
	var alert_code = "var div = document.createElement('div');";
	alert_code += "div.id='warning_message';";
	alert_code += "div.style.position = 'fixed';";
	alert_code += "div.style.verticalAlign = 'middle';";
	alert_code += "div.style.padding = '0 auto';";
	alert_code += "div.style.textAlign = 'center';";
	alert_code += "div.style.backgroundColor = '#f44336';";
	alert_code += "div.style.color = 'white';";
	alert_code += "div.style.fontWeight = 'bold';";
	alert_code += "div.style.bottom = 0;";
	alert_code += "div.style.width = '100%';";
	alert_code += "div.style.zIndex = '999';";
	alert_code += "div.innerHTML = 'Intercepting';";
	alert_code += "document.body.appendChild(div);";
	alert_code += "console.log('warning');";
	alert_code += "var q = '" + query + "';";
	alert_code += "var o = '" + original_query + "';";
	alert_code += "var t = ' <tt>Intercepting requests: ' + o + '</tt><br />';";
	alert_code +=  "t += '<tt>Replacing with query:  ' + q  + '</tt><br />';";
	alert_code += "div.innerHTML = t;";
	browser.tabs.executeScript({ code: alert_code });
}

function remove_old_results() {
	var clear_code  = "console.log('trying to remove old results');";
	clear_code += "var query=\"" + query + "\";";
	clear_code += "var d = document.getElementById('pagelet_loader_u_ps_0_3_0_browse_result_below_fold');";
	clear_code += "var e = document.getElementById('BrowseResultsContainer');";
	clear_code += "var f = document.getElementById('bootstrap_entity_module');";
	clear_code += "var g = document.getElementById('u_ps_jsonp_3_3_0_browse_result_below_fold');";
	clear_code += "if(d) { d.innerHTML = '<h3 style=\"padding: 3px\">Results for ' + query + '</h3>'; }";
	clear_code += "if(e) { e.innerHTML = ''; }";
	clear_code += "if(f) { f.innerHTML = ''; }";
	clear_code += "if(g) { g.innerHTML = ''; }";	
	browser.tabs.executeScript({ code: clear_code });
}

function redirect(requestDetails) {

	if(!query) {
		error('Query not set');
		return;
	}

	modifiedUrl = requestDetails.url;
	
	if(1 == page_number) {

		// remove the cursor reference
		var q = cursor_regex.exec(modifiedUrl);
		if(q.length == 2) {

			modifiedUrl = modifiedUrl.replace(q[1],'');
		}	

		// remove results related to original query
		remove_old_results();
	}

	// avoid infinite loops
	if(modifiedUrl.endsWith('&modified=true')) {
		console.log('Request already modified');
		return;
	} else {
		modifiedUrl = modifiedUrl + '&modified=true';
	}

	// replace the original query with ours
	var m = query_regex.exec(modifiedUrl);
	if(m.length != 2) {
		error('Query pattern matching error');
		return;
	}
	original_query = m[1];
	modifiedUrl = modifiedUrl.replace(m[1],encodeURI(query));

	// replace page number
	var p = page_regex.exec(modifiedUrl);
	if(!p || p.length != 2) {
		error('Page pattern matching error');
		return;
	}
	modifiedUrl = modifiedUrl.replace('%22page_number%22%3A'+ p[1] +'%2C', '%22page_number%22%3A'+ page_number +'%2C');
	page_number = page_number + 1;

	// set the right view mode
	for(var i=0; i<require_grid.length; ++i) {
		if(query.includes(require_grid[i])) {
			var v = view_regex.exec(modifiedUrl);
			if(v.length == 2) {
				modifiedUrl = modifiedUrl.replace('%7B%22view%22%3A%22'+ v[1] +'%22', '%7B%22view%22%3A%22'+ 'grid' +'%22');
			}
		}
	}

	// warn the user we are intercepting
	if(!document.getElementById('warning_message')) {
		add_warning();
	}

	return {
		redirectUrl: modifiedUrl
	};
}

// set listener for redirection
browser.webRequest.onBeforeRequest.addListener(
  redirect,
  {urls:[pattern]},
  ["blocking"]
);

// set listener for messages from the popup interface
browser.runtime.onMessage.addListener((message) => {
	if (message.command === "set_query") {
		console.log('Setting query to ' + message.query);
		query = message.query;
		page_number = 1;
	} else if (message.command === "clear_query") {
		console.log('Removing query');
		query = '';
	}
});
