function findItemsByKeywords(root) {
    var items = root.findItemsByKeywordsResponse[0].searchResult[0].item || [],
        container = document.getElementById('example'),
        dataFromEbay = [],
        hot;

    for (var i = 0; i < items.length; i += 1) {
        var item     = items[i],
            title    = item.title,
            pic      = item.galleryURL,
            viewitem = item.viewItemURL,
            loc      = item.location,
            pay      = item.paymentMethod,
            rtr      = item.returnsAccepted,
            ship     = item.shippingInfo[0].shipToLocations[0],
            price    = item.sellingStatus[0].currentPrice[0].__value__,
            endTime  = item.listingInfo[0].endTime[0];

        dataFromEbay.push({'picture': pic, 'title': "<a href=" + viewitem + ">" + title + "</a>", 'current price': price, 'location': loc, 'ship to locations': ship, 'payment method': pay, 'returns accepted': rtr, 'end time': new Date(endTime).toLocaleDateString()});
    }

    hot = new Handsontable(container, {
        data: dataFromEbay,
        colHeaders: ['Picture', 'Title', 'Current price', 'Location', 'Ship to locations', 'Payment method', 'Returns accepted', 'End time'],
        columns: [
            {data: 'picture', renderer: coverRenderer}, {data: 'title', renderer: 'html'}, {data: 'current price', type: 'numeric', format: '$0,0.00'}, {data: 'location'}, {data: 'ship to locations'}, {data: 'payment method'}, {data: 'returns accepted'}, {data: 'end time'}
        ],
        rowHeaders: true,
        fixedRowsTop: 1,
        colWidths: [47, 47, 47, 47, 47, 47, 47, 47, 47], 
        stretchH: 'all',
    });

    function coverRenderer (instance, td, row, col, prop, value, cellProperties) {
        var escaped = Handsontable.helper.stringify(value),
            img;

        if (escaped.indexOf('http') === 0) {
            img = document.createElement('IMG');
            img.src = value;

            Handsontable.Dom.addEvent(img, 'mousedown', function (e){
                e.preventDefault(); // prevent selection quirk
            });

            Handsontable.Dom.empty(td);
            td.appendChild(img);
        }
        else {
          // render as text
          Handsontable.renderers.TextRenderer.apply(this, arguments);
        }

        return td;
    }
}

// Create a JavaScript array of the item filters you want to use in your request
var filterarray = [
    {'name': 'MaxPrice', 'value': '100', 'paramName': 'Currency', 'paramValue': 'USD'},
    {'name': 'FreeShippingOnly', 'value': 'true', 'paramName': '', 'paramValue': ''},
    {'name': 'ListingType', 'value': ['AuctionWithBIN', 'FixedPrice', 'StoreInventory'], 'paramName': '', 'paramValue': ''}
];

var urlfilter = '';

function  buildURLArray() {
    for(var i = 0; i < filterarray.length; i += 1) {
        var itemfilter = filterarray[i];
            for(var index in itemfilter) {
                if (itemfilter[index] !== '') {
                    if (itemfilter[index] instanceof Array) {
                        for(var r = 0; r <itemfilter[index].length; r += 1) {
                            var value = itemfilter[index][r];
                            urlfilter += '&itemFilter\(' + i + '\).' + index + '\(' + r + '\)=' + value ;
                        }
                    }
                    else {
                        urlfilter += '&itemFilter\(' + i + '\).' + index + '=' + itemfilter[index];
                    }
                }
            }
    }
}

buildURLArray(filterarray);

// Construct the request
var url = 'http://svcs.ebay.com/services/search/FindingService/v1';
    url += '?OPERATION-NAME=findItemsByKeywords';
    url += '&SERVICE-VERSION=1.0.0';
    url += '&SECURITY-APPNAME=piotrnow-f16e-4d41-ba45-8b05ddeaede9';
    url += '&GLOBAL-ID=EBAY-US';
    url += '&RESPONSE-DATA-FORMAT=JSON';
    url += '&callback=findItemsByKeywords';
    url += '&REST-PAYLOAD';
    url += '&keywords=wittgenstein';
    url += '&paginationInput.entriesPerPage=100';
    url += urlfilter;

// Submit the request
var s = document.createElement('script');
s.src = url;
document.body.appendChild(s);