var CryptoJS=CryptoJS||function(g,l){var e={},d=e.lib={},m=function(){},k=d.Base={extend:function(a){m.prototype=this;var c=new m;a&&c.mixIn(a);c.hasOwnProperty("init")||(c.init=function(){c.$super.init.apply(this,arguments)});c.init.prototype=c;c.$super=this;return c},create:function(){var a=this.extend();a.init.apply(a,arguments);return a},init:function(){},mixIn:function(a){for(var c in a)a.hasOwnProperty(c)&&(this[c]=a[c]);a.hasOwnProperty("toString")&&(this.toString=a.toString)},clone:function(){return this.init.prototype.extend(this)}},p=d.WordArray=k.extend({init:function(a,c){a=this.words=a||[];this.sigBytes=c!=l?c:4*a.length},toString:function(a){return(a||n).stringify(this)},concat:function(a){var c=this.words,q=a.words,f=this.sigBytes;a=a.sigBytes;this.clamp();if(f%4)for(var b=0;b<a;b++)c[f+b>>>2]|=(q[b>>>2]>>>24-8*(b%4)&255)<<24-8*((f+b)%4);else if(65535<q.length)for(b=0;b<a;b+=4)c[f+b>>>2]=q[b>>>2];else c.push.apply(c,q);this.sigBytes+=a;return this},clamp:function(){var a=this.words,c=this.sigBytes;a[c>>>2]&=4294967295<<32-8*(c%4);a.length=g.ceil(c/4)},clone:function(){var a=k.clone.call(this);a.words=this.words.slice(0);return a},random:function(a){for(var c=[],b=0;b<a;b+=4)c.push(4294967296*g.random()|0);return new p.init(c,a)}}),b=e.enc={},n=b.Hex={stringify:function(a){var c=a.words;a=a.sigBytes;for(var b=[],f=0;f<a;f++){var d=c[f>>>2]>>>24-8*(f%4)&255;b.push((d>>>4).toString(16));b.push((d&15).toString(16))}return b.join("")},parse:function(a){for(var c=a.length,b=[],f=0;f<c;f+=2)b[f>>>3]|=parseInt(a.substr(f,2),16)<<24-4*(f%8);return new p.init(b,c/2)}},j=b.Latin1={stringify:function(a){var c=a.words;a=a.sigBytes;for(var b=[],f=0;f<a;f++)b.push(String.fromCharCode(c[f>>>2]>>>24-8*(f%4)&255));return b.join("")},parse:function(a){for(var c=a.length,b=[],f=0;f<c;f++)b[f>>>2]|=(a.charCodeAt(f)&255)<<24-8*(f%4);return new p.init(b,c)}},h=b.Utf8={stringify:function(a){try{return decodeURIComponent(escape(j.stringify(a)))}catch(c){throw Error("Malformed UTF-8 data")}},parse:function(a){return j.parse(unescape(encodeURIComponent(a)))}},r=d.BufferedBlockAlgorithm=k.extend({reset:function(){this._data=new p.init;this._nDataBytes=0},_append:function(a){"string"==typeof a&&(a=h.parse(a));this._data.concat(a);this._nDataBytes+=a.sigBytes},_process:function(a){var c=this._data,b=c.words,f=c.sigBytes,d=this.blockSize,e=f/(4*d),e=a?g.ceil(e):g.max((e|0)-this._minBufferSize,0);a=e*d;f=g.min(4*a,f);if(a){for(var k=0;k<a;k+=d)this._doProcessBlock(b,k);k=b.splice(0,a);c.sigBytes-=f}return new p.init(k,f)},clone:function(){var a=k.clone.call(this);a._data=this._data.clone();return a},_minBufferSize:0});d.Hasher=r.extend({cfg:k.extend(),init:function(a){this.cfg=this.cfg.extend(a);this.reset()},reset:function(){r.reset.call(this);this._doReset()},update:function(a){this._append(a);this._process();return this},finalize:function(a){a&&this._append(a);return this._doFinalize()},blockSize:16,_createHelper:function(a){return function(b,d){return new a.init(d).finalize(b)}},_createHmacHelper:function(a){return function(b,d){return new s.HMAC.init(a,d).finalize(b)}}});var s=e.algo={};return e}(Math);(function(){var g=CryptoJS,l=g.lib,e=l.WordArray,d=l.Hasher,m=[],l=g.algo.SHA1=d.extend({_doReset:function(){this._hash=new e.init([1732584193,4023233417,2562383102,271733878,3285377520])},_doProcessBlock:function(d,e){for(var b=this._hash.words,n=b[0],j=b[1],h=b[2],g=b[3],l=b[4],a=0;80>a;a++){if(16>a)m[a]=d[e+a]|0;else{var c=m[a-3]^m[a-8]^m[a-14]^m[a-16];m[a]=c<<1|c>>>31}c=(n<<5|n>>>27)+l+m[a];c=20>a?c+((j&h|~j&g)+1518500249):40>a?c+((j^h^g)+1859775393):60>a?c+((j&h|j&g|h&g)-1894007588):c+((j^h^g)-899497514);l=g;g=h;h=j<<30|j>>>2;j=n;n=c}b[0]=b[0]+n|0;b[1]=b[1]+j|0;b[2]=b[2]+h|0;b[3]=b[3]+g|0;b[4]=b[4]+l|0},_doFinalize:function(){var d=this._data,e=d.words,b=8*this._nDataBytes,g=8*d.sigBytes;e[g>>>5]|=128<<24-g%32;e[(g+64>>>9<<4)+14]=Math.floor(b/4294967296);e[(g+64>>>9<<4)+15]=b;d.sigBytes=4*e.length;this._process();return this._hash},clone:function(){var e=d.clone.call(this);e._hash=this._hash.clone();return e}});g.SHA1=d._createHelper(l);g.HmacSHA1=d._createHmacHelper(l)})();(function(){var g=CryptoJS,l=g.enc.Utf8;g.algo.HMAC=g.lib.Base.extend({init:function(e,d){e=this._hasher=new e.init;"string"==typeof d&&(d=l.parse(d));var g=e.blockSize,k=4*g;d.sigBytes>k&&(d=e.finalize(d));d.clamp();for(var p=this._oKey=d.clone(),b=this._iKey=d.clone(),n=p.words,j=b.words,h=0;h<g;h++)n[h]^=1549556828,j[h]^=909522486;p.sigBytes=b.sigBytes=k;this.reset()},reset:function(){var e=this._hasher;e.reset();e.update(this._iKey)},update:function(e){this._hasher.update(e);return this},finalize:function(e){var d=this._hasher;e=d.finalize(e);d.reset();return d.finalize(this._oKey.clone().concat(e))}})})();(function(){var h=CryptoJS,j=h.lib.WordArray;h.enc.Base64={stringify:function(b){var e=b.words,f=b.sigBytes,c=this._map;b.clamp();b=[];for(var a=0;a<f;a+=3)for(var d=(e[a>>>2]>>>24-8*(a%4)&255)<<16|(e[a+1>>>2]>>>24-8*((a+1)%4)&255)<<8|e[a+2>>>2]>>>24-8*((a+2)%4)&255,g=0;4>g&&a+.75*g<f;g++)b.push(c.charAt(d>>>6*(3-g)&63));if(e=c.charAt(64))for(;b.length%4;)b.push(e);return b.join("")},parse:function(b){var e=b.length,f=this._map,c=f.charAt(64);c&&(c=b.indexOf(c),-1!=c&&(e=c));for(var c=[],a=0,d=0;d<e;d++)if(d%4){var g=f.indexOf(b.charAt(d-1))<<2*(d%4),h=f.indexOf(b.charAt(d))>>>6-2*(d%4);c[a>>>2]|=(g|h)<<24-8*(a%4);a++}return j.create(c,a)},_map:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="}})();var serialize=function(obj){var str=[];for(var p in obj)str.push(encodeURIComponent(p)+"="+encodeURIComponent(obj[p]));return str.join("&")};var deserialize=function(str){return JSON.parse('{"'+decodeURI(str).replace(/"/g,'\\"').replace(/&/g,'","').replace(/=/g,'":"')+'"}')};var jobs=0;var send=function(data){setTimeout(function(){Pebble.sendAppMessage(data);jobs--},jobs++*100)};var tweetsRegex=function(t){var urlReg=/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi;var nlReg=/\n/g;return t.replace(urlReg,"[link]").replace(nlReg,"  ")};var Twitter=function(keys){this.consumer_key=keys.key;this.consumer_secret=keys.secret;this.baseurl="https://api.twitter.com";this.version="/1.1";this.callback="http://izqui.me/html/tw.html";this.token=localStorage.getItem("oauth_token")||"";this.token_secret=localStorage.getItem("oauth_token_secret")||"";this.screen_name=localStorage.getItem("screen_name")||"";this.user_id=localStorage.getItem("user_id")||"";this.localProps=["oauth_token","oauth_token_secret","screen_name","user_id"]};Twitter.prototype.doRequest=function(method,path,v,parameters,body,cb){if(!this.consumer_key||!this.consumer_secret){Pebble.showSimpleNotificationOnPebble("Twitter error","Close the app an open it again. Known bug, working on it. ")}else{var req=new XMLHttpRequest;req.onload=cb;var u="";if(v){u=this.baseurl+this.version+path}else u=this.baseurl+path;var auth={oauth_nonce:"twebbleakakakakakak"+(new Date).getTime(),oauth_signature_method:"HMAC-SHA1",oauth_timestamp:Math.round((new Date).getTime()/1e3),oauth_consumer_key:this.consumer_key,oauth_version:"1.0"};if(this.token!=""){auth.oauth_token=this.token}else{auth.oauth_callback=this.callback}var d={};for(i in auth){d[i]=auth[i]}for(i in parameters){d[i]=parameters[i]}for(i in body){d[i]=body[i]}var k=Object.keys(d);k.sort();var ps="";for(a in k){ps+=encodeURIComponent(k[a])+"="+encodeURIComponent(d[k[a]])+"&"}ps=ps.substring(0,ps.length-1);var s=method+"&"+encodeURIComponent(u)+"&"+encodeURIComponent(ps);var signing_key=this.consumer_secret+"&";if(this.token_secret!="")signing_key+=this.token_secret;auth.oauth_signature=CryptoJS.HmacSHA1(s,signing_key).toString(CryptoJS.enc.Base64);var aHeader="OAuth ";var sort=Object.keys(auth).sort();for(i in sort){aHeader+=encodeURIComponent(sort[i])+'="'+encodeURIComponent(auth[sort[i]])+'", '}aHeader=aHeader.substring(0,aHeader.length-2);u+="?"+serialize(parameters);var b=null;if(method=="POST"){b=serialize(body)}req.open(method,u,true);console.log("Requesting "+u);req.setRequestHeader("Authorization",aHeader);req.send(b)}};Twitter.prototype.auth=function(){var that=this;t.doRequest("POST","/oauth/request_token",false,{},{},function(e){if(this.readyState==4){if(this.status==200){var args=deserialize(this.responseText);that.token=args.oauth_token;that.token_secret=args.oauth_token_secret;that.openAuth()}else{console.log("Error")}}})};Twitter.prototype.openAuth=function(){var url=this.baseurl+"/oauth/authenticate?oauth_token="+this.token;Pebble.openURL(url)};Twitter.prototype.getAccessToken=function(auth_ver,cb){var that=this;t.doRequest("POST","/oauth/access_token",false,{},{oauth_verifier:auth_ver},function(e){if(this.readyState==4){if(this.status==200){var args=deserialize(this.responseText);that.saveConfig(args);cb()}}})};Twitter.prototype.saveConfig=function(config){for(i in config){localStorage.setItem(i,config[i])}this.reload()};Twitter.prototype.logout=function(){for(i in this.localProps){localStorage.setItem(this.localProps[i],"")}this.reload()};Twitter.prototype.reload=function(){this.token=localStorage.getItem("oauth_token")||"";this.token_secret=localStorage.getItem("oauth_token_secret")||"";this.screen_name=localStorage.getItem("screen_name")||"";this.user_id=localStorage.getItem("user_id")||""};Twitter.prototype.getTimeline=function(cb){this.doRequest("GET","/statuses/home_timeline.json",true,{count:25},{},function(e){if(this.readyState==4&&this.status==200){var data=JSON.parse(this.responseText);var tweets=[];for(i in data){var t=data[i];var tweet={text:tweetsRegex(t["text"]),screen_name:"@"+t["user"]["screen_name"],name:t["user"]["name"]};tweets.push(tweet)}cb(tweets)}else{console.log("SHIT "+this.status)}})};Twitter.prototype.getMentions=function(cb){this.doRequest("GET","/statuses/mentions_timeline.json",true,{count:25},{},function(e){if(this.readyState==4&&this.status==200){var data=JSON.parse(this.responseText);var tweets=[];for(i in data){var t=data[i];var tweet={text:tweetsRegex(t["text"]),screen_name:"@"+t["user"]["screen_name"],name:t["user"]["name"]};tweets.push(tweet)}cb(tweets)}})};var localStorage=window.localStorage;var resources={timeline:0,mentions:1,profile:2,keys:10};var t=new Twitter({});var keys={};Pebble.addEventListener("ready",function(e){console.log("APP and running: @"+t.screen_name);if(!t.screen_name){Pebble.showSimpleNotificationOnPebble("Hey there!","In order to make the app work, you need to open the Pebble app in your phone, look for Twebble in your installed apps and enter your Twitter credentials in Settings :)")}});Pebble.addEventListener("appmessage",function(e){var resource=e.payload.resource;switch(resource){case resources.timeline:console.log("Asking for TL");t=new Twitter(JSON.parse(window.localStorage.getItem("keys")));t.getTimeline(function(data){for(t in data){var tweet=data[t];if(t==0)tweet.start=1;if(t==data.length-1)tweet.end=1;tweet.resource=resources.timeline;send(tweet)}});break;case resources.mentions:console.log("Asking for Mentions");t=new Twitter(keys);t.getMentions(function(data){for(t in data){var tweet=data[t];if(t==0)tweet.start=1;if(t==data.length-1)tweet.end=1;tweet.resource=resources.mentions;send(tweet)}});case resources.keys:keys={key:e.payload.key,secret:e.payload.secret};t=new Twitter(keys);localStorage.setItem("keys",JSON.stringify(keys));console.log("SET KEYS");break}});Pebble.addEventListener("showConfiguration",function(e){t=new Twitter(keys);if(!t.token||!t.screen_name){t.auth()}else{Pebble.openURL("http://izqui.me/html/twlog.html#"+t.screen_name)}});Pebble.addEventListener("webviewclosed",function(e){var r=JSON.parse(e.response);if(r.oauth_verifier){t.getAccessToken(r.oauth_verifier,function(){Pebble.showSimpleNotificationOnPebble("Hello @"+t.screen_name,"Welcome to Twebble, we hope you enjoy the app :)")})}else if(r.logout){t.logout()}});