/** 
  * SearchBook 
  *
  * @author sowdust<mattia.vinci@mediaservice.net>
  * @url    https://github.com/sowdust/searchbook
  * 
  * License:  free
  * 
*/

// needs some fixing. sometimes the html is not updated

//var html = '';

function get_html() {
	var html = document.documentElement.innerHTML;
	get_fb_id(html);
}

window.addEventListener("load", get_html(), false);

function get_fb_id(html) {

	//var html = document.documentElement.innerHTML;
	//var html = DOMtoString(document);
	var regex = new RegExp('fb\:\/\/(page|profile|group)\/([0-9]+)');
	var regexUID = new RegExp('\"uid\"\:([0-9]+)');
	var regexTitle = new RegExp('<title id=\"pageTitle\">(.*?)<\/title>');

	// getting profile id and profile type
	try {
		pieces = html.match(regex);
		profileType = pieces[1];
		profileID = pieces[2];
	} catch(err) {
		console.log(err);
		profileType = "None";
		profileID = "-1";
	}

	if(profileID == "-1") {
		try {
			pieces = html.match(regexUID);
			profileID = pieces[1];
			profileType = "unknown";
		} catch(err) {
			console.log(err);
			profileType = "None";
			profileID = "-1";
		}

		if(profileID == "-1") {
			console.log("Error while getting Facebook id");
		}
	}

	console.log(profileID);

	html = '';

	browser.runtime.sendMessage({
	    command: "set_facebook_id",
	    facebook_id: profileID,
	    facebook_type: profileType
	});
}


