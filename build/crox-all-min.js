/*
 Crox v1.2.6
 https://github.com/thx/crox

 Released under the MIT license
 md5: 4ecf66f9fee2489dfddc7bb45730f4a9
*/
(function(A){var y=function(){function y(c,a){this.row=c;this.col=a}function E(c,a){var d=c.substring(0,a),g=d.match(/\r\n?|\n/g),b=1;g&&(b+=g.length);d=1+/[^\r\n]*$/.exec(d)[0].length;return new y(b,d)}function A(c){return'"'+c.replace(/[\x00-\x1f"\\\u2028\u2029]/g,function(a){switch(a){case '"':return'\\"';case "\\":return"\\\\";case "\b":return"\\b";case "\f":return"\\f";case "\n":return"\\n";case "\r":return"\\r";case "\t":return"\\t"}return"\\u"+("000"+a.charCodeAt(0).toString(16)).slice(-4)})+
'"'}function H(c){function a(b,k,a,g){this.tag=b;this.text=k;this.index=a;this.subMatches=g}function d(){}function g(b){for(var k=1,a=[],g=[1],c=[],h=0;h<b.length;++h)g.push(k+=RegExp("|"+b[h][0].source).exec("").length),c.push(b[h][1]||d),a.push("("+b[h][0].source+")");return[RegExp(a.join("|")+"|","g"),g,c]}a.prototype.toString=function(){return this.text};var b=c.$||"$",k={},h;for(h in c)"$"!=h.charAt(0)&&(k[h]=g(c[h]));return function(g){var e=g.length,c=0,d=[""],h={text:"",index:0,source:g,pushState:function(b){d.push(b)},
popState:function(){d.pop()},retract:function(b){c-=b}};return{scan:function(){do{var l;a:{var v=k[d[d.length-1]],m=v[0];m.lastIndex=c;l=m.exec(g);if(""==l[0]){if(c<e)throw Error("lexer error: "+E(g,c)+"\n"+g.slice(c,c+50));l=new a(b,"",c)}else{h.index=c;c=m.lastIndex;for(var m=v[1],q=0;q<m.length;++q)if(l[m[q]]){v=v[2][q].apply(h,l.slice(m[q],m[q+1]));l=new a(v,l[0],h.index,l.slice(m[q]+1,m[q+1]));break a}l=void 0}}}while(null==l.tag);return l},getPos:function(b){return E(g,b)},reset:function(){c=
0;d=[""]}}}}function n(c){var a;a:{switch(c){case "id":case "lit":a=!0;break a}a=!1}return a||"."==c||"[]"==c}function r(c){return n(c)||"!"==c||"u-"==c}function u(c){if(r(c))return!0;switch(c){case "*":case "/":case "%":return!0}return!1}function w(c){if(u(c))return!0;switch(c){case "+":case "-":return!0}return!1}function x(c){if(w(c))return!0;switch(c){case "<":case ">":case "<=":case ">=":return!0}return!1}function z(c){if(x(c))return!0;switch(c){case "eq":case "ne":return!0}return!1}function B(c){return z(c)||
"&&"==c}function F(c){return B(c)||"||"==c}function I(c,a){function d(b){e+=h+b+"\n"}function g(b){for(var c=0;c<b.length;++c){var e=b[c];switch(e[0]){case "if":d("if("+k(e[1])+"){");h+="\t";g(e[2]);h=h.slice(0,-1);d("}");e[3]&&(d("else{"),h+="\t",g(e[3]),h=h.slice(0,-1),d("}"));break;case "each":++f;var l=e[3]||"$i",v="$list"+(1==f?"":f);d("var "+v+" = "+k(e[1])+";");d("for(var "+l+" in "+v+") {");h+="\t";d("var "+e[4]+" = "+v+"["+l+"];");g(e[2]);h=h.slice(0,-1);d("}");--f;break;case "set":d("var "+
e[1]+"="+k(e[2])+";");break;case "eval":l=k(e[1]);e[2]&&(l=a+"("+l+")");d("$s += "+l+";");break;case "text":d("$s += "+A(e[1])+";");break;case "inc":break;default:throw Error("unknown stmt: "+e[0]);}}}function b(b,e){var c=k(b);e&&!e(b[0])&&(c="("+c+")");return c}function k(e){switch(e[0]){case "id":return e[1];case "lit":return"string"==typeof e[1]?A(e[1]):String(e[1]);case ".":return b(e[1],n)+"."+e[2];case "[]":return b(e[1],n)+"["+k(e[2])+"]";case "!":return"!"+b(e[1],r);case "u-":return"- "+
b(e[1],r);case "*":case "/":case "%":return b(e[1],u)+e[0]+b(e[2],r);case "+":case "-":return b(e[1],w)+e[0]+" "+b(e[2],u);case "<":case ">":case "<=":case ">=":return b(e[1],x)+e[0]+b(e[2],w);case "eq":case "ne":return b(e[1],z)+("eq"==e[0]?"===":"!==")+b(e[2],x);case "&&":return b(e[1],B)+"&&"+b(e[2],z);case "||":return b(e[1],F)+"||"+b(e[2],B);default:throw Error("unknown expr: "+e[0]);}}var h="\t",f=0,e="";g(c[1]);return e}function D(c){return J(K(c))}function G(c,a){var d=D(c),g;a&&(g=a.htmlEncode);
var d=I(d,g||"$htmlEncode"),b="";g||(b+="var obj = { '<': '&lt;', '>': '&gt;', '&': '&amp;', '\"': '&quot;' };\n\tfunction $htmlEncode(s) {\n\t\treturn String(s).replace(/[<>&\"]/g, function(c) {\n\t\t\treturn obj[c];\n\t\t});\n\t}");b=b+"var $s = '';"+d;b+="return $s;";return Function("root",b)}function L(c){function a(c){for(var d=0;d<c.length;++d){var f=c[d];switch(f[0]){case "if":var e="if("+g(f[1])+"){";b+=e;a(f[2]);b+="}";f[3]&&(b+="else{",a(f[3]),b+="}");break;case "each":e=f[3]?"$crox_"+f[3]+
"=>":"";e="foreach("+g(f[1])+" as "+e+"$crox_"+f[4]+")";b+=e;b+="{";a(f[2]);b+="}";break;case "set":f="$crox_"+f[1]+" = "+g(f[2])+";";b+=f;break;case "eval":e=g(f[1]);e=f[2]?"crox_encode("+e+")":"crox_ToString("+e+")";b+="echo "+e+";";break;case "text":e=f[1];/<\?(?:php)?|\?>/.test(e)?(f="echo "+("'"+String(f[1]).replace(/['\\]/g,"\\$&")+"'")+";",b+=f):b+="?>"+e+"<?php ";break;case "inc":f="include '"+f[1].replace(/\.\w+$/,".php")+"';";b+=f;break;default:throw Error("unknown stmt: "+f[0]);}}}function d(b,
c){var a=g(b);c&&!c(b[0])&&(a="("+a+")");return a}function g(b){switch(b[0]){case "id":return"$crox_"+b[1];case "lit":return"string"==typeof b[1]?"'"+String(b[1]).replace(/['\\]/g,"\\$&")+"'":String(b[1]);case ".":return d(b[1],n)+"->"+b[2];case "[]":return d(b[1],n)+"["+g(b[2])+"]";case "!":return"!crox_ToBoolean("+d(b[1],r)+")";case "u-":return"- "+d(b[1],r);case "*":case "/":case "%":return d(b[1],u)+b[0]+d(b[2],r);case "+":return"crox_plus("+d(b[1],null)+", "+d(b[2],null)+")";case "-":return d(b[1],
w)+"- "+d(b[2],u);case "<":case ">":case "<=":case ">=":return d(b[1],x)+b[0]+d(b[2],w);case "eq":case "ne":var c="eq"==b[0]?"===":"!==";return d(b[1],z)+c+d(b[2],x);case "&&":return"crox_logical_and("+d(b[1],null)+", "+d(b[2],null)+")";case "||":return"crox_logical_or("+d(b[1],null)+", "+d(b[2],null)+")";default:throw Error("unknown expr: "+b[0]);}}var b="";a(c[1]);b="?>"==b.slice(0,2)?b.slice(2):"<?php "+b;return b="<?php "==b.slice(-6)?b.slice(0,-6):b+"?>"}function M(c,a){function d(b){for(var c=
0;c<b.length;++c){var a=b[c];switch(a[0]){case "if":var C="#if("+k(a[1])+")";f+=C;d(a[2]);a[3]&&(f+="#{else}",d(a[3]));f+="#{end}";break;case "each":++h;var C="$list"+(1==h?"":h),l="#set ("+C+" = "+k(a[1])+")";f+=l;f+="#foreach($_"+a[4]+" in "+C+")";a[3]&&(f+="#set($_"+a[3]+" = $velocityCount - 1)");d(a[2]);f+="#{end}";--h;break;case "set":a="#set ($"+g(a[1])+"="+k(a[2])+")";f+=a;break;case "eval":a=k(a[1]);f=/^\$([\w-]+)$/.test(a)?f+("${"+RegExp.$1+"}"):f+("#set($t = "+a+")$!{t}");break;case "text":a=
a[1].replace(/\$/g,"$${dollar}").replace(/#/g,"$${sharp}");f+=a;break;case "inc":a="#parse('"+a[1].replace(/\.\w+$/,".vm")+"')";f+=a;break;default:throw Error("unknown stmt: "+a[0]);}}}function g(b){return"root"==b?"crox_root":"_"+b}function b(b,a){var c=k(b);a&&!a(b[0])&&(c="("+c+")");return c}function k(a){switch(a[0]){case "id":return"$"+g(a[1]);case "lit":return"string"==typeof a[1]?(a=a[1],a=-1==a.indexOf("'")?"'"+a+"'":"('"+a.split("'").join("'+\"'\"+'")+"')",a):String(a[1]);case ".":return b(a[1],
n)+"."+a[2];case "[]":return b(a[1],n)+"["+k(a[2])+"]";case "!":return"!"+b(a[1],r);case "u-":if("u-"==a[1][0])throw Error("\u7981\u6b62\u4e24\u4e2a\u8d1f\u53f7\u8fde\u7528");return"-"+b(a[1],r);case "*":case "/":case "%":return b(a[1],u)+a[0]+b(a[2],r);case "+":case "-":return b(a[1],w)+a[0]+" "+b(a[2],u);case "<":case ">":case "<=":case ">=":return b(a[1],x)+a[0]+b(a[2],w);case "eq":case "ne":return b(a[1],z)+("eq"==a[0]?"==":"!=")+b(a[2],x);case "&&":return b(a[1],B)+"&&"+b(a[2],z);case "||":return b(a[1],
F)+"||"+b(a[2],B);default:throw Error("unknown expr: "+a[0]);}}a||(a="\r\n");var h=0,f="#set($dollar='$')#set($sharp='#')";d(c[1]);return f}y.prototype.toString=function(){return"("+this.row+","+this.col+")"};var K=function(){var c=[[/\s+/,function(){return null}],[/[A-Za-z_]\w*/,function(a){switch(a){case "true":case "false":return"boolean";case "set":case "include":return a;default:if(-1!=" abstract boolean break byte case catch char class const continue debugger default delete do double else enum export extends final finally float for function goto if implements import in instanceof int interface let long native new package private protected public return short static super switch synchronized this throw throws transient try typeof var void volatile while with yield ".indexOf(" "+
a+" ")||"null"==a)throw Error("Reserved: "+a+" "+E(this.source,this.index));return"realId"}}],[/"(?:[^"\\]|\\[\s\S])*"|'(?:[^'\\]|\\[\s\S])*'/,function(a){return"string"}],[/\d+(?:\.\d+)?(?:e-?\d+)?/,function(a){return"number"}],[function(a){a.sort().reverse();for(var c=0;c<a.length;++c)a[c]=a[c].replace(/[()*+?.[\]|]/g,"\\$&");return RegExp(a.join("|"))}("! % && ( ) * + - . / < <= = > >= [ ] || === !==".split(" ")),function(a){switch(a){case "===":return"eq";case "!==":return"ne";default:return a}}]];
return H({"":[[/(?:(?!{{)[\s\S])+/,function(a){return"{{"==a.substring(0,2)?(this.pushState(a),a):"text"}],[/{{{/,function(a){this.pushState(a);return a}],[/{{(?:\/if|else|\/each|\/raw)}}/,function(a){return a}],[/{{#raw}}/,function(a){this.pushState("raw");return a}],[/{{(?:#(?:if|each)(?=\s))?/,function(a){this.pushState("{{");return a}]],raw:[[/(?:(?!{{\/raw}})[\s\S])+/,function(a){this.popState();return"rawtext"}]],"{{":c.concat([[/}}/,function(a){this.popState();return a}]]),"{{{":c.concat([[/}}}/,
function(a){this.popState();return a}]])})}(),J=function(){return function(c){function a(b,a){return h[b][a]}for(var d=c.nStart,g=c.tSymbols,b={},k=0;k<g.length;++k)b[g[k]]=k;var h=c.tAction,f=c.tGoto,e=c.tRules,r=c.tFuncs,n=c.actionIndex;n&&(a=function(b,a){var c=h[n[b]];return c[a]||c._});return function(c,k){function h(b){throw Error("Syntax error: "+c.getPos(n.index)+(b?"\n"+b:""));}var m=0,q=[0],n=c.scan(),s=[],u={get:function(b){return s[s.length+b]},set:function(b,a){s[s.length+b]=a}};if(k)for(var p in k)u[p]=
k[p];for(;;)if(p=a(m,b[n.tag]))if(0<p)q.push(m=p),s.push(n),n=c.scan();else if(0>p&&-32768<p){p=-p;var m=e[p],t=m.length-1;q.length-=t;m=f[q[q.length-1]][m[0]-d];q.push(m);r[p]?(p=r[p].apply(u,s.splice(s.length-t,t)),s.push(p)):1!=t&&s.splice(s.length-t,t,null)}else return n.tag!=g[0]&&h(),s[0];else{p=[];for(t=0;t<d;++t)a(m,t)&&p.push(g[t]);h("find "+n.tag+"\nexpect "+p.join(" "))}}}({nStart:40,tSymbols:"$ ! % && ( ) * + - . / < <= = > >= [ ] boolean eq include ne number rawtext realId set string text {{ {{#each {{#if {{#raw}} {{/each}} {{/if}} {{/raw}} {{else}} {{{ || }} }}} AdditiveExpression EqualityExpression LogicalAndExpression LogicalOrExpression MemberExpression MultiplicativeExpression PrimaryExpression RelationalExpression UnaryExpression _text epsilon expr id program statement statements texts".split(" "),
tAction:[{_:-2},{_:-32768},{27:3,28:4,29:5,30:6,31:7,36:8,_:-1},{_:-15},{1:12,4:13,8:14,18:15,20:16,22:17,24:18,25:19,26:20,_:0},{1:12,4:13,8:14,18:15,20:32,22:17,24:18,25:33,26:20,_:0},{23:36,_:0},{_:-13},{_:-3},{27:3,31:7,_:-11},{_:-22},{26:42,_:-19},{_:-21},{_:-17},{20:32,24:18,25:33,_:-18},{_:-20},{7:44,8:45,_:-38},{19:46,21:47,_:-46},{3:48,_:-48},{37:49,_:-50},{9:50,16:51,_:-28},{2:52,6:53,10:54,_:-35},{_:-25},{11:55,12:56,14:57,15:58,_:-43},{_:-31},{38:59,_:0},{_:-23},{_:-19},{_:-18},{26:60,
_:0},{38:61,_:0},{34:62,_:0},{39:63,_:0},{_:-14},{_:-29},{5:64,_:0},{_:-30},{38:65,_:0},{13:66,_:0},{20:32,24:18,25:33,_:0},{_:-9},{26:82,_:-51},{_:-16},{_:-10},{_:-24},{_:-12},{2:52,6:53,10:54,_:-36},{2:52,6:53,10:54,_:-37},{11:55,12:56,14:57,15:58,_:-44},{11:55,12:56,14:57,15:58,_:-45},{19:46,21:47,_:-47},{3:48,_:-49},{_:-26},{17:86,_:0},{_:-34},{_:-32},{_:-33},{7:44,8:45,_:-39},{7:44,8:45,_:-41},{7:44,8:45,_:-40},{7:44,8:45,_:-42},{38:87,_:0},{38:88,_:0},{27:3,28:4,29:5,30:6,31:7,33:89,35:90,36:8,
_:0},{38:91,_:0},{_:-27},{_:-4},{_:-8},{27:3,28:4,29:5,30:6,31:7,32:95,36:8,_:0},{27:3,28:4,29:5,30:6,31:7,32:96,36:8,_:0},{27:3,28:4,29:5,30:6,31:7,33:97,36:8,_:0},{_:-7},{_:-6},{_:-5}],actionIndex:[0,1,2,3,4,5,5,6,5,7,8,9,5,5,5,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,5,5,5,5,5,5,39,5,5,5,5,5,5,5,5,40,41,0,42,43,44,45,5,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,0,0,66,0,67,68,69,70,71,72,73],tGoto:[{13:1,15:2},,{9:9,14:10,16:11},,{0:21,
1:22,2:23,3:24,4:25,5:26,6:27,7:28,8:29,11:30,12:31},{0:21,1:22,2:23,3:24,4:25,5:26,6:27,7:28,8:29,11:34,12:31},{0:21,1:22,2:23,3:24,4:25,5:26,6:27,7:28,8:29,11:35,12:31},,{0:21,1:22,2:23,3:24,4:25,5:26,6:27,7:28,8:29,11:37,12:31},,,{9:38},{4:25,6:27,8:39,12:31},{0:21,1:22,2:23,3:24,4:25,5:26,6:27,7:28,8:29,11:40,12:31},{4:25,6:27,8:41,12:31},,,,,{12:43},,,,,,,,,,,,,,,,,,,,,,,,,{4:25,5:67,6:27,8:29,12:31},{4:25,5:68,6:27,8:29,12:31},{0:21,4:25,5:26,6:27,7:69,8:29,12:31},{0:21,4:25,5:26,6:27,7:70,
8:29,12:31},{0:21,1:71,4:25,5:26,6:27,7:28,8:29,12:31},{0:21,1:22,2:72,4:25,5:26,6:27,7:28,8:29,12:31},{12:73},{0:21,1:22,2:23,3:24,4:25,5:26,6:27,7:28,8:29,11:74,12:31},{4:25,6:27,8:75,12:31},{4:25,6:27,8:76,12:31},{4:25,6:27,8:77,12:31},{0:78,4:25,5:26,6:27,8:29,12:31},{0:79,4:25,5:26,6:27,8:29,12:31},{0:80,4:25,5:26,6:27,8:29,12:31},{0:81,4:25,5:26,6:27,8:29,12:31},,{10:83},{15:84},,,,,{0:21,1:22,2:23,3:24,4:25,5:26,6:27,7:28,8:29,11:85,12:31},,,,,,,,,,,,,,,,,,{9:9,14:10,16:11},,,{15:92},{15:93},
,{15:94},,{9:9,14:10,16:11},{9:9,14:10,16:11},{9:9,14:10,16:11}],tRules:[[57,53],[53,55],[55],[55,55,54],[54,30,51,38,55,33],[54,30,51,38,55,35,55,33],[54,29,51,26,50,38,55,32],[54,29,51,26,26,38,55,32],[54,28,25,52,13,51,38],[54,28,51,38],[54,36,51,39],[54,56],[54,28,20,26,38],[56,49],[56,56,49],[49,27],[49,31,23,34],[52,24],[52,25],[52,20],[46,26],[46,22],[46,18],[46,52],[46,4,51,5],[44,46],[44,44,9,52],[44,44,16,51,17],[48,44],[48,1,48],[48,8,48],[45,48],[45,45,6,48],[45,45,10,48],[45,45,2,48],
[40,45],[40,40,7,45],[40,40,8,45],[47,40],[47,47,11,40],[47,47,14,40],[47,47,12,40],[47,47,15,40],[41,47],[41,41,19,47],[41,41,21,47],[42,41],[42,42,3,41],[43,42],[43,43,37,42],[51,43],[50]],tFuncs:function(){function c(a,b,c,d,f,e,n){return["each",b,e,d&&eval(d.text),eval(c.text)]}function a(a){return["lit",eval(a.text)]}function d(a,b,c){return[b.text,a,c]}return[,function(a){return["prog",a]},function(){return[]},function(a,b){a.push(b);return a},function(a,b,c,d,f){return["if",b,d]},function(a,
b,c,d,f,e,n){return["if",b,d,e]},c,c,function(a,b,c,d,f,e){return["set",c.text,f]},function(a,b,c){return["eval",b,!0]},function(a,b,c){return["eval",b,!1]},function(a){return["text",a]},function(a,b,c,d){return["inc",eval(c.text)]},function(a){return a},function(a,b){return a+b},function(a){return a.text},function(a,b,c){return b.text},,,,a,a,function(a){return["lit","true"==a.text]},function(a){return["id",a.text]},function(a,b,c){return b},,function(a,b,c){return[".",a,c.text]},function(a,b,c,
d){return["[]",a,c]},,function(a,b){return["!",b]},function(a,b){return["u-",b]},,d,d,d,,d,d,,d,d,d,d,,function(a,b,c){return["eq",a,c]},function(a,b,c){return["ne",a,c]},,d,,d]}()})}();return{parse:D,compile:G,render:function(c,a){return G(c)(a)},compileToPhp:function(c){return L(D(c))},compileToVM:function(c,a){return M(D(c))},version:"1.2.6"}}();"object"==typeof module&&module&&"object"==typeof module.exports?module.exports=y:"function"==typeof define&&(define.amd||define.cmd)?define(function(){return y}):
"undefined"!=typeof KISSY&&KISSY.add(function(){return y});A&&(A.Crox=y)})(this);
