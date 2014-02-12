/*!
 * Crox v1.2.4
 * https://github.com/thx/crox
 *
 * Released under the MIT license
 */
!function(root){var Crox=function(){function Class(a,b,c){function d(){}d.prototype=a.prototype;var e=new d;if(c)for(var f in c)e[f]=c[f];return b||(b=d),b.prototype=e,b}function Position(a,b){this.row=a,this.col=b}function getPos(a,b){var c=a.substring(0,b),d=/\r\n?|\n/g,e=c.match(d),f=1;e&&(f+=e.length);var g=1+/[^\r\n]*$/.exec(c)[0].length;return new Position(f,g)}function Enum(a){for(var b={},c=0;c<a.length;++c)b[a[c]]=a[c];return b}function inArr(a,b){for(var c=0;c<a.length;++c)if(a[c]==b)return c;return-1}function inArr_strict(a,b){for(var c=0;c<a.length;++c)if(a[c]===b)return c;return-1}function nodup(a,b){b||(b=function(a,b){return a===b});for(var c=[],d=a.length,e=0;d>e;e++){for(var f=e+1;d>f;f++)b(a[e],a[f])&&(f=++e);c.push(a[e])}return c}function htmlEncode(a){return String(a).replace(/[&<>"]/g,function(a){switch(a){case"&":return"&amp;";case"<":return"&lt;";case">":return"&gt;";default:return"&quot;"}})}function quote(a){return'"'+a.replace(/[\x00-\x1f"\\\u2028\u2029]/g,function(a){switch(a){case'"':return'\\"';case"\\":return"\\\\";case"\b":return"\\b";case"\f":return"\\f";case"\n":return"\\n";case"\r":return"\\r";case"	":return"\\t"}return"\\u"+("000"+a.charCodeAt(0).toString(16)).slice(-4)})+'"'}function singleQuote(a){return"'"+a.replace(/[\x00-\x1f'\\\u2028\u2029]/g,function(a){switch(a){case"'":return"\\'";case"\\":return"\\\\";case"\b":return"\\b";case"\f":return"\\f";case"\n":return"\\n";case"\r":return"\\r";case"	":return"\\t"}return"\\u"+("000"+a.charCodeAt(0).toString(16)).slice(-4)})+"'"}function phpQuote(a){return"'"+String(a).replace(/['\\]/g,"\\$&")+"'"}function createLexer(a){function b(a,b,c,d){this.tag=a,this.text=b,this.index=c,this.subMatches=d}function c(){}function d(a){for(var b=1,d=[],e=[1],f=[],g=0;g<a.length;++g)e.push(b+=RegExp("|"+a[g][0].source).exec("").length),f.push(a[g][1]||c),d.push("("+a[g][0].source+")");var h=RegExp(d.join("|")+"|","g");return[h,e,f]}function e(a){function c(){var c=h[h.length-1],j=g[c],k=j[0];k.lastIndex=e;var l=k.exec(a);if(""==l[0]){if(d>e)throw Error("lexer error: "+getPos(a,e)+"\n"+a.slice(e,e+50));return new b(f,"",e)}i.index=e,e=k.lastIndex;for(var m=j[1],n=0;n<m.length;++n)if(l[m[n]]){var o=j[2][n].apply(i,l.slice(m[n],m[n+1]));return new b(o,l[0],i.index,l.slice(m[n]+1,m[n+1]))}}var d=a.length,e=0,h=[""],i={text:"",index:0,source:a,pushState:function(a){h.push(a)},popState:function(){h.pop()},retract:function(a){e-=a}};return{scan:function(){do var a=c();while(null==a.tag);return a},getPos:function(b){return getPos(a,b)},reset:function(){e=0,h=[""]}}}b.prototype.toString=function(){return this.text};var f=a.$||"$",g={};for(var h in a)"$"!=h.charAt(0)&&(g[h]=d(a[h]));return e}function isAtom(a){switch(a){case"id":case"lit":return!0}return!1}function isMember(a){return isAtom(a)||"."==a||"[]"==a}function isUnary(a){return isMember(a)||"!"==a||"u-"==a}function isMul(a){if(isUnary(a))return!0;switch(a){case"*":case"/":case"%":return!0}return!1}function isAdd(a){if(isMul(a))return!0;switch(a){case"+":case"-":return!0}return!1}function isRel(a){if(isAdd(a))return!0;switch(a){case"<":case">":case"<=":case">=":return!0}return!1}function isEquality(a){if(isRel(a))return!0;switch(a){case"eq":case"ne":return!0}return!1}function isLogicalAnd(a){return isEquality(a)||"&&"==a}function isLogicalOr(a){return isLogicalAnd(a)||"||"==a}function changeExt(a,b){return a.replace(/\.\w+$/,"."+b)}function codegen_js_tran(a,b){function c(){j+="	"}function d(){j=j.slice(0,-1)}function e(a){k+=j+a+"\n"}function f(a){switch(a[0]){case"if":e("if("+i(a[1])+"){"),c(),g(a[2]),d(),e("}"),a[3]&&(e("else{"),c(),g(a[3]),d(),e("}"));break;case"each":var f=a[3]||"$i";e("var $list = "+i(a[1])+";"),e("for(var "+f+" in $list) {"),c(),e("var "+a[4]+" = $list["+f+"];"),g(a[2]),d(),e("}");break;case"set":e("var "+a[1]+"="+i(a[2])+";");break;case"eval":var h=i(a[1]);a[2]&&(h=b+"("+h+")"),e("$s += "+h+";");break;case"text":e("$s += "+quote(a[1])+";");break;case"inc":break;default:throw Error("unknown stmt: "+a[0])}}function g(a){for(var b=0;b<a.length;++b)f(a[b])}function h(a,b){var c=i(a);return b&&!b(a[0])&&(c="("+c+")"),c}function i(a){switch(a[0]){case"id":return a[1];case"lit":return"string"==typeof a[1]?quote(a[1]):String(a[1]);case".":return h(a[1],isMember)+"."+a[2];case"[]":return h(a[1],isMember)+"["+i(a[2])+"]";case"!":return"!"+h(a[1],isUnary);case"u-":return"- "+h(a[1],isUnary);case"*":case"/":case"%":return h(a[1],isMul)+a[0]+h(a[2],isUnary);case"+":case"-":return h(a[1],isAdd)+a[0]+" "+h(a[2],isMul);case"<":case">":case"<=":case">=":return h(a[1],isRel)+a[0]+h(a[2],isAdd);case"eq":case"ne":return h(a[1],isEquality)+("eq"==a[0]?"===":"!==")+h(a[2],isRel);case"&&":return h(a[1],isLogicalAnd)+"&&"+h(a[2],isEquality);case"||":return h(a[1],isLogicalOr)+"||"+h(a[2],isLogicalAnd);default:throw Error("unknown expr: "+a[0])}}var j="	",k="";return g(a[1]),k}function codegen_js_tofn(a,b){var c;b&&(c=b.htmlEncode);var d=codegen_js_tran(a,c||"$htmlEncode"),e="";c||(e+="var obj = { '<': '&lt;', '>': '&gt;', '&': '&amp;', '\"': '&quot;' };\n	function $htmlEncode(s) {\n		return String(s).replace(/[<>&\"]/g, function(c) {\n			return obj[c];\n		});\n	}"),e+="var $s = '';",e+=d,e+="return $s;";var f=Function("root",e);return f}function parsetmpl(a){var b=parse(Lexer(a));return b}function compile2jsfn(a,b){var c=parsetmpl(a);return codegen_js_tofn(c,b)}Position.prototype.toString=function(){return"("+this.row+","+this.col+")"};var Lexer=function(){function a(a){return-1!=" abstract boolean break byte case catch char class const continue debugger default delete do double else enum export extends final finally float for function goto if implements import in instanceof int interface let long native new package private protected public return short static super switch synchronized this throw throws transient try typeof var void volatile while with yield ".indexOf(" "+a+" ")}var b=/[A-Za-z_]\w*/,c=/"(?:[^"\\]|\\[\s\S])*"|'(?:[^'\\]|\\[\s\S])*'/,d=/\d+(?:\.\d+)?(?:e-?\d+)?/,e=[[/\s+/,function(){return null}],[b,function(b){switch(b){case"true":case"false":return"boolean";case"set":case"include":return b;default:if(a(b)||"null"==b)throw Error("Reserved: "+b+" "+getPos(this.source,this.index));return"realId"}}],[c,function(){return"string"}],[d,function(){return"number"}],[function(a){a.sort().reverse();for(var b=0;b<a.length;++b)a[b]=a[b].replace(/[()*+?.[\]|]/g,"\\$&");return RegExp(a.join("|"))}(["!","%","&&","(",")","*","+","-",".","/","<","<=","=",">",">=","[","]","||","===","!=="]),function(a){switch(a){case"===":return"eq";case"!==":return"ne";default:return a}}]],f=createLexer({"":[[/(?:(?!{{)[\s\S])+/,function(a){return"{{"==a.substring(0,2)?(this.pushState(a),a):"text"}],[/{{{/,function(a){return this.pushState(a),a}],[/{{(?:\/if|else|\/each|\/raw)}}/,function(a){return a}],[/{{#raw}}/,function(a){return this.pushState("raw"),a}],[/{{(?:#(?:if|each)(?=\s))?/,function(a){return this.pushState("{{"),a}]],raw:[[/(?:(?!{{\/raw}})[\s\S])+/,function(){return this.popState(),"rawtext"}]],"{{":e.concat([[/}}/,function(a){return this.popState(),a}]]),"{{{":e.concat([[/}}}/,function(a){return this.popState(),a}]])});return f}(),parse=function(){var table={nStart:40,tSymbols:["$","!","%","&&","(",")","*","+","-",".","/","<","<=","=",">",">=","[","]","boolean","eq","include","ne","number","rawtext","realId","set","string","text","{{","{{#each","{{#if","{{#raw}}","{{/each}}","{{/if}}","{{/raw}}","{{else}}","{{{","||","}}","}}}","AdditiveExpression","EqualityExpression","LogicalAndExpression","LogicalOrExpression","MemberExpression","MultiplicativeExpression","PrimaryExpression","RelationalExpression","UnaryExpression","_text","epsilon","expr","id","program","statement","statements","texts"],tAction:[{_:-2},{_:-32768},{27:3,28:4,29:5,30:6,31:7,36:8,_:-1},{_:-15},{1:12,4:13,8:14,18:15,20:16,22:17,24:18,25:19,26:20,_:0},{1:12,4:13,8:14,18:15,20:32,22:17,24:18,25:33,26:20,_:0},{23:36,_:0},{_:-13},{_:-3},{27:3,31:7,_:-11},{_:-22},{26:42,_:-19},{_:-21},{_:-17},{20:32,24:18,25:33,_:-18},{_:-20},{7:44,8:45,_:-38},{19:46,21:47,_:-46},{3:48,_:-48},{37:49,_:-50},{9:50,16:51,_:-28},{2:52,6:53,10:54,_:-35},{_:-25},{11:55,12:56,14:57,15:58,_:-43},{_:-31},{38:59,_:0},{_:-23},{_:-19},{_:-18},{26:60,_:0},{38:61,_:0},{34:62,_:0},{39:63,_:0},{_:-14},{_:-29},{5:64,_:0},{_:-30},{38:65,_:0},{13:66,_:0},{20:32,24:18,25:33,_:0},{_:-9},{26:82,_:-51},{_:-16},{_:-10},{_:-24},{_:-12},{2:52,6:53,10:54,_:-36},{2:52,6:53,10:54,_:-37},{11:55,12:56,14:57,15:58,_:-44},{11:55,12:56,14:57,15:58,_:-45},{19:46,21:47,_:-47},{3:48,_:-49},{_:-26},{17:86,_:0},{_:-34},{_:-32},{_:-33},{7:44,8:45,_:-39},{7:44,8:45,_:-41},{7:44,8:45,_:-40},{7:44,8:45,_:-42},{38:87,_:0},{38:88,_:0},{27:3,28:4,29:5,30:6,31:7,33:89,35:90,36:8,_:0},{38:91,_:0},{_:-27},{_:-4},{_:-8},{27:3,28:4,29:5,30:6,31:7,32:95,36:8,_:0},{27:3,28:4,29:5,30:6,31:7,32:96,36:8,_:0},{27:3,28:4,29:5,30:6,31:7,33:97,36:8,_:0},{_:-7},{_:-6},{_:-5}],actionIndex:[0,1,2,3,4,5,5,6,5,7,8,9,5,5,5,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,5,5,5,5,5,5,39,5,5,5,5,5,5,5,5,40,41,0,42,43,44,45,5,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,0,0,66,0,67,68,69,70,71,72,73],tGoto:[{13:1,15:2},,{9:9,14:10,16:11},,{0:21,1:22,2:23,3:24,4:25,5:26,6:27,7:28,8:29,11:30,12:31},{0:21,1:22,2:23,3:24,4:25,5:26,6:27,7:28,8:29,11:34,12:31},{0:21,1:22,2:23,3:24,4:25,5:26,6:27,7:28,8:29,11:35,12:31},,{0:21,1:22,2:23,3:24,4:25,5:26,6:27,7:28,8:29,11:37,12:31},,,{9:38},{4:25,6:27,8:39,12:31},{0:21,1:22,2:23,3:24,4:25,5:26,6:27,7:28,8:29,11:40,12:31},{4:25,6:27,8:41,12:31},,,,,{12:43},,,,,,,,,,,,,,,,,,,,,,,,,{4:25,5:67,6:27,8:29,12:31},{4:25,5:68,6:27,8:29,12:31},{0:21,4:25,5:26,6:27,7:69,8:29,12:31},{0:21,4:25,5:26,6:27,7:70,8:29,12:31},{0:21,1:71,4:25,5:26,6:27,7:28,8:29,12:31},{0:21,1:22,2:72,4:25,5:26,6:27,7:28,8:29,12:31},{12:73},{0:21,1:22,2:23,3:24,4:25,5:26,6:27,7:28,8:29,11:74,12:31},{4:25,6:27,8:75,12:31},{4:25,6:27,8:76,12:31},{4:25,6:27,8:77,12:31},{0:78,4:25,5:26,6:27,8:29,12:31},{0:79,4:25,5:26,6:27,8:29,12:31},{0:80,4:25,5:26,6:27,8:29,12:31},{0:81,4:25,5:26,6:27,8:29,12:31},,{10:83},{15:84},,,,,{0:21,1:22,2:23,3:24,4:25,5:26,6:27,7:28,8:29,11:85,12:31},,,,,,,,,,,,,,,,,,{9:9,14:10,16:11},,,{15:92},{15:93},,{15:94},,{9:9,14:10,16:11},{9:9,14:10,16:11},{9:9,14:10,16:11}],tRules:[[57,53],[53,55],[55],[55,55,54],[54,30,51,38,55,33],[54,30,51,38,55,35,55,33],[54,29,51,26,50,38,55,32],[54,29,51,26,26,38,55,32],[54,28,25,52,13,51,38],[54,28,51,38],[54,36,51,39],[54,56],[54,28,20,26,38],[56,49],[56,56,49],[49,27],[49,31,23,34],[52,24],[52,25],[52,20],[46,26],[46,22],[46,18],[46,52],[46,4,51,5],[44,46],[44,44,9,52],[44,44,16,51,17],[48,44],[48,1,48],[48,8,48],[45,48],[45,45,6,48],[45,45,10,48],[45,45,2,48],[40,45],[40,40,7,45],[40,40,8,45],[47,40],[47,47,11,40],[47,47,14,40],[47,47,12,40],[47,47,15,40],[41,47],[41,41,19,47],[41,41,21,47],[42,41],[42,42,3,41],[43,42],[43,43,37,42],[51,43],[50]],tFuncs:function(){function $f0($1,$2,$3,$4,$5,$6,$7){var $$;return $$=["each",$2,$6,$4&&eval($4.text),eval($3.text)]}function $f1($1){var $$;return $$=["lit",eval($1.text)]}function $f2(a,b,c){var d;return d=[b.text,a,c]}return[,function(a){var b;return b=["prog",a]},function(){var a;return a=[]},function(a,b){var c;return a.push(b),c=a},function(a,b,c,d){var e;return e=["if",b,d]},function(a,b,c,d,e,f){var g;return g=["if",b,d,f]},$f0,$f0,function(a,b,c,d,e){var f;return f=["set",c.text,e]},function(a,b){var c;return c=["eval",b,!0]},function(a,b){var c;return c=["eval",b,!1]},function(a){var b;return b=["text",a]},function($1,$2,$3,$4){var $$;return $$=["inc",eval($3.text)]},function(a){var b;return b=a},function(a,b){var c;return c=a+b},function(a){var b;return b=a.text},function(a,b){var c;return c=b.text},,,,$f1,$f1,function(a){var b;return b=["lit","true"==a.text]},function(a){var b;return b=["id",a.text]},function(a,b){var c;return c=b},,function(a,b,c){var d;return d=[".",a,c.text]},function(a,b,c){var d;return d=["[]",a,c]},,function(a,b){var c;return c=["!",b]},function(a,b){var c;return c=["u-",b]},,$f2,$f2,$f2,,$f2,$f2,,$f2,$f2,$f2,$f2,,function(a,b,c){var d;return d=["eq",a,c]},function(a,b,c){var d;return d=["ne",a,c]},,$f2,,$f2]}()};return function(a){function b(a,b){return g[a][b]}for(var c=a.nStart,d=a.tSymbols,e={},f=0;f<d.length;++f)e[d[f]]=f;var g=a.tAction,h=a.tGoto,i=a.tRules,j=a.tFuncs,k=a.actionIndex;return k&&(b=function(a,b){var c=g[k[a]];return c[b]||c._}),function(a,f){function g(b){throw Error("Syntax error: "+a.getPos(m.index)+(b?"\n"+b:""))}var k=0,l=[0],m=a.scan(),n=[],o={get:function(a){return n[n.length+a]},set:function(a,b){n[n.length+a]=b}};if(f)for(var p in f)o[p]=f[p];for(;;)if(p=b(k,e[m.tag]))if(p>0)l.push(k=p),n.push(m),m=a.scan();else{if(!(0>p&&p>-32768))return m.tag!=d[0]&&g(),n[0];p=-p;var k=i[p],q=k.length-1;l.length-=q,k=h[l[l.length-1]][k[0]-c],l.push(k),j[p]?(p=j[p].apply(o,n.splice(n.length-q,q)),n.push(p)):1!=q&&n.splice(n.length-q,q,null)}else{for(p=[],q=0;c>q;++q)b(k,q)&&p.push(d[q]);g("find "+m.tag+"\nexpect "+p.join(" "))}}}(table)}(),Crox={parse:parsetmpl,compile:compile2jsfn,render:function(a,b){var c=compile2jsfn(a);return c(b)}};return Crox.version="1.2.4",Crox}();"object"==typeof module&&module&&"object"==typeof module.exports?module.exports=Crox:"function"==typeof define&&(define.amd||define.cmd)?define(function(){return Crox}):"undefined"!=typeof KISSY&&KISSY.add(function(){return Crox}),root&&(root.Crox=Crox)}(this);