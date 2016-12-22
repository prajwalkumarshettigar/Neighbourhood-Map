var wikiFail = "No Wikipedia resources about this place"
viewModel = {
        wikiName: ko.observableArray(),
        wikiLinks: ko.observableArray(),
        wikiInfo:ko.observableArray(),

        markerList: ko.observableArray(),

        init: function(){
            viewModel.markerList(markerName);
        },
        listClick : function(data, event) {
            var name = event.target.innerHTML;
            var id;//get the id of marker
            for(var i=0;i<15;i++){
                if (name === markerName[i]){
                    id = i;break;
                }
            }
            viewModel.displayInfo(id);
            viewModel.wikiAPI(name);
            },

            displayInfo: function(id){
                displayInfoWindow(id);
            },
            wikiAPI: function(data){
                var wikiUrl = "https://en.wikipedia.org/w/api.php?action=opensearch&search=" + data + "&format=json&callback=wikiCallback";
                var wikiRequestTimeout = setTimeout(function () {
                    alert("TimeOut!! Couldn't fetch resources from wikipedia");
                    }, 8000);
                $.ajax({
                    url: wikiUrl,
                    dataType: "jsonp",
                    success: function (response) {
                        var articleList = response[2]
                         viewModel.fetchWikiData(articleList);
                        clearTimeout(wikiRequestTimeout);
                    }
                    });
            },
            fetchWikiData: function(articleList){
                if(articleList.length === 0){
                    viewModel.wikiInfo(wikiFail);
                }
                else{
                    viewModel.wikiInfo(articleList);
                }
            }

}
ko.applyBindings(viewModel);