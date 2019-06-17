# SearchBook ![](https://raw.githubusercontent.com/sowdust/searchbook/master/icon.png) 

A Firefox extension for executing some Graph-like searches against Facebook.

Related article: [techblog.mediaservice.net/2019/06/facebook-graphs-not-dead/](https://techblog.mediaservice.net/2019/06/facebook-graphs-not-dead/)

## Disclaimer

Make sure to read Facebook [Terms of Services](https://www.facebook.com/apps/site_scraping_tos_terms.php). 
All information and code are provided for educational purposes only. Using this code might be against Facebook Terms of Service or possibly even illegal. The authors are in no way responsible for any misuse of the information or the code provided.

## About

The extension allows you to overwrite some search queries that can be performed from the interface with more specific ones.

It is based on the research article [Facebook graph search workaround](https://mtg-bi.com/content/facebook-graph-search-workaround) published by Social Links.

When visiting a Search Results page, the user can set an arbitrary search query in a "graph search"-like format (more on this later) that will be executed instead of the original search.

## Screenshots

![Getting a Facebook ID|](https://raw.githubusercontent.com/sowdust/searchbook/master/screenshots/id.png)

![Custom Graph Search](https://raw.githubusercontent.com/sowdust/searchbook/master/screenshots/search.png)

## Requirements

The extension is now only for Firefox.

## Installation

* Clone this repository or  download it as a zip file and extract it on your filesystem
* Open a new browser tab in Firefox and type in the address bar `about:debugging`
* Select "Enable add-on debugging"
* Click on the "Load Temporary Add-on..." button and open any file inside the code folder (e.g.: manifest.json)

## Usage

When visiting a profile, group or user page, by clicking on the extension's icon, it is possible to visualize and copy the Facebook ID of the page.
From the extension interface is also possible to set an arbitrary search query (see formats below) by writing it into the text field and clicking "set".
After the search query is set, when making a random search through the normal search bar, after scrolling the page down, the results will be replaced with the ones from the user-inserted query. 
Click "clear" to go back to normal behaviour.

### Search formats

I have not yet explored all possible search keywords.
If you know of any other working keyword and want to share this information, please open an issue on this project and I will include it in the list.
The following operators are working:

```
stories-liked
stories-commented
stories-by
stories-tagged
stories-keyword
pages-liked
places-liked
likers
users-named
groups
places-visited
```

They can be combined with the command `intersect`, for example:

```intersect(places-visited(4),places-visited(5))```

## License

This code is free: you can do what you want with it. Credits are appreciated. Responsability of use is all yours. Earning money out of it is not nice, but you feel it's right, go ahead and do it.