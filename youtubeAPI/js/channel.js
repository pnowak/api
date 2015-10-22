// Helper function to display JavaScript value on HTML page.
function showResponse(response) {
    var responseString = JSON.stringify(response, '', 2),
        items = response.items,
        body = document.getElementById('body'),
        caption = document.getElementById('caption'),
        v = 'https://www.youtube.com/embed/',
        i, len, item, tr, td, iframe;

    caption.appendChild(document.createTextNode(items[0].snippet.channelTitle));

    for (i = 0, len = items.length; i < len; i += 1) {
        item = items[i];
        tr = document.createElement('tr');
        //id column
        td = document.createElement('td');
        td.appendChild(document.createTextNode(i + 1));
        tr.appendChild(td);
        //title column
        td = document.createElement('td');
        td.appendChild(document.createTextNode(items[i].snippet.title));
        tr.appendChild(td);
        //video column
        iframe = document.createElement('iframe');
        iframe.setAttribute('width', 320);
        iframe.setAttribute('height', 240);
        iframe.setAttribute('type', 'text/html');
        iframe.setAttribute('frameborder', 0);
        iframe.setAttribute('src', v + items[i].id.videoId);
        td = document.createElement('td');
        td.appendChild(iframe);
        tr.appendChild(td);
        //description column
        td = document.createElement('td');
        td.appendChild(document.createTextNode(items[i].snippet.description));
        tr.appendChild(td);
        //publish date column
        td = document.createElement('td');
        td.appendChild(document.createTextNode(new Date(items[i].snippet.publishedAt).toLocaleDateString()));
        tr.appendChild(td);
        
        body.appendChild(tr);
    }
}

// Called automatically when JavaScript client library is loaded.
function onClientLoad() {
    gapi.client.load('youtube', 'v3', onYouTubeApiLoad);
}

// Called automatically when YouTube API interface is loaded (see line 9).
function onYouTubeApiLoad() {
    gapi.client.setApiKey('AIzaSyCxyvBivWH6gIWtRhKiaUQq7pUusge-5gw');
    search();
}

function search() {
    // Use the JavaScript client library to create a search.list() API call.
    var request = gapi.client.youtube.search.list({
        part: 'snippet',
        'channelId': 'UCzoVCacndDCfGDf41P-z0iA',
        maxResults: 50
    });
    // Send the request to the API server,
    // and invoke onSearchRepsonse() with the response.
    request.execute(onSearchResponse);
}

// Called automatically with the response of the YouTube API request.
function onSearchResponse(response) {
    showResponse(response);
}