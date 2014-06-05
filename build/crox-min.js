/*
 Crox v1.3.1
 https://github.com/thx/crox

 Released under the MIT license
 md5: 5044d32956236a27ece77f46dbaac172
*/
(function(v){var t=function(){function t(a,b){this.row=a;this.col=b}function z(a,b){var e=a.substring(0,b),d=e.match(/\r\n?|\n/g),h=1;d&&(h+=d.length);e=1+/[^\r\n]*$/.exec(e)[0].length;return new t(h,e)}function v(a){return'"'+a.replace(/[\x00-\x1f"\\\u2028\u2029]/g,function(b){switch(b){case '"':return'\\"';case "\\":return"\\\\";case "\b":return"\\b";case "\f":return"\\f";case "\n":return"\\n";case "\r":return"\\r";case "\t":return"\\t"}return"\\u"+("000"+b.charCodeAt(0).toString(16)).slice(-4)})+
'"'}function A(a){return eval(a)}function I(a){function b(c,b,m,a){this.tag=c;this.text=b;this.index=m;this.subMatches=a}function e(){}function d(c){for(var b=1,m=[],a=[1],f=[],k=0;k<c.length;++k)a.push(b+=RegExp("|"+c[k][0].source).exec("").length),f.push(c[k][1]||e),m.push("("+c[k][0].source+")");return[RegExp(m.join("|")+"|","g"),a,f]}b.prototype.toString=function(){return this.text};var h=a.$||"$",c={},f;for(f in a)"$"!=f.charAt(0)&&(c[f]=d(a[f]));return function(a){var f=a.length,m=0,d=[""],
g={text:"",index:0,source:a,pushState:function(c){d.push(c)},popState:function(){d.pop()},retract:function(c){m-=c}};return{scan:function(){do{var k;a:{var e=c[d[d.length-1]],l=e[0];l.lastIndex=m;k=l.exec(a);if(""==k[0]){if(m<f)throw Error("lexer error: "+z(a,m)+"\n"+a.slice(m,m+50));k=new b(h,"",m)}else{g.index=m;m=l.lastIndex;for(var l=e[1],p=0;p<l.length;++p)if(k[l[p]]){e=e[2][p].apply(g,k.slice(l[p],l[p+1]));k=new b(e,k[0],g.index,k.slice(l[p]+1,l[p+1]));break a}k=void 0}}}while(null==k.tag);
return k},getPos:function(c){return z(a,c)}}}}function x(a){var b;a:{switch(a){case "id":case "lit":b=!0;break a}b=!1}return b||"."==a||"[]"==a}function y(a){return x(a)||"!"==a||"u-"==a}function B(a){if(y(a))return!0;switch(a){case "*":case "/":case "%":return!0}return!1}function C(a){if(B(a))return!0;switch(a){case "+":case "-":return!0}return!1}function D(a){if(C(a))return!0;switch(a){case "<":case ">":case "<=":case ">=":return!0}return!1}function E(a){if(D(a))return!0;switch(a){case "eq":case "ne":return!0}return!1}
function F(a){return E(a)||"&&"==a}function J(a){return F(a)||"||"==a}function K(a,b,e){function d(c){q+=c}function h(c){for(var a=0;a<c.length;++a){var g=c[a];switch(g[0]){case "if":d("if("+f(g[1])+"){");h(g[2]);d("}");g[3]&&(d("else{"),h(g[3]),d("}"));break;case "each":var k=g[3]?g[3].replace(/^_+/,"$&$&"):"_"+w++,q=f(g[1]);if(/^\w+$/.test(q))var l=q;else l="_"+w++,d("var "+l+" = "+q+";");g[5]?d("for(var "+k+"=0;"+k+"<"+l+".length;"+k+"++){"):d("for(var "+k+" in "+l+") {");d("var "+g[4]+" = "+l+
"["+k+"];");h(g[2]);d("}");break;case "set":d("var "+g[1].replace(/^_+/,"$&$&")+"="+f(g[2])+";");break;case "eval":k=f(g[1]);/^\w+$/.test(k)?q=k:(q="_t",d("_t = "+k+";"));d("if("+q+" !=null)_s += "+((e?!g[2]:g[2])?b+"("+q+")":q)+";");break;case "text":d("_s += "+v(g[1])+";");break;case "inc":break;default:throw Error("unknown stmt: "+g[0]);}}}function c(c,a){var b=f(c);a&&!a(c[0])&&(b="("+b+")");return b}function f(a){switch(a[0]){case "id":return a[1].replace(/^_+/,"$&$&");case "lit":return"string"==
typeof a[1]?v(a[1]):String(a[1]);case ".":return c(a[1],x)+"."+a[2];case "[]":return c(a[1],x)+"["+f(a[2])+"]";case "()":var b=[];if(a[2])for(var g=0;g<a[2].length;++g)b.push(f(a[2][g]));return c(a[1],x)+"("+b.join(",")+")";case "!":return"!"+c(a[1],y);case "u-":return"- "+c(a[1],y);case "*":case "/":case "%":return c(a[1],B)+a[0]+c(a[2],y);case "+":case "-":return c(a[1],C)+a[0]+" "+c(a[2],B);case "<":case ">":case "<=":case ">=":return c(a[1],D)+a[0]+c(a[2],C);case "==":case "!=":case "===":case "!==":return c(a[1],
E)+a[0]+c(a[2],D);case "&&":return c(a[1],F)+"&&"+c(a[2],E);case "||":return c(a[1],J)+"||"+c(a[2],F);default:throw Error("unknown expr: "+a[0]);}}var w=0,q="";h(a[1]);return q}function G(a){return L(M(a))}function H(a,b){var e=G(a),d;b&&(d=b.htmlEncode);a=K(e,d||"_htmlEncode",!0);e="";d||(e="var _obj = { '<': '&lt;', '>': '&gt;', '&': '&amp;', '\"': '&quot;' };\tfunction _htmlEncode(s) {\t\treturn String(s).replace(/[<>&\"]/g, function(c) {\t\t\treturn _obj[c];\t\t});\t}");return Function("root",
e+("var _t,_s = '';"+a+"return _s;"))}t.prototype.toString=function(){return"("+this.row+","+this.col+")"};var M=function(){var a=[[/\s+/],[/\/\/[^\r\n]*|\/\*[\s\S]*?\*\//],[/[A-Za-z_]\w*/,function(a){switch(a){case "true":case "false":return"boolean";case "set":case "include":return a;default:if(-1!=" abstract boolean break byte case catch char class const continue debugger default delete do double else enum export extends final finally float for function goto if implements import in instanceof int interface let long native new package private protected public return short static super switch synchronized this throw throws transient try typeof var void volatile while with yield ".indexOf(" "+
a+" ")||"null"==a)throw Error("Reserved: "+a+" "+z(this.source,this.index));return"realId"}}],[/"(?:[^"\\]|\\[\s\S])*"|'(?:[^'\\]|\\[\s\S])*'/,function(a){return"string"}],[/\d+(?:\.\d+)?(?:e-?\d+)?/,function(a){return"number"}],[function(a){a.sort().reverse();for(var e=0;e<a.length;++e)a[e]=a[e].replace(/[()*+?.[\]|]/g,"\\$&");return RegExp(a.join("|"))}("! % && ( ) * + - . / < <= = > >= [ ] || === !== == != ,".split(" ")),function(a){return/[*/%]/.test(a)?"mul":/[<>]/.test(a)?"rel":/[!=]=/.test(a)?
"eq":a}]];return I({"":[[/(?:(?!{{)[\s\S])+/,function(a){return"text"}],[/{{{/,function(a){this.pushState(a);return a}],[/{{(?:\/if|else|\/each|\/forin|\/raw)}}/,function(a){return a}],[/{{#raw}}/,function(a){this.pushState("raw");return a}],[/{{(?:#(?:if|each|forin)(?=\s))?/,function(a){this.pushState("{{");return a}]],raw:[[/(?:(?!{{\/raw}})[\s\S])+/,function(a){this.popState();return"rawtext"}]],"{{":a.concat([[/}}/,function(a){this.popState();return a}]]),"{{{":a.concat([[/}}}/,function(a){this.popState();
return a}]])})}(),L=function(){return function(a){function b(a,c){return f[a][c]}for(var e=a.nStart,d=a.tSymbols,h={},c=0;c<d.length;++c)h[d[c]]=c;var f=a.tAction,w=a.tGoto,q=a.tRules,m=a.tFuncs,u=a.actionIndex;u&&(b=function(a,c){var b=f[u[a]];return b[c]||b._});return function(a,c){function f(c){throw Error("Syntax error: "+a.getPos(u.index)+(c?"\n"+c:""));}var l=0,p=[0],u=a.scan(),r=[],t={get:function(a){return r[r.length+a]},set:function(a,c){r[r.length+a]=c}};if(c)for(var n in c)t[n]=c[n];for(;;)if(n=
b(l,h[u.tag]))if(0<n)p.push(l=n),r.push(u),u=a.scan();else if(0>n&&-32768<n){n=-n;var l=q[n],s=l.length-1;p.length-=s;l=w[p[p.length-1]][l[0]-e];p.push(l);m[n]?(n=m[n].apply(t,r.splice(r.length-s,s)),r.push(n)):1!=s&&r.splice(r.length-s,s,null)}else return u.tag!=d[0]&&f(),r[0];else{n=[];for(s=0;s<e;++s)b(l,s)&&n.push(d[s]);f("find "+u.tag+"\nexpect "+n.join(" "))}}}({nStart:37,tSymbols:"$ ! && ( ) + , - . = [ ] boolean eq include mul number rawtext realId rel set string text {{ {{#each {{#forin {{#if {{#raw}} {{/each}} {{/forin}} {{/if}} {{/raw}} {{else}} {{{ || }} }}} AdditiveExpression EqualityExpression LogicalAndExpression LogicalOrExpression MemberExpression MultiplicativeExpression PrimaryExpression RelationalExpression UnaryExpression _text args epsilon expr id name program statement statements texts".split(" "),
tAction:[{_:-2},{_:-32768},{22:3,23:4,24:5,25:6,26:7,27:8,33:9,_:-1},{_:-19},{1:13,3:14,7:15,12:16,14:17,16:18,18:19,20:20,21:21,_:0},{1:13,3:14,7:15,12:16,14:33,16:18,18:19,20:34,21:21,_:0},{17:38,_:0},{_:-17},{_:-3},{22:3,27:8,_:-13},{_:-26},{21:44,_:-23},{_:-25},{_:-21},{14:33,18:19,20:34,_:-22},{_:-24},{5:46,7:47,_:-44},{13:48,_:-48},{2:49,_:-50},{34:50,_:-52},{3:51,8:52,10:53,_:-36},{15:54,_:-41},{_:-29},{19:55,_:-46},{_:-39},{35:56,_:0},{_:-27},{_:-23},{_:-22},{14:33,18:19,20:34,21:57,_:0},
{35:61,_:0},{31:62,_:0},{36:63,_:0},{_:-18},{_:-37},{4:64,_:0},{_:-38},{35:65,_:0},{9:66,_:0},{1:13,3:14,7:15,12:16,14:33,16:18,18:19,20:34,21:21,_:-53},{14:33,18:19,20:34,_:0},{_:-11},{_:-15},{_:-16},{14:33,18:19,20:34,21:57,_:-53},{_:-20},{_:-12},{_:-28},{_:-14},{15:54,_:-42},{15:54,_:-43},{19:55,_:-47},{13:48,_:-49},{2:49,_:-51},{4:85,6:86,_:0},{4:87,_:0},{_:-34},{_:-30},{11:88,_:0},{_:-40},{5:46,7:47,_:-45},{35:89,_:0},{35:90,_:0},{35:91,_:0},{35:92,_:0},{22:3,23:4,24:5,25:6,26:7,27:8,30:93,32:94,
33:9,_:0},{35:95,_:0},{_:-33},{_:-32},{_:-31},{_:-4},{_:-10},{_:-35},{22:3,23:4,24:5,25:6,26:7,27:8,28:102,33:9,_:0},{22:3,23:4,24:5,25:6,26:7,27:8,28:103,33:9,_:0},{22:3,23:4,24:5,25:6,26:7,27:8,29:104,33:9,_:0},{22:3,23:4,24:5,25:6,26:7,27:8,29:105,33:9,_:0},{22:3,23:4,24:5,25:6,26:7,27:8,30:106,33:9,_:0},{_:-6},{_:-7},{_:-8},{_:-9},{_:-5}],actionIndex:[0,1,2,3,4,5,5,5,6,5,7,8,9,5,5,5,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,29,30,31,32,33,34,35,36,37,38,5,5,5,5,5,39,40,5,5,5,
41,42,43,44,44,0,45,46,47,48,5,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,5,68,69,0,0,0,0,70,0,71,72,73,74,75,76,77,78,79,80,81,82],tGoto:[{15:1,17:2},,{9:10,16:11,18:12},,{0:22,1:23,2:24,3:25,4:26,5:27,6:28,7:29,8:30,12:31,13:32},{0:22,1:23,2:24,3:25,4:26,5:27,6:28,7:29,8:30,12:35,13:32},{0:22,1:23,2:24,3:25,4:26,5:27,6:28,7:29,8:30,12:36,13:32},{0:22,1:23,2:24,3:25,4:26,5:27,6:28,7:29,8:30,12:37,13:32},,{0:22,1:23,2:24,3:25,4:26,5:27,6:28,7:29,8:30,12:39,13:32},,,{9:40},{4:26,6:28,
8:41,13:32},{0:22,1:23,2:24,3:25,4:26,5:27,6:28,7:29,8:30,12:42,13:32},{4:26,6:28,8:43,13:32},,,,,{13:45},,,,,,,,,,,,,,,{13:58,14:59},{13:58,14:60},,,,,,,,,,{4:26,5:67,6:28,8:30,13:32},{4:26,5:68,6:28,8:30,13:32},{0:22,4:26,5:27,6:28,7:69,8:30,13:32},{0:22,1:70,4:26,5:27,6:28,7:29,8:30,13:32},{0:22,1:23,2:71,4:26,5:27,6:28,7:29,8:30,13:32},{0:22,1:23,2:24,3:25,4:26,5:27,6:28,7:29,8:30,10:72,11:73,12:74,13:32},{13:75},{0:22,1:23,2:24,3:25,4:26,5:27,6:28,7:29,8:30,12:76,13:32},{4:26,6:28,8:77,13:32},
{0:78,4:26,5:27,6:28,8:30,13:32},,,,{11:79,13:58,14:80},{11:81,13:58,14:82},{17:83},,,,,{0:22,1:23,2:24,3:25,4:26,5:27,6:28,7:29,8:30,12:84,13:32},,,,,,,,,,,,,,,,,{9:10,16:11,18:12},,,{0:22,1:23,2:24,3:25,4:26,5:27,6:28,7:29,8:30,12:96,13:32},,,{17:97},{17:98},{17:99},{17:100},,{17:101},,,{9:10,16:11,18:12},{9:10,16:11,18:12},{9:10,16:11,18:12},{9:10,16:11,18:12},{9:10,16:11,18:12}],tRules:[[56,52],[52,54],[54],[54,54,53],[53,26,49,35,54,30],[53,26,49,35,54,32,54,30],[53,24,49,51,48,35,54,28],[53,
24,49,51,51,35,54,28],[53,25,49,51,48,35,54,29],[53,25,49,51,51,35,54,29],[53,23,20,50,9,49,35],[53,23,49,35],[53,33,49,36],[53,55],[53,23,14,21,35],[51,21],[51,50],[55,46],[55,55,46],[46,22],[46,27,17,31],[50,18],[50,20],[50,14],[43,21],[43,16],[43,12],[43,50],[43,3,49,4],[41,43],[41,41,8,50],[41,41,10,49,11],[41,41,3,48,4],[41,41,3,47,4],[47,49],[47,47,6,49],[45,41],[45,1,45],[45,7,45],[42,45],[42,42,15,45],[37,42],[37,37,5,42],[37,37,7,42],[44,37],[44,44,19,37],[38,44],[38,38,13,44],[39,38],[39,
39,2,38],[40,39],[40,40,34,39],[49,40],[48]],tFuncs:function(){function a(a,f,b,d,e,h,g){return["each",f,h,d,b,!0]}function b(a,f,b,d,e,h,g){return["each",f,h,d,b,!1]}function e(a){return a.text}function d(a,f,b,d){return["()",a,b]}function h(a,f,b){return[f.text,a,b]}return[,function(a){return["prog",a]},function(){return[]},function(a,f){a.push(f);return a},function(a,f,b,d,e){return["if",f,d]},function(a,f,b,d,e,h,g){return["if",f,d,h]},a,a,b,b,function(a,f,b,d,e,h){return["set",b.text,e]},function(a,
b,d){return["eval",b,!1]},function(a,b,d){return["eval",b,!0]},function(a){return["text",a]},function(a,b,d,e){return["inc",A(d.text)]},function(a){return A(a.text)},e,function(a){return a},function(a,b){return a+b},e,function(a,b,d){return b.text},,,,function(a){return["lit",A(a.text)]},function(a){return["lit",+a.text]},function(a){return["lit","true"==a.text]},function(a){return["id",a.text]},function(a,b,d){return b},,function(a,b,d){return[".",a,d.text]},function(a,b,d,e){return["[]",a,d]},d,
d,function(a){return[a]},function(a,b,d){a.push(d);return a},,function(a,b){return["!",b]},function(a,b){return["u-",b]},,h,,h,h,,h,,h,,h,,h]}()})}();return{parse:G,compile:H,render:function(a,b){return H(a)(b)},version:"1.3.1"}}();"object"==typeof module&&module&&"object"==typeof module.exports?module.exports=t:"function"==typeof define&&(define.amd||define.cmd)?define(function(){return t}):"undefined"!=typeof KISSY&&KISSY.add(function(){return t});v&&(v.Crox=t)})(this);
