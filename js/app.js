var wikiHeader="Wikipedia Links:"
var wikiLoad = "Wikipedia is Loading"
var wikierror = "Failed to load Wikipedia resources"

viewModel = {
        wikiName: ko.observableArray(),
        wikiLinks: ko.observableArray(),
        wikiInfo:ko.observable(),

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
            },

            displayInfo: function(id){
                displayInfoWindow(id);
            }

}
ko.applyBindings(viewModel);