dojo.provide("dojox.grid._grid.lib");
// summary: grid utility library
dojo.mixin(dojox.grid,{

	na: '...',

	nop: function(){
		// summary: a null function?
	},

	fire: function(ob, ev, args){
		var fn = ob && ev && ob[ev];
		return fn && (args ? fn.apply(ob, args) : ob[ev]());
	},
	
	// from lib.js
	setStyleText: function(inNode, inStyleText){
		if(inNode.style.cssText == undefined){
			inNode.setAttribute("style", inStyleText);
		}else{
			inNode.style.cssText = inStyleText;
		}
	},
	
	getStyleText: function(inNode, inStyleText){
		return (inNode.style.cssText == undefined ? inNode.getAttribute("style") : inNode.style.cssText);
	},
	
	setStyle: function(inElement, inStyle, inValue){
		if(inElement && inElement.style[inStyle] != inValue){
			inElement.style[inStyle] = inValue;
		}
	},
	
	setStyleHeightPx: function(inElement, inHeight){
		if(inHeight >= 0){
			dojox.grid.setStyle(inElement, 'height', inHeight + 'px');
		}
	},
	
	mouseEvents: [ 'mouseover', 'mouseout', /*'mousemove',*/ 'mousedown', 'mouseup', 'click', 'dblclick', 'contextmenu' ],

	keyEvents: [ 'keyup', 'keydown', 'keypress' ],

	funnelEvents: function(inNode, inObject, inMethod, inEvents){
		var evts = (inEvents ? inEvents : dojox.grid.mouseEvents.concat(dojox.grid.keyEvents));
		for (var i=0, l=evts.length; i<l; i++){
			dojo.connect(inNode, 'on' + evts[i], inObject, inMethod);
		}
	},

	removeNode: function(inNode){
		inNode = dojo.byId(inNode);
		inNode && inNode.parentNode && inNode.parentNode.removeChild(inNode);
		return inNode;
	},
	
	// needed? dojo has _getProp
	getRef: function(name, create, context){
		var obj=context||dojo.global, parts=name.split("."), prop=parts.pop();
		for(var i=0, p; obj&&(p=parts[i]); i++){
			obj = (p in obj ? obj[p] : (create ? obj[p]={} : undefined));
		}
		return { obj: obj, prop: prop }; 
	},
	
	getProp: function(name, create, context){
		var ref = dojox.grid.getRef(name, create, context);
		return (ref.obj)&&(ref.prop)&&(ref.prop in ref.obj ? ref.obj[ref.prop] : (create ? ref.obj[ref.prop]={} : undefined));
	},
	
	indexInParent: function(inNode){
		var i=0, n, p=inNode.parentNode;
		while((n = p.childNodes[i++])){
			if(n == inNode){
				return i - 1;
			}
		}
		return -1;
	},
	
	cleanNode: function(inNode){
		if(!inNode){
			return;
		}
		var filter = function(inW){
			return inW.domNode && dojo.isDescendant(inW.domNode, inNode, true);
		}
		var ws = dijit.registry.filter(filter);
		for(var i=0, w; (w=ws[i]); i++){
			w.destroy();
		}
		delete ws;
	},
	
	getTagName: function(inNodeOrId){
		var node = dojo.byId(inNodeOrId);
		return (node && node.tagName ? node.tagName.toLowerCase() : '');
	},
	
	nodeKids: function(inNode, inTag){
		var result = [];
		var i=0, n;
		while((n = inNode.childNodes[i++])){
			if(dojox.grid.getTagName(n) == inTag){
				result.push(n);
			}
		}
		return result;
	},
	
	divkids: function(inNode){
		return dojox.grid.nodeKids(inNode, 'div');
	},
	
	focusSelectNode: function(inNode){
		try{
			dojox.grid.fire(inNode, "focus");
			dojox.grid.fire(inNode, "select");
		}catch(e){// IE sux bad
		}
	},
	
	whenIdle: function(/*inContext, inMethod, args ...*/){
		setTimeout(dojo.hitch.apply(dojo, arguments), 0);
	},
	
	arrayCompare: function(inA, inB){
		for(var i=0,l=inA.length; i<l; i++){
			if(inA[i] != inB[i]){return false;}
		}
		return (inA.length == inB.length);
	},
	
	arrayInsert: function(inArray, inIndex, inValue){
		if(inArray.length <= inIndex){
			inArray[inIndex] = inValue;
		}else{
			inArray.splice(inIndex, 0, inValue);
		}
	},
	
	arrayRemove: function(inArray, inIndex){
		inArray.splice(inIndex, 1);
	},
	
	arraySwap: function(inArray, inI, inJ){
		var cache = inArray[inI];
		inArray[inI] = inArray[inJ];
		inArray[inJ] = cache;
	}
});

dojox.grid.jobs = {

	cancel: function(inHandle){
		if(inHandle){
			window.clearTimeout(inHandle);
		}
	},

	jobs: [],

	job: function(inName, inDelay, inJob){
		dojox.grid.jobs.cancelJob(inName);
		var job = function(){
			delete dojox.grid.jobs.jobs[inName];
			inJob();
		}
		dojox.grid.jobs.jobs[inName] = setTimeout(job, inDelay);
	},

	cancelJob: function(inName){
		dojox.grid.jobs.cancel(dojox.grid.jobs.jobs[inName]);
	}

}
