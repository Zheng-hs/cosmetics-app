//app.js
import {Event} from './utils/event'
App({
    //onLaunch,onShow: options(path,query,scene,shareTicket,referrerInfo(appId,extraData))
    onLaunch: function(options) {
        var event = new Event()
        wx.$emit = event.emit
        wx.$on = event.on
        wx.$off = event.off
    },  
    onShow: function(options) {

    },
    onHide: function() {

    },
    onError: function(msg) {

    },
    //options(path,query,isEntryPage)
    onPageNotFound: function(options) {

    },
});
  