var titles = new Array();
var capitalizedTitles = new Array();
var preTitles = new Array();
var oldPreTitles = new Array();
var loading = false, loadingTime;
var keyUpTime;
var overrideList = new Array();
var tid = 0;
var CMTSettings;
var onchange = false;
var oldPostText = "";
var postText = "";
var license_str;
var capitalizationIssues = 0;
var newContentState;
var contentState;
const queryString = window.location.search;
const coreUrlParams = new URLSearchParams(queryString);
const showDebug = coreUrlParams.get('showDebug');
var clickEventRunning = false;
var gutenbergkeys = {};



var xml;
var onloaded = false;
loadingTime = Date.now();
keyUpTime = Date.now();

jQuery(document).ready(function($) {

	jQuery(".cmt-tooltip").hover(function(){
	    jQuery(this).closest("tr").find(".cmt-tooltip-text").fadeIn(100);
	},function(){
	    jQuery(this).closest("tr").find(".cmt-tooltip-text").fadeOut(100);
	});
});

function setLicenseInfo(lic, url) {
    license_str = JSON.stringify({l_key: lic, l_url: url});
}

jQuery.fn.outerHTML = function(){

	// IE, Chrome & Safari will comply with the non-standard outerHTML, all others (FF) will have a fall-back for cloning
	return (!this.length) ? this : (this[0].outerHTML || (
	  function(el){
		  var div = document.createElement('div');
		  div.appendChild(el.cloneNode(true));
		  var contents = div.innerHTML;
		  div = null;
		  return contents;
	})(this[0]));

}

function loadCMTSettings (newSettings) {
	CMTSettings = newSettings;
}

function getPostText(titles) {
	var postStr = "{\"title_input\":{\"titles\":{";
	
	
	var settings = CMTSettings;
	
	var i = 1;
    var escaped_val;
    
    
    if(showDebug) console.log("Titles: " + JSON.stringify(titles));
    if(showDebug) console.log("Settings: " + JSON.stringify(settings));

	jQuery.each( titles, function( key, value ) {
        try {
            if(showDebug) console.log("Post Text: Header Tag: " + value.headerTag + ", titleText: " + value.titleText + " Settings: " + settings[value.headerTag].style + " " + settings[value.headerTag].substyle);
            escaped_val = value.titleText.replaceAll('"',"\\\"");
            postStr += "\""+(key+1)+"\":{\"title\":\""+escaped_val+"\",\"style\": \""+settings[value.headerTag].style+"\",\"substyle\": \""+settings[value.headerTag].substyle+"\",\"id\": \""+(key+1)+"\"},";            
        }
        catch(err) {
          if(showDebug) console.log(err.message);
        }
                

		
	});
	postStr = postStr.slice(0,-1);

	postStr += "}}}";

	return postStr;

}

function parseHTMLtoArray(titles) {
	var newTitles = new Array();
	var headerTag;
	var titleText;
	jQuery.each( titles, function( key, value ) {
		headerTag = jQuery(value).get( 0 ).nodeName;
		fullText = stripScripts(value);
		titleText = jQuery(value).text(); 
		newTitles.push({headerTag, titleText, fullText});
	});
	return newTitles;
}


function getTitles(titles) {
    oldPostText = postText;
    
	postText = getPostText(titles);
    
    
	if(showDebug) console.log("Post Str: " + JSON.stringify(postText));
	
    if(oldPostText != postText && postText != "{\"title_input\":{\"titles\":}}}") {
        if(showDebug) console.log("Post Str: " + JSON.stringify(postText));    
        capitalizeTitles(postText);
    }
}

function _0x4168(){var _0x54d08b=['1055oZzSiZ','1181912eMpSLh','first-letter','1256SYLUlh','14587209pDRxWL','toUpperCase','1828967qcVJph','title-case','apa','5951154RnFetu','toggle-case','toLowerCase','email','uppercase','227415svTbkl','28FPJEfn','740711RAEDFE','lowercase','wikipedia'];_0x4168=function(){return _0x54d08b;};return _0x4168();}function _0x5b59(_0x31fac2,_0x2f7734){var _0x416890=_0x4168();return _0x5b59=function(_0x5b59c1,_0x214112){_0x5b59c1=_0x5b59c1-0x150;var _0x52d3c3=_0x416890[_0x5b59c1];return _0x52d3c3;},_0x5b59(_0x31fac2,_0x2f7734);}(function(_0x70285f,_0x31af85){var _0xbec818=_0x5b59,_0x3f6b20=_0x70285f();while(!![]){try{var _0x30215b=-parseInt(_0xbec818(0x154))/0x1+-parseInt(_0xbec818(0x153))/0x2*(parseInt(_0xbec818(0x152))/0x3)+-parseInt(_0xbec818(0x15a))/0x4*(parseInt(_0xbec818(0x157))/0x5)+parseInt(_0xbec818(0x160))/0x6+-parseInt(_0xbec818(0x15d))/0x7+parseInt(_0xbec818(0x158))/0x8+parseInt(_0xbec818(0x15b))/0x9;if(_0x30215b===_0x31af85)break;else _0x3f6b20['push'](_0x3f6b20['shift']());}catch(_0x2073b4){_0x3f6b20['push'](_0x3f6b20['shift']());}}}(_0x4168,0x9a063));function capitalizationHelper(_0x5e634d,_0x237e53,_0x1e394f){var _0x27f7d1=_0x5b59,_0x578063,_0x4e3a71;_0x237e53=_0x237e53[_0x27f7d1(0x162)](),_0x1e394f=_0x1e394f['toLowerCase']();if(_0x1e394f=='sentence-case')_0x578063=APASentenceCase(_0x5e634d);else{if(_0x1e394f==_0x27f7d1(0x151))_0x578063=_0x5e634d[_0x27f7d1(0x15c)]();else{if(_0x1e394f==_0x27f7d1(0x155))_0x578063=_0x5e634d['toLowerCase']();else{if(_0x1e394f==_0x27f7d1(0x159))_0x578063=toStartCase(_0x5e634d[_0x27f7d1(0x162)]());else{if(_0x1e394f=='alt-case')_0x578063=AltCase(_0x5e634d['toLowerCase']());else{if(_0x1e394f==_0x27f7d1(0x161))_0x578063=swapCase(_0x5e634d[_0x27f7d1(0x162)]());else _0x1e394f==_0x27f7d1(0x15e)&&(_0x4e3a71=_0x237e53,(_0x4e3a71==_0x27f7d1(0x150)||_0x4e3a71==_0x27f7d1(0x156))&&(_0x4e3a71=_0x27f7d1(0x15f)),_0x4e3a71!='chicago'?_0x4e3a71=_0x4e3a71['toUpperCase']():_0x4e3a71=upper(_0x4e3a71),_0x578063=capitalizeFirst(make_fixes(window[_0x4e3a71](_0x5e634d['toLowerCase']()))));}}}}}return _0x578063;}

function capitalizeTitles(postText) {
    var titles = JSON.parse(postText);
    var resp = {};
    var tempTitle;
    var tempStyle;
    resp["status"] = "success";
    resp["code"] = 200;
    resp["message"] = "OK";
    resp["data"] = [];
    resp["origin"]=null;
    jQuery.each(titles.title_input.titles, function(index, val) {
        tempTitle = capitalizationHelper(val.title, val.style, val.substyle);
        resp["data"].push([ index, {"input" : val.title, "output" : tempTitle, "style":val.style,"sub-style":val.substyle, "word-count" : getWordCount(tempTitle), "char-count" : getCharCount(tempTitle)}]);
        
    });

    if(showDebug) console.log("Response2: " + JSON.stringify(resp));
    capitalizedTitles = parseAPIResponse(resp);
}

function parseAPIResponse(response) {
	var data;
	var capitalizedTitles = new Array();
	if(response.status == "success") {
	   data = response.data;
		jQuery.each(data, function(index, val) {
			capitalizedTitles.push(val[1].output);
		});
	  }
	return capitalizedTitles;
}
var delayUpdate = function(){
	if(loading){
        setTimeout(function(){
            if(showDebug) console.log("delayUpdate restarting");
            loading = false;
            updateTitles();
        }, 1000);
	}
}

function isGutenberg() {
    if (!jQuery('#title').length || (typeof(gutenbergActive) != "undefined" && gutenbergActive)) {
        return true;
    }
    return false;
}

function simulateClicks() {
    //console.log("tab text: " + jQuery('#fusion_toggle_builder').length);
	if(jQuery('.wpb_switch-to-composer').length && jQuery('.wpb_switch-to-composer').text() == "Classic Mode") {
		jQuery('.wpb_switch-to-composer').click();
		jQuery('.wpb_switch-to-composer').click();
	}
    if(jQuery('#fusion_toggle_builder').length) {
        jQuery('#fusion_toggle_builder').click();  
        jQuery('#fusion_toggle_builder').click();  
    }
}

function stripScripts(input) {
    // Remove script tags and attributes that might have inline JavaScript
    return input.replace(/<script[^>]*>([\S\s]*?)<\/script>/gmi, '')
                .replace(/javascript:/gi, '')
                .replace(/on\w+="[^"]*"/gmi, '');
}

function getUpdatedHeadersFromText(text, title) {
    titles = new Array();
	oldPreTitles = preTitles.slice();
	preTitles = new Array();
	var txt = "";
	
    if(showDebug) console.log("Text/title: " + text, title);
    if(typeof(text) !== "undefined" && typeof(title) !== "undefined") {
        txt = text;
        preTitles.push("<title>" + stripScripts(title) + "</title>");
    } else {
        if(isGutenberg()) {
            txt = wp.data.select( "core/editor" ).getEditedPostAttribute('content');
            preTitles.push("<title>" + stripScripts(jQuery(".editor-post-title__input").text())+ "</title>");
        } else {
            if(typeof(tinyMCE) !== "undefined" && typeof(tinyMCE.get('content')) !== "undefined" && tinyMCE.get('content') != null){
                var activeEditor = tinyMCE.get('content');

                txt = stripScripts(activeEditor.getContent());
            } else {
                txt = stripScripts(jQuery("#content").val());
            }

            preTitles.push("<title>" + stripScripts(jQuery("#title").val()) + "</title>");
        }
    }

	var jQuerytxt = jQuery("<html><body><div id='1'>" + stripScripts(txt) + "</div></body></html>");

		jQuerytxt.find(":header").each(function(){
			preTitles.push(stripScripts(jQuery(this).outerHTML()));

		});
    
        return parseHTMLtoArray(preTitles);
}

function updateTitles (text, title) {
    if(!loading) {
        titles = getUpdatedHeadersFromText(text, title);
        if(showDebug) console.log("updateTitles - titles: ", JSON.stringify(titles));
        loadingTime = Date.now(); 
        loading = true;
        getTitles(titles);
        updateTitleTextFooter();

        if(showDebug) console.log("updateTitles - titles2: ", JSON.stringify(titles));
        loading = false;
        
    }
}
  
function capitalizeButtonClicked(id) {
    loading = false;
    clickEventRunning = true;
	capitalizeContentHeaders(new Array(id));
	updateTitles();
    clickEventRunning = false;
    return false;
}

function decodeHtml(str) {
    str = stripScripts(str);
    var map =
    {
        '&amp;': '&',
        '&lt;': '<',
        '&gt;': '>',
        '&quot;': '"',
        '&#039;': "'",
        '&nbsp;': " "
   };
    return str.replaceAll(/&amp;|&lt;|&gt;|&quot;|&#039;|&nbsp;/g, function (m) { return map[m];
    //return str.replaceAll(/&lt;|&gt;|&quot;|&#039;|&nbsp;/g, function (m) { return map[m];

});}

function fixAmpersand(str) {
    var map =
    {
        '&': '&amp;'
   };
    return str.replaceAll(/&/g, function (m) { return map[m];
    //return str.replaceAll(/<|>|\"|\'/g, function (m) { return map[m];

});}

function encodeHtml(str) {
    str = stripScripts(str);
    var map =
    {
        '&': '&amp;',
        '<': '&lt;',
        '>':'&gt;',
        '"':'&quot;',
        "'" :'&#039;',
        " " : '&nbsp;'
   };
    return str.replaceAll(/&|<|>|\"|\'/g, function (m) { return map[m];
    //return str.replaceAll(/<|>|\"|\'/g, function (m) { return map[m];

});}

function encodeQuotes(str) {
    var map =
    {
        '"':'&quot;',
        "'" :'&#039;'
   };
    return str.replaceAll(/\"|\'/g, function (m) { return map[m];

});}

function decodeQuotes(str) {
    var map =
    {
        '&quot;':'"',
        "&#039;" :"'"
   };
    return str.replaceAll(/&quot;|&#039;/g, function (m) { return map[m];

});}

function capitalizeContentHeadersBulkUpdate(content, title) {
    var currentTitles = getUpdatedHeadersFromText(content, title);
    getTitles(currentTitles);
    if(showDebug) console.log("capitalized titles:", JSON.stringify(capitalizedTitles));
    var originalTitle, heading, newTitle, id, findStr, replaceStr, postTitle;
    jQuery.each(currentTitles, function(key, value) {
        if(showDebug) console.log("capitalizeContentHeadersBulkUpdate",key, currentTitles[key].titleText, capitalizedTitles[key]);
        originalTitle = encodeHtml(currentTitles[key].titleText);
        heading = currentTitles[key].headerTag;
        newTitle = encodeHtml(capitalizedTitles[key]);

        findStr = fixAmpersand(encodeQuotes(decodeHtml(currentTitles[key].fullText)));

        replaceStr = (newTitle != "Loading...") ? encodeQuotes(findStr.replaceAll(originalTitle,newTitle)) : encodeQuotes(findStr);

        if(heading == "TITLE") {
            postTitle = decodeHtml(newTitle);
        } else {

            //if(findStr != replaceStr) {
            if(showDebug) console.log("id: "+id+", Find: " + findStr + " Replace:" + replaceStr +".");
            //}
            if(showDebug) console.log("Content first:" +  content);

            content = content.replaceAll(findStr, replaceStr);
            content = content.replaceAll(findStr.trim(), replaceStr.trim());

            findStr = decodeHtml(findStr);
            content = content.replace(findStr, replaceStr);


        }

    });
 

    
    content = decodeQuotes(content);
    
    var ret = {"content":content, "title": postTitle};
    return ret;
}

function capitalizeContentHeaders(ids) {
	
    var currentTitles = getUpdatedHeadersFromText();
    //console.log("IDs length: " + ids.toString() + ", titleslegnth: " + currentTitles.length);
    //console.log("titles: " + JSON.stringify(currentTitles));
    
    var originalTitle, heading, newTitle, override, id, content, findStr, replaceStr;
    
    if(isGutenberg()) {
        //content = wp.data.select( "core/editor" ).getCurrentPost().content;
        content = wp.data.select( "core/editor" ).getEditedPostAttribute('content');
      preTitles.push("<title>" + stripScripts(jQuery(".editor-post-title__input").val())+ "</title>");
    } else {
        var activeEditor = tinyMCE.get('content');
        if(activeEditor!==null){
          //txt = activeEditor.getContent();
            content = activeEditor.getContent();
        } else {
            content = jQuery("#content").val();
        }

    }
        
    jQuery.each(ids, function(key, id) {
        
        
        originalTitle = encodeHtml(jQuery("#CMT_OriginalTitle_" + id).text().trim());
        heading = stripScripts(jQuery("#CMT_OriginalHeader_" + id).text());
        newTitle = encodeHtml(jQuery("#CMT_CapitalizedText_" + id).val().trim());
        override = jQuery("#CMT_Override_" + id).is(':checked');

        findStr = encodeQuotes(currentTitles[id].fullText);

        
        
        if(!override && newTitle != "Loading...") {
            replaceStr = encodeQuotes(findStr.replaceAll(originalTitle,newTitle));
            if(heading == "TITLE") {
                if(isGutenberg()) {
                    //jQuery(".editor-post-title__input").val(decodeHtml(newTitle));
                    wp.data.dispatch( 'core/editor' ).editPost( { title: decodeHtml(newTitle)} )
                } else {
                    jQuery("#title").val(decodeHtml(newTitle));
                }
            } else {

                //if(findStr != replaceStr) {
                if(showDebug) console.log("id: "+id+", Find: " + findStr + " Replace:" + replaceStr +".");
                //}
                if(showDebug) console.log("Content first:" +  content);

                content = content.replaceAll(findStr, replaceStr);
                content = content.replaceAll(findStr.trim(), replaceStr.trim());

                findStr = decodeHtml(findStr);
                content = content.replace(findStr, replaceStr);


            }

        }
    });
 
    if(isGutenberg()) {
    
        content = decodeQuotes(content);
        //console.log("edited content: " + content);
        wp.data.dispatch( 'core/block-editor' ).resetBlocks( wp.blocks.parse( content ));
    } else {
        var activeEditor = tinyMCE.get('content');
        if(activeEditor!==null){
          activeEditor.setContent(content);
        } else {
            jQuery("#content").val(content);
        }
        
    }
    
    
    simulateClicks();
	
}

function _0x5935(){var _0x312366=['show','Properly\x20capitalized','468563izZapY','<i\x20class=\x22fas\x20fa-spinner\x20fa-pulse\x22></i>','2099242jHqQJh','log','TITLE','#initialLoad','length','\x22\x20\x20aria-label=\x22','<button\x20type=\x22button\x22\x20class=\x22page-title-action\x20page-title-action-secondary\x20capitalize-button\x22\x20title=\x22Capitalize\x20Heading\x22\x20id=\x22CMT_Capitalize_','\x20not_capitalized\x20','\x22\x20title=\x22','checked','<td\x20name=\x22CMT_OriginalTitle\x22\x20id=\x22CMT_OriginalTitle_','<i\x20class=\x22fas\x20fa-check\x22>','\x22\x20onclick=\x27capitalizeButtonClicked(\x22','<td><input\x20name=\x22CMT_CapitalizedText\x22\x20type=\x22text\x22\x20class=\x22CMT_CapitalizedText_Input\x22\x20id=\x22CMT_CapitalizedText_','headerTag','</td>','\x20capitalized\x20','append','after','#noHeadersFound','CMT_Override_TD_','\x22)\x27>Capitalize</i></button>','undefined','#CMT_TitleTable\x20tbody\x20#tr_CMT_','#CMT_Override_','<div\x20align=\x22center\x22\x20id=\x22noHeadersFound\x22>No\x20headers\x20found.<br/><br/></div>','6606aOqKqR','3CPiyAu','Not\x20properly\x20capitalized','3619zXbePe','110hrQlEp','<i\x20class=\x22fas\x20fa-times\x22>','#tr_CMT_','253236hbzvSA','titleText','updateFooterText','toLowerCase','\x27\x20></td><td\x20class=\x22CMT_Capitalize_Button_TD\x22>','18913708SJaidQ','hide','12280FYMWTS','13380jlCWva','\x22\x20value=\x27','107092Wavoqf','Loading...','#CMT_TitleTable\x20tbody\x20tr','html','\x22\x20>','#CMT_TitleTable'];_0x5935=function(){return _0x312366;};return _0x5935();}(function(_0x5ccde0,_0x2daa04){var _0x44085d=_0x1442,_0x334410=_0x5ccde0();while(!![]){try{var _0x31f6f0=parseInt(_0x44085d(0x179))/0x1+-parseInt(_0x44085d(0x17b))/0x2*(-parseInt(_0x44085d(0x161))/0x3)+parseInt(_0x44085d(0x171))/0x4+parseInt(_0x44085d(0x164))/0x5*(-parseInt(_0x44085d(0x167))/0x6)+-parseInt(_0x44085d(0x163))/0x7*(parseInt(_0x44085d(0x16e))/0x8)+parseInt(_0x44085d(0x160))/0x9*(-parseInt(_0x44085d(0x16f))/0xa)+parseInt(_0x44085d(0x16c))/0xb;if(_0x31f6f0===_0x2daa04)break;else _0x334410['push'](_0x334410['shift']());}catch(_0x13cb64){_0x334410['push'](_0x334410['shift']());}}}(_0x5935,0x88c26));function _0x1442(_0x272667,_0x1bbfd0){var _0x59356a=_0x5935();return _0x1442=function(_0x1442ec,_0x2af6c0){_0x1442ec=_0x1442ec-0x155;var _0x28a992=_0x59356a[_0x1442ec];return _0x28a992;},_0x1442(_0x272667,_0x1bbfd0);}function updateTitleTextFooter(){var _0x117f8f=_0x1442,_0x5a799c,_0x4ab85c,_0xf19834,_0x3b62f8,_0x1c1df3,_0x5aeaad,_0x11a2c9,_0xd79b5b,_0x580f1d,_0x12bf34;originalTitles=getUpdatedHeadersFromText(),capitalizationIssues=0x0;for(var _0xe1cb3c=0x0;_0xe1cb3c<originalTitles['length'];_0xe1cb3c++){_0x12bf34=typeof jQuery(_0x117f8f(0x15a)+_0xe1cb3c)!=_0x117f8f(0x15c)?jQuery(_0x117f8f(0x15e)+_0xe1cb3c)['is'](':checked'):![],jQuery(_0x117f8f(0x159))['remove']();if(originalTitles[_0xe1cb3c][_0x117f8f(0x168)]==''&&originalTitles['length']==0x1)jQuery(_0x117f8f(0x176))[_0x117f8f(0x158)](_0x117f8f(0x15f)),jQuery(_0x117f8f(0x17e))[_0x117f8f(0x16d)]();else{_0x3b62f8=_0x12bf34?_0x117f8f(0x184):'';showDebug&&console[_0x117f8f(0x17c)](_0x117f8f(0x169),originalTitles[_0xe1cb3c][_0x117f8f(0x168)][_0x117f8f(0x16a)](),capitalizedTitles[_0xe1cb3c]['toLowerCase']());if(originalTitles[_0xe1cb3c][_0x117f8f(0x189)]!=_0x117f8f(0x17d))_0xd79b5b='',capitalizedTitleText='<td\x20colspan=\x222\x22\x20class=\x22TD_Get_Premium\x22>Use\x20<a\x20href=\x22http://capitalizemytitle.com/\x22\x20target=\x22_blank\x22>Capitalize\x20My\x20Title</a>\x20or\x20<a\x20href=\x22http://plugin.capitalizemytitle.com/\x22\x20target=\x22_blank\x22>get\x20premium</a>.\x20Use\x20code\x20UPGRADEFREE\x20for\x2015%\x20off.</td>';else originalTitles[_0xe1cb3c][_0x117f8f(0x189)]==_0x117f8f(0x17d)&&typeof capitalizedTitles[_0xe1cb3c]==='undefined'||originalTitles[_0xe1cb3c]['titleText'][_0x117f8f(0x16a)]()!=capitalizedTitles[_0xe1cb3c][_0x117f8f(0x16a)]()?(_0x11a2c9=_0x117f8f(0x172),_0xd79b5b=_0x117f8f(0x17a),capitalizedTitleText=_0x117f8f(0x188)+_0xe1cb3c+_0x117f8f(0x170)+_0x11a2c9+_0x117f8f(0x16b)+_0xd79b5b+_0x117f8f(0x155)):(_0x11a2c9=encodeHtml(capitalizedTitles[_0xe1cb3c]),_0xd79b5b=_0x117f8f(0x181)+_0xe1cb3c+_0x117f8f(0x187)+_0xe1cb3c+_0x117f8f(0x15b),capitalizedTitleText=_0x117f8f(0x188)+_0xe1cb3c+'\x22\x20value=\x27'+_0x11a2c9+_0x117f8f(0x16b)+_0xd79b5b+_0x117f8f(0x155));encodeHtml(originalTitles[_0xe1cb3c][_0x117f8f(0x168)])==encodeHtml(capitalizedTitles[_0xe1cb3c])||_0x12bf34||_0x11a2c9==_0x117f8f(0x172)?(_0x1c1df3=_0x117f8f(0x156),_0x5aeaad=_0x117f8f(0x186),_0x580f1d=_0x117f8f(0x178)):(_0x1c1df3=_0x117f8f(0x182),_0x5aeaad=_0x117f8f(0x165),_0x580f1d=_0x117f8f(0x162),capitalizationIssues++),_0xf19834='<td\x20class=\x22CMT_OriginalHeader_TD\x22\x20id=\x22CMT_OriginalHeader_'+_0xe1cb3c+_0x117f8f(0x175)+originalTitles[_0xe1cb3c][_0x117f8f(0x189)]+_0x117f8f(0x155)+'<td\x20class=\x22CMT_Capitalize_Button_Check_TD\x22><button\x20type=\x22button\x22\x20class=\x22button-primary\x20'+_0x1c1df3+_0x117f8f(0x183)+_0x580f1d+'\x22\x20id=\x22CMT_Capitalize_Check_'+_0xe1cb3c+_0x117f8f(0x180)+_0x580f1d+'\x22>'+_0x5aeaad+'</i></button></td>'+_0x117f8f(0x185)+_0xe1cb3c+'\x22>'+stripScripts(originalTitles[_0xe1cb3c][_0x117f8f(0x168)])+_0x117f8f(0x155)+capitalizedTitleText,jQuery('#tr_CMT_'+_0xe1cb3c)[_0x117f8f(0x17f)]?jQuery(_0x117f8f(0x166)+_0xe1cb3c)[_0x117f8f(0x174)](stripScripts(_0xf19834)):(_0x5a799c='<tr\x20id=\x22tr_CMT_'+_0xe1cb3c+'\x22>',_0x4ab85c='</tr>',jQuery('#CMT_TitleTable\x20tbody')[_0x117f8f(0x157)](_0x5a799c+_0xf19834+_0x4ab85c)),jQuery(_0x117f8f(0x166)+_0xe1cb3c)[_0x117f8f(0x177)](),originalTitles[_0xe1cb3c][_0x117f8f(0x168)]==''&&jQuery('#tr_CMT_'+_0xe1cb3c)[_0x117f8f(0x16d)]();}updateSidebarLabelText();}var _0x558c81=jQuery(_0x117f8f(0x173))[_0x117f8f(0x17f)];for(var _0x4a923d=originalTitles[_0x117f8f(0x17f)];_0x4a923d<=_0x558c81;_0x4a923d++){jQuery(_0x117f8f(0x15d)+_0x4a923d)['remove']();}loading=![],onchange=![],jQuery('#initialLoad')[_0x117f8f(0x16d)]();}
  
  function stripScripts(input) {
      // Remove script tags and attributes that might have inline JavaScript
      return input.replace(/<script[^>]*>([\S\s]*?)<\/script>/gmi, '')
                  .replace(/javascript:/gi, '')
                  .replace(/on\w+="[^"]*"/gmi, '');
  }

function updateSidebarLabelText() {
    jQuery("#cmt-sidebar-label-number").text(capitalizationIssues);
    jQuery("#cmt-sidebar-label-number-classic").text(capitalizationIssues);
    if(capitalizationIssues > 0) {
        jQuery("#cmt-sidebar-label-number").addClass("issues");
        jQuery("#cmt-sidebar-label-number-classic").addClass("issues");
    } else {
        jQuery("#cmt-sidebar-label-number").removeClass("issues");
        jQuery("#cmt-sidebar-label-number-classic").removeClass("issues");
    }
}
 



function toTitleCase(str) {
    return str.replaceAll(/\w\S*/g, function(txt){
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}


function CMTSidebarWidget() {
    var el = wp.element.createElement;
var __ = wp.i18n.__;
var PluginDocumentSettingPanel = wp.editPost.PluginDocumentSettingPanel;

    var issues = "";
    if(capitalizationIssues > 0) {
        issues ="issues";
    } 
    return el(
        PluginDocumentSettingPanel,
        {
            className: 'cmt-sidebar-plugin',
            title: 'Capitalize My Title',
            icon: false
        },
        __( wp.element.RawHTML( {
            children: '<label id="cmt-sidebar-label"><a href="#cmt-meta" id="cmt-sidebar-label-number" class="'+issues+'">' + capitalizationIssues + '</a> capitalization issues found</label><span id="cmt-sidebar-icon"></span>'
        } ) )
    );
}

function addSidebarWidgetGutenberg() {
    var registerPlugin = wp.plugins.registerPlugin;

    registerPlugin( 'my-document-setting-plugin', {
        render: CMTSidebarWidget,
    } );
    updateSidebarLabelText();
}

function addSidebarWidgetClassic () {
    if(jQuery('.misc-pub-cmt').length || typeof(jQuery('.misc-pub-cmt').html()) !== "undefined") return;
    var issues = "";
    if(capitalizationIssues > 0) {
        issues = "issues";
    } 
    jQuery("#misc-publishing-actions").append('<div class="misc-pub-section curtime misc-pub-cmt"><label id="cmt-sidebar-label"><a href="#cmt-meta" id="cmt-sidebar-label-number-classic" class="'+issues+'">' + capitalizationIssues + '</a> capitalization issues found</label><span id="cmt-sidebar-icon"></span></div>');
}

function processKeyUp(e, keyup) {
    
    if(e == null) {
        updateTitleTextFooter();
        updateTitles();
    } else {
        if(showDebug) console.log("Gutenberg keys:",JSON.stringify(gutenbergkeys));
        gutenbergkeys[e.which] = true;
        processKeyCommands(e);
        
        if(keyup) {
            delete gutenbergkeys[e.which];
        }
        if((Date.now() - keyUpTime)/1000 >= 7) {
            if(showDebug) console.log("Key up triggered",keyUpTime, Date.now(), (Date.now() - keyUpTime)/1000);
            updateTitleTextFooter();
            loading = false;
            keyUpTime = Date.now();
            updateTitles();
        }
    }
}

function addGlobalKeys() {

    jQuery(document).keydown(function (e) {
        gutenbergkeys[e.which] = true;
        /*if( gutenbergkeys.hasOwnProperty('18') && gutenbergkeys.hasOwnProperty('84') && gutenbergkeys.hasOwnProperty('65')){	
            event.preventDefault();
            capitalizeAllTitles();
            gutenbergkeys = {};
        } */ 
        processKeyCommands(e);
    });

    jQuery(document).keyup(function (e) {
        delete gutenbergkeys[e.which];
    });
}

function changeHeaderType(header) {
    let selectedBlock = wp.data.select( 'core/block-editor' ).getSelectedBlock ();
    var content = selectedBlock.attributes.content;
    
    if(showDebug) console.log("block attributes:",JSON.stringify(selectedBlock.attributes));
     
    wp.data.dispatch( 'core/block-editor' ).updateBlock( selectedBlock.clientId, {
        attributes: {
            level: header,
            content: content
        },
        name: 'core/heading'
    } );
}

function processKeyCommands(e) {
    if(showDebug) console.log("Gutenberg keys: ",JSON.stringify(gutenbergkeys));
    if(isGutenberg() &&  gutenbergkeys.hasOwnProperty('16') && gutenbergkeys.hasOwnProperty('18')){	
        if(showDebug) console.log("Shift and Alt pressed");
        e.preventDefault();
        if(gutenbergkeys.hasOwnProperty('49')) {
            changeHeaderType(1);
            //gutenbergkeys = {};
        } else if(gutenbergkeys.hasOwnProperty('50')) {
            changeHeaderType(2);
            //gutenbergkeys = {};
        } else if(gutenbergkeys.hasOwnProperty('51')) {
            changeHeaderType(3);
            //gutenbergkeys = {};
        } else if(gutenbergkeys.hasOwnProperty('52')) {
            changeHeaderType(4);
            //gutenbergkeys = {};
        } else if(gutenbergkeys.hasOwnProperty('53')) {
            changeHeaderType(5);
            //gutenbergkeys = {};
        } else if(gutenbergkeys.hasOwnProperty('54')) {
            changeHeaderType(6);
           //gutenbergkeys = {};   
        }
    }
}

function addGutenbergListeners() {

        let contentState = wp.data.select( 'core/editor' ).getEditedPostContent();


        addSidebarWidgetGutenberg();

        wp.data.subscribe(_.debounce( ()=> {
            
            let ourBlocks = wp.data.select( 'core/block-editor' ).getBlocks();   

            let isTyping = wp.data.select( 'core/block-editor' ).isTyping();

            let selectedBlock = wp.data.select( 'core/block-editor' ).getSelectedBlock ();

            newContentState = wp.data.select( 'core/editor' ).getEditedPostContent();
            if ( contentState !== newContentState) {  
                //updateTitles();
                updateTitleTextFooter();
                //if((Date.now() - keyUpTime)/1000 >= 5) {
                    //console.log("Key up triggered");
                    //loading = false;
                    if(selectedBlock != null && typeof(selectedBlock) != "undefined" && typeof(selectedBlock.name) != "undefined" && selectedBlock.name == "core/heading") {
                        processKeyUp(null, false);
                        if(showDebug) console.log("Gutenberg update from subscribe");
                    }
                //}
            }
            // Update reference.
            contentState = newContentState;
        }, 100 ) );
        
        wp.data.dispatch( 'core/keyboard-shortcuts' ).registerShortcut( {
            name: 'heading-transform-h1',
            category: 'selection',
            description: 'Transform to H1 heading.',
            keyCombination: {
                modifier: 'access',
                character: '1',
            },
        } );
        
        wp.data.dispatch( 'core/keyboard-shortcuts' ).registerShortcut( {
            name: 'heading-transform-h2',
            category: 'selection',
            description: 'Transform to H2 heading.',
            keyCombination: {
                modifier: 'access',
                character: '2',
            },
        } );
        wp.data.dispatch( 'core/keyboard-shortcuts' ).registerShortcut( {
            name: 'heading-transform-h3',
            category: 'selection',
            description: 'Transform to H3 heading.',
            keyCombination: {
                modifier: 'access',
                character: '3',
            },
        } );
        
        wp.data.dispatch( 'core/keyboard-shortcuts' ).registerShortcut( {
            name: 'heading-transform-h4',
            category: 'selection',
            description: 'Transform to H4 heading.',
            keyCombination: {
                modifier: 'access',
                character: '4',
            },
        } );
        wp.data.dispatch( 'core/keyboard-shortcuts' ).registerShortcut( {
            name: 'heading-transform-h5',
            category: 'selection',
            description: 'Transform to H5 heading.',
            keyCombination: {
                modifier: 'access',
                character: '5',
            },
        } );
        wp.data.dispatch( 'core/keyboard-shortcuts' ).registerShortcut( {
            name: 'heading-transform-h6',
            category: 'selection',
            description: 'Transform to H6 heading.',
            keyCombination: {
                modifier: 'access',
                character: '6',
            },
        } );
        
        wp.blocks.registerBlockVariation('core/heading', {
            name: 'sht/h1',
            title: 'H1 Heading',
            attributes: { level: 1 },
            icon: "cmt-icon-heading"
        });
        
        wp.blocks.registerBlockVariation('core/heading', {
            name: 'sht/h2',
            title: 'H2 Heading',
            attributes: { level: 2 },
            icon: "cmt-icon-heading"
        });
        
        wp.blocks.registerBlockVariation('core/heading', {
            name: 'sht/h3',
            title: 'H3 Heading',
            attributes: { level: 3 },
            icon: "cmt-icon-heading"
        });
        
        wp.blocks.registerBlockVariation('core/heading', {
            name: 'sht/h4',
            title: 'H4 Heading',
            attributes: { level: 4 },
            icon: "cmt-icon-heading"
        });
        
        wp.blocks.registerBlockVariation('core/heading', {
            name: 'sht/h5',
            title: 'H5 Heading',
            attributes: { level: 5 },
            icon: "cmt-icon-heading"
        });
        
        wp.blocks.registerBlockVariation('core/heading', {
            name: 'sht/h6',
            title: 'H6 Heading',
            attributes: { level: 6 },
            icon: "cmt-icon-heading"
        });
        
}

function addTinyMCEListeners () {
    var activeEditor = tinyMCE.get('content');
    
    if(activeEditor!==null){
        addSidebarWidgetClassic ();
        tinymce.get('content').on('keyup',function(e){processKeyUp(e, true)});
        tinymce.get('content').on('keydown',function(e){processKeyUp(e, false)});
        tinymce.get('content').on('change',function(e){processKeyUp(e, false)});
        tinymce.get('content').on('paste',function(e){processKeyUp(e, false)});
        tinymce.get('content').on('keypress', function (e) {
            processKeyUp(e, false);
        });
        
    }
     addTabListeners();
}

function addTitleListeners() {

    
	if(!isGutenberg()) {
		jQuery("#title").on('keyup',function(e){processKeyUp(e, true);});
	}
	else {
        
		jQuery(".editor-post-title__input").on('keyup',function(e){processKeyUp(e, true);});
	}
}
    
function addTextEditorListeners() {
    var activeEditor = tinyMCE.get('content');
    if(jQuery('#wp-content-wrap').hasClass('html-active')){ 
        
        jQuery('#content').on('keyup',function(e){processKeyUp(e, true)});
        jQuery('#content').on('keydown',function(e){processKeyUp(e, false)});
        jQuery('#content').on('change',function(e){processKeyUp(e, false)});
        jQuery('#content').on('paste',function(e){processKeyUp(e, false)});          
        jQuery('#content').on('keypress',function(e){processKeyUp(e, false)});          
    }
    addTabListeners();
}
    
function addTabListeners() {
        jQuery('#content-tmce').on('click', function(e){

            setTimeout(function(){
                addTinyMCEListeners();
            }, 2000);

            if(showDebug) console.log("Switch to visual");
        });
        jQuery('#content-html').on('click', function(e){
           
            setTimeout(function(){
              addTextEditorListeners();
            }, 2000);
            
            if(showDebug) console.log("Switch to text");
        });
}