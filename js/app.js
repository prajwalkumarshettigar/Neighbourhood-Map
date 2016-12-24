var wikiSuccess = "Know from Wiki:"
var wikiFail = "No Wikipedia resources about this place"
var initMark = [];
viewModel = {
    wikiName: ko.observableArray(),
    wikiLinks: ko.observableArray(),
    wikiInfo: ko.observableArray(),
    wikiFailed: ko.observable(),
    wikiHeader: ko.observable(),
    q: ko.observable(''),
    markerList: ko.observableArray(),
    //initial Marker load function
    init: function () {
        initMark = markerName.slice();
        if (!viewModel.q())
            viewModel.markerList(initMark);
    },
    //click event function for list items
    listClick: function (data, event) {
        var name = event.target.innerHTML;
        var id;//get the id of marker
        for (var i = 0; i < 15; i++) {
            if (name === markerName[i]) {
                id = i; break;
            }
        }
        viewModel.displayInfo(id);
        viewModel.wikiAPI(name);
    },
    displayInfo: function (id) {
        displayInfoWindow(id);
    },
    search: function (value) {
        //live search with Knockout js, Source: code patch from stackoverflow
        viewModel.markerList.removeAll();
        for (var i = 0; i < placeMarkers.length; i++) {
            if (markerName[i].toLowerCase().indexOf(value.toLowerCase()) >= 0) {
                viewModel.markerList.push(markerName[i]);
                placeMarkers[i].setVisible(true);
            }
            else {
                placeMarkers[i].setVisible(false);
            }
        }
    },
    //wikipedia API request function
    wikiAPI: function (data) {
        var wikiUrl = "https://en.wikipedia.org/w/api.php?action=opensearch&search=" + data + "&format=json&callback=wikiCallback";
        var wikiRequestTimeout = setTimeout(function () {
            alert("TimeOut!! Couldn't fetch resources from wikipedia");
        }, 8000);
        $.ajax({
            url: wikiUrl,
            dataType: "jsonp",
            success: function (response) {
                var articleName = response[1];
                var articleList = response[2];
                var articleUrl = response[3];
                console.log(articleName);
                console.log(articleList);
                console.log(articleUrl);

                viewModel.fetchWikiData(articleList, articleUrl, articleName);
                clearTimeout(wikiRequestTimeout);
            }
        });
    },
    //assign wiki response data to ko observales
    fetchWikiData: function (articleList, articleUrl, articleName) {
        if (articleName.length === 0) {
            viewModel.wikiHeader(wikiFail);
            viewModel.wikiName.removeAll();
            viewModel.wikiInfo.removeAll();
            viewModel.wikiLinks.removeAll();
        }
        else {
            viewModel.wikiHeader(wikiSuccess);
            viewModel.wikiName(articleName);
            viewModel.wikiInfo(articleList);
            viewModel.wikiLinks(articleUrl);
            console.log(viewModel.wikiLinks);
        }
    }

}
viewModel.q.subscribe(viewModel.search);
ko.applyBindings(viewModel);