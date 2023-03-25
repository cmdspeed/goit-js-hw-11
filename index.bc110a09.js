"use strict";var instanceId=0,instanceData={},config={container:window.document.documentElement,watch:"[data-scroll-watch]",watchOnce:!0,inViewClass:"scroll-watch-in-view",ignoreClass:"scroll-watch-ignore",debounce:!1,debounceTriggerLeading:!1,scrollDebounce:250,resizeDebounce:250,scrollThrottle:250,resizeThrottle:250,watchOffsetXLeft:0,watchOffsetXRight:0,watchOffsetYTop:0,watchOffsetYBottom:0,infiniteScroll:!1,infiniteOffset:0,onElementInView:function(){},onElementOutOfView:function(){},onInfiniteXInView:function(){},onInfiniteYInView:function(){}},initEvent="scrollwatchinit",extend=function(t){var e,n,i,a=arguments.length;for(t=t||{},e=1;e<a;e++)if(i=arguments[e])for(n in i)i.hasOwnProperty(n)&&(t[n]=i[n]);return t},throttle=function(t,e,n){var i,a;return e=e||250,function(){var s=n||this,l=+new Date,c=arguments;i&&l<i+e?(window.clearTimeout(a),a=setTimeout((function(){i=l,t.apply(s,c)}),e)):(i=l,t.apply(s,c))}},debounce=function(t,e,n){var i,a,s,l,c,o=function(){var r=(new Date).getTime()-l;r<e&&r>=0?i=setTimeout(o,e-r):(i=null,n||(c=t.apply(s,a),i||(s=a=null)))};return function(){var r=n&&!i;return s=this,a=arguments,l=(new Date).getTime(),i||(i=setTimeout(o,e)),r&&(c=t.apply(s,a),s=a=null),c}},saveContainerElement=function(){var t=instanceData[this._id].config;"string"==typeof t.container&&(t.container=document.querySelector(t.container))},saveElements=function(){instanceData[this._id].elements=Array.prototype.slice.call(document.querySelectorAll(instanceData[this._id].config.watch+":not(."+instanceData[this._id].config.ignoreClass+")"))},saveScrollPosition=function(){instanceData[this._id].lastScrollPosition=getScrollPosition.call(this)},checkViewport=function(t){checkElements.call(this,t),checkInfinite.call(this,t),t!==initEvent&&saveScrollPosition.call(this)},checkElements=function(t){var e,n,i=instanceData[this._id],a=i.elements.length,s=i.config,l=s.inViewClass,c={eventType:t};for(n=0;n<a;n++)e=i.elements[n],c.el=e,"scroll"===t&&(c.direction=getScrolledDirection.call(this,getScrolledAxis.call(this))),isElementInView.call(this,e)?e.classList.contains(l)||(e.classList.add(l),s.onElementInView.call(this,c),s.watchOnce&&(i.elements.splice(n,1),a--,n--,e.classList.add(s.ignoreClass))):(e.classList.contains(l)||t===initEvent)&&(e.classList.remove(l),s.onElementOutOfView.call(this,c))},checkInfinite=function(t){var e,n,i,a,s,l,c,o=instanceData[this._id],r=o.config;if(r.infiniteScroll&&!o.isInfiniteScrollPaused)for(n=["x","y"],l=["onInfiniteXInView","onInfiniteYInView"],i=r.container,a=getViewableRange.call(this),s=[i.scrollWidth,i.scrollHeight],c={},e=0;e<2;e++)("scroll"===t&&hasScrollPositionChanged.call(this,n[e])||"resize"===t||"refresh"===t||t===initEvent)&&a[n[e]].end+r.infiniteOffset>=s[e]&&(c.eventType=t,"scroll"===t&&(c.direction=getScrolledDirection.call(this,n[e])),r[l[e]].call(this,c))},addListeners=function(){var t=instanceData[this._id],e=getScrollingElement.call(this);e.addEventListener("scroll",t.scrollHandler,!1),e.addEventListener("resize",t.resizeHandler,!1)},removeListeners=function(){var t=instanceData[this._id],e=getScrollingElement.call(this);e.removeEventListener("scroll",t.scrollHandler),e.removeEventListener("resize",t.resizeHandler)},getScrollingElement=function(){return isContainerWindow.call(this)?window:instanceData[this._id].config.container},getViewportSize=function(){return{w:instanceData[this._id].config.container.clientWidth,h:instanceData[this._id].config.container.clientHeight}},getScrollPosition=function(){var t,e={};return isContainerWindow.call(this)?(e.left=window.pageXOffset,e.top=window.pageYOffset):(t=instanceData[this._id].config.container,e.left=t.scrollLeft,e.top=t.scrollTop),e},getViewableRange=function(){var t={x:{},y:{}},e=getScrollPosition.call(this),n=getViewportSize.call(this);return t.x.start=e.left,t.x.end=t.x.start+n.w,t.x.size=t.x.end-t.x.start,t.y.start=e.top,t.y.end=t.y.start+n.h,t.y.size=t.y.end-t.y.start,t},getElementRange=function(t){var e,n={x:{},y:{}},i=getViewableRange.call(this),a=t.getBoundingClientRect();return isContainerWindow.call(this)?(n.x.start=a.left+i.x.start,n.x.end=a.right+i.x.start,n.y.start=a.top+i.y.start,n.y.end=a.bottom+i.y.start):(e=instanceData[this._id].config.container.getBoundingClientRect(),n.x.start=a.left-e.left+i.x.start,n.x.end=n.x.start+a.width,n.y.start=a.top-e.top+i.y.start,n.y.end=n.y.start+a.height),n.x.size=n.x.end-n.x.start,n.y.size=n.y.end-n.y.start,n},getScrolledAxis=function(){return hasScrollPositionChanged.call(this,"x")?"x":hasScrollPositionChanged.call(this,"y")?"y":void 0},getScrolledDirection=function(t){var e={x:["right","left"],y:["down","up"]},n={x:"left",y:"top"},i=instanceData[this._id].lastScrollPosition;return getScrollPosition.call(this)[n[t]]>i[n[t]]?e[t][0]:e[t][1]},hasScrollPositionChanged=function(t){var e={x:"left",y:"top"},n=instanceData[this._id].lastScrollPosition;return getScrollPosition.call(this)[e[t]]!==n[e[t]]},isElementInView=function(t){var e=getViewableRange.call(this),n=getElementRange.call(this,t);return isElementInVerticalView.call(this,n,e)&&isElementInHorizontalView.call(this,n,e)},isElementInVerticalView=function(t,e){var n=instanceData[this._id].config;return t.y.start<e.y.end+n.watchOffsetYBottom&&t.y.end>e.y.start-n.watchOffsetYTop},isElementInHorizontalView=function(t,e){var n=instanceData[this._id].config;return t.x.start<e.x.end+n.watchOffsetXRight&&t.x.end>e.x.start-n.watchOffsetXLeft},isContainerWindow=function(){return instanceData[this._id].config.container===window.document.documentElement},mergeOptions=function(t){extend(instanceData[this._id].config,config,t)},handler=function(t){var e=t.type;instanceData[this._id]&&("resize"===e||hasScrollPositionChanged.call(this,"x")||hasScrollPositionChanged.call(this,"y"))&&checkViewport.call(this,e)},ScrollWatch=function(t){var e;if(!(this instanceof ScrollWatch))return new ScrollWatch(t);Object.defineProperty(this,"_id",{value:instanceId++}),e=instanceData[this._id]={config:{},elements:[],lastScrollPosition:{top:0,left:0},isInfiniteScrollPaused:!1},mergeOptions.call(this,t),e.config.debounce?(e.scrollHandler=debounce(handler.bind(this),e.config.scrollDebounce,e.config.debounceTriggerLeading),e.resizeHandler=debounce(handler.bind(this),e.config.resizeDebounce,e.config.debounceTriggerLeading)):(e.scrollHandler=throttle(handler.bind(this),e.config.scrollThrottle,this),e.resizeHandler=throttle(handler.bind(this),e.config.resizeThrottle,this)),saveContainerElement.call(this),addListeners.call(this),saveElements.call(this),checkViewport.call(this,initEvent)};ScrollWatch.prototype={refresh:function(){saveElements.call(this),checkViewport.call(this,"refresh")},destroy:function(){removeListeners.call(this),delete instanceData[this._id]},updateWatchOffsetXLeft:function(t){instanceData[this._id].config.watchOffsetXLeft=t},updateWatchOffsetXRight:function(t){instanceData[this._id].config.watchOffsetXRight=t},updateWatchOffsetYTop:function(t){instanceData[this._id].config.watchOffsetYTop=t},updateWatchOffsetYBottom:function(t){instanceData[this._id].config.watchOffsetYBottom=t},pauseInfiniteScroll:function(){instanceData[this._id].isInfiniteScrollPaused=!0},resumeInfiniteScroll:function(){instanceData[this._id].isInfiniteScrollPaused=!1}};
//# sourceMappingURL=index.bc110a09.js.map
