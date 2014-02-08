/*
 Crox v1.2.0
 https://github.com/thx/crox

 Released under the MIT license
 md5: fe7c8a0bad0eda7fd248609d71e17d77
*/
(function(l){var r=function(){function r(a,d){this.row=a;this.col=d}function x(a,d){var c=a.substring(0,d),f=c.match(/\r\n?|\n/g),b=1;f&&(b+=f.length);c=1+/[^\r\n]*$/.exec(c)[0].length;return new r(b,c)}function l(a){return'"'+a.replace(/[\x00-\x1f"\\\u2028\u2029]/g,function(d){switch(d){case '"':return'\\"';case "\\":return"\\\\";case "\b":return"\\b";case "\f":return"\\f";case "\n":return"\\n";case "\r":return"\\r";case "\t":return"\\t"}return"\\u"+("000"+d.charCodeAt(0).toString(16)).slice(-4)})+
'"'}function G(a){function d(d,a,b,f){this.tag=d;this.text=a;this.index=b;this.subMatches=f}function c(){}function f(d){for(var a=1,b=[],f=[1],g=[],e=0;e<d.length;++e)f.push(a+=RegExp("|"+d[e][0].source).exec("").length),g.push(d[e][1]||c),b.push("("+d[e][0].source+")");return[RegExp(b.join("|")+"|","g"),f,g]}d.prototype.toString=function(){return this.text};var b=a.$||"$",g={},e;for(e in a)"$"!=e.charAt(0)&&(g[e]=f(a[e]));return function(a){var f=a.length,c=0,e=[""],u={text:"",index:0,source:a,pushState:function(a){e.push(a)},
popState:function(){e.pop()},retract:function(a){c-=a}};return{scan:function(){do{var p;a:{var q=g[e[e.length-1]],h=q[0];h.lastIndex=c;p=h.exec(a);if(""==p[0]){if(c<f)throw Error("lexer error: "+x(a,c)+"\n"+a.slice(c,c+50));p=new d(b,"",c)}else{u.index=c;c=h.lastIndex;for(var h=q[1],n=0;n<h.length;++n)if(p[h[n]]){q=q[2][n].apply(u,p.slice(h[n],h[n+1]));p=new d(q,p[0],u.index,p.slice(h[n]+1,h[n+1]));break a}p=void 0}}}while(null==p.tag);return p},getPos:function(d){return x(a,d)},reset:function(){c=
0;e=[""]}}}}function y(a){var d;a:{switch(a){case "id":case "lit":d=!0;break a}d=!1}return d||"."==a||"[]"==a}function w(a){return y(a)||"!"==a||"u-"==a}function z(a){if(w(a))return!0;switch(a){case "*":case "/":case "%":return!0}return!1}function A(a){if(z(a))return!0;switch(a){case "+":case "-":return!0}return!1}function B(a){if(A(a))return!0;switch(a){case "<":case ">":case "<=":case ">=":return!0}return!1}function C(a){if(B(a))return!0;switch(a){case "eq":case "ne":return!0}return!1}function D(a){return C(a)||
"&&"==a}function H(a){return D(a)||"||"==a}function I(a,d){function c(a){v+=e+a+"\n"}function f(a){for(var b=0;b<a.length;++b){var m=a[b];switch(m[0]){case "if":c("if("+g(m[1])+"){");e+="\t";f(m[2]);e=e.slice(0,-1);c("}");m[3]&&(c("else{"),e+="\t",f(m[3]),e=e.slice(0,-1),c("}"));break;case "each":var u=m[3]||"$i";c("var $list = "+g(m[1])+";");c("for(var "+u+" in $list) {");e+="\t";c("var "+m[4]+" = $list["+u+"];");f(m[2]);e=e.slice(0,-1);c("}");break;case "set":c("var "+m[1]+"="+g(m[2])+";");break;
case "eval":u=g(m[1]);m[2]&&(u=d+"("+u+")");c("$s += "+u+";");break;case "text":c("$s += "+l(m[1])+";");break;case "inc":break;default:throw Error("unknown stmt: "+m[0]);}}}function b(a,d){var b=g(a);d&&!d(a[0])&&(b="("+b+")");return b}function g(a){switch(a[0]){case "id":return a[1];case "lit":return"string"==typeof a[1]?l(a[1]):String(a[1]);case ".":return b(a[1],y)+"."+a[2];case "[]":return b(a[1],y)+"["+g(a[2])+"]";case "!":return"!"+b(a[1],w);case "u-":return"- "+b(a[1],w);case "*":case "/":case "%":return b(a[1],
z)+a[0]+b(a[2],w);case "+":case "-":return b(a[1],A)+a[0]+" "+b(a[2],z);case "<":case ">":case "<=":case ">=":return b(a[1],B)+a[0]+b(a[2],A);case "eq":case "ne":return b(a[1],C)+("eq"==a[0]?"===":"!==")+b(a[2],B);case "&&":return b(a[1],D)+"&&"+b(a[2],C);case "||":return b(a[1],H)+"||"+b(a[2],D);default:throw Error("unknown expr: "+a[0]);}}var e="\t",v="";f(a[1]);return v}function E(a){return J(K(a))}function F(a,d){var c=E(a),f;d&&(f=d.htmlEncode);var c=I(c,f||"$htmlEncode"),b="";f||(b+="var obj = { '<': '&lt;', '>': '&gt;', '&': '&amp;', '\"': '&quot;' };\n\tfunction $htmlEncode(s) {\n\t\treturn String(s).replace(/[<>&\"]/g, function(c) {\n\t\t\treturn obj[c];\n\t\t});\n\t}");
b=b+"var $s = '';"+c;b+="return $s;";return Function("root",b)}r.prototype.toString=function(){return"("+this.row+","+this.col+")"};var K=function(){var a=[[/\s+/,function(){return null}],[/[A-Za-z_]\w*/,function(a){switch(a){case "true":case "false":return"boolean";case "set":case "include":return a;default:if(-1!=" abstract boolean break byte case catch char class const continue debugger default delete do double else enum export extends final finally float for function goto if implements import in instanceof int interface let long native new package private protected public return short static super switch synchronized this throw throws transient try typeof var void volatile while with yield ".indexOf(" "+
a+" ")||"null"==a)throw Error("Reserved: "+a+" "+x(this.source,this.index));return"realId"}}],[/"(?:[^"\\]|\\[\s\S])*"|'(?:[^'\\]|\\[\s\S])*'/,function(a){return"string"}],[/\d+(?:\.\d+)?(?:e-?\d+)?/,function(a){return"number"}],[function(a){a.sort().reverse();for(var c=0;c<a.length;++c)a[c]=a[c].replace(/[()*+?.[\]|]/g,"\\$&");return RegExp(a.join("|"))}("! % && ( ) * + - . / < <= = > >= [ ] || === !==".split(" ")),function(a){switch(a){case "===":return"eq";case "!==":return"ne";default:return a}}]];
return G({"":[[/(?:(?!{{)[\s\S])+/,function(a){return"{{"==a.substring(0,2)?(this.pushState(a),a):"text"}],[/{{{/,function(a){this.pushState(a);return a}],[/{{(?:\/if|else|\/each)}}/,function(a){return a}],[/{{(?:#(?:if|each)(?=\s))?/,function(a){this.pushState("{{");return a}]],"{{":a.concat([[/}}/,function(a){this.popState();return a}]]),"{{{":a.concat([[/}}}/,function(a){this.popState();return a}]])})}(),J=function(){return function(a){function d(a,b){return g[a][b]}var c=a.nStart,f=a.tSymbols,
b=a.tSymbolIndex,g=a.tAction,e=a.tGoto,v=a.tRules,r=a.tFuncs,l=a.actionIndex;l&&(d=function(a,b){var f=g[l[a]];return f[b]||f._});return function(a,g){function p(b){throw Error("Syntax error: "+a.getPos(n.index)+(b?"\n"+b:""));}var q=0,h=[0],n=a.scan(),s=[],l={get:function(a){return s[s.length+a]},set:function(a,b){s[s.length+a]=b}};if(g)for(var k in g)l[k]=g[k];for(;;)if(k=d(q,b[n.tag]))if(0<k)h.push(q=k),s.push(n),n=a.scan();else if(0>k&&-32768<k){k=-k;var q=v[k],t=q.length-1;h.length-=t;q=e[h[h.length-
1]][q[0]-c];h.push(q);r[k]?(k=r[k].apply(l,s.splice(s.length-t,t)),s.push(k)):1!=t&&s.splice(s.length-t,t,null)}else return n.tag!=f[0]&&p(),s[0];else{k=[];for(t=0;t<c;++t)d(q,t)&&k.push(f[t]);p("find "+n.tag+"\nexpect "+k.join(" "))}}}({nStart:37,tSymbols:"$ ! % && ( ) * + - . / < <= = > >= [ ] boolean eq include ne number realId set string text {{ {{#each {{#if {{/each}} {{/if}} {{else}} {{{ || }} }}} AdditiveExpression EqualityExpression LogicalAndExpression LogicalOrExpression MemberExpression MultiplicativeExpression PrimaryExpression RelationalExpression UnaryExpression epsilon expr id program statement statements".split(" "),
tSymbolIndex:{$:0,"!":1,"%":2,"&&":3,"(":4,")":5,"*":6,"+":7,"-":8,".":9,"/":10,"<":11,"<=":12,"=":13,">":14,">=":15,"[":16,"]":17,"boolean":18,eq:19,include:20,ne:21,number:22,realId:23,set:24,string:25,text:26,"{{":27,"{{#each":28,"{{#if":29,"{{/each}}":30,"{{/if}}":31,"{{else}}":32,"{{{":33,"||":34,"}}":35,"}}}":36,AdditiveExpression:37,EqualityExpression:38,LogicalAndExpression:39,LogicalOrExpression:40,MemberExpression:41,MultiplicativeExpression:42,PrimaryExpression:43,RelationalExpression:44,
UnaryExpression:45,epsilon:46,expr:47,id:48,program:49,statement:50,statements:51},tAction:[{_:-2},{_:-32768},{26:3,27:4,28:5,29:6,33:7,_:-1},{_:-11},{1:9,4:10,8:11,18:12,20:13,22:14,23:15,24:16,25:17,_:0},{1:9,4:10,8:11,18:12,20:29,22:14,23:15,24:30,25:17,_:0},{_:-3},{_:-18},{25:37,_:-15},{_:-17},{_:-13},{20:29,23:15,24:30,_:-14},{_:-16},{7:39,8:40,_:-34},{19:41,21:42,_:-42},{3:43,_:-44},{34:44,_:-46},{9:45,16:46,_:-24},{2:47,6:48,10:49,_:-31},{_:-21},{11:50,12:51,14:52,15:53,_:-39},{_:-27},{35:54,
_:0},{_:-19},{_:-15},{_:-14},{25:55,_:0},{35:56,_:0},{36:57,_:0},{_:-25},{5:58,_:0},{_:-26},{35:59,_:0},{13:60,_:0},{20:29,23:15,24:30,_:0},{_:-9},{25:76,_:-47},{_:-10},{_:-20},{_:-12},{2:47,6:48,10:49,_:-32},{2:47,6:48,10:49,_:-33},{11:50,12:51,14:52,15:53,_:-40},{11:50,12:51,14:52,15:53,_:-41},{19:41,21:42,_:-43},{3:43,_:-45},{_:-22},{17:80,_:0},{_:-30},{_:-28},{_:-29},{7:39,8:40,_:-35},{7:39,8:40,_:-37},{7:39,8:40,_:-36},{7:39,8:40,_:-38},{35:81,_:0},{35:82,_:0},{26:3,27:4,28:5,29:6,31:83,32:84,
33:7,_:0},{35:85,_:0},{_:-23},{_:-4},{_:-8},{26:3,27:4,28:5,29:6,30:89,33:7,_:0},{26:3,27:4,28:5,29:6,30:90,33:7,_:0},{26:3,27:4,28:5,29:6,31:91,33:7,_:0},{_:-7},{_:-6},{_:-5}],actionIndex:[0,1,2,3,4,5,5,5,6,5,5,5,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,5,5,5,5,5,5,34,5,5,5,5,5,5,5,5,35,36,0,37,38,39,5,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,0,0,60,0,61,62,63,64,65,66,67],tGoto:[{12:1,14:2},,{13:8},,{0:18,1:19,2:20,3:21,4:22,5:23,6:24,7:25,
8:26,10:27,11:28},{0:18,1:19,2:20,3:21,4:22,5:23,6:24,7:25,8:26,10:31,11:28},{0:18,1:19,2:20,3:21,4:22,5:23,6:24,7:25,8:26,10:32,11:28},{0:18,1:19,2:20,3:21,4:22,5:23,6:24,7:25,8:26,10:33,11:28},,{4:22,6:24,8:34,11:28},{0:18,1:19,2:20,3:21,4:22,5:23,6:24,7:25,8:26,10:35,11:28},{4:22,6:24,8:36,11:28},,,,,{11:38},,,,,,,,,,,,,,,,,,,,,,,{4:22,5:61,6:24,8:26,11:28},{4:22,5:62,6:24,8:26,11:28},{0:18,4:22,5:23,6:24,7:63,8:26,11:28},{0:18,4:22,5:23,6:24,7:64,8:26,11:28},{0:18,1:65,4:22,5:23,6:24,7:25,8:26,
11:28},{0:18,1:19,2:66,4:22,5:23,6:24,7:25,8:26,11:28},{11:67},{0:18,1:19,2:20,3:21,4:22,5:23,6:24,7:25,8:26,10:68,11:28},{4:22,6:24,8:69,11:28},{4:22,6:24,8:70,11:28},{4:22,6:24,8:71,11:28},{0:72,4:22,5:23,6:24,8:26,11:28},{0:73,4:22,5:23,6:24,8:26,11:28},{0:74,4:22,5:23,6:24,8:26,11:28},{0:75,4:22,5:23,6:24,8:26,11:28},,{9:77},{14:78},,,,{0:18,1:19,2:20,3:21,4:22,5:23,6:24,7:25,8:26,10:79,11:28},,,,,,,,,,,,,,,,,,{13:8},,,{14:86},{14:87},,{14:88},,{13:8},{13:8},{13:8}],tRules:[[52,49],[49,51],[51],
[51,51,50],[50,29,47,35,51,31],[50,29,47,35,51,32,51,31],[50,28,47,25,46,35,51,30],[50,28,47,25,25,35,51,30],[50,27,24,48,13,47,35],[50,27,47,35],[50,33,47,36],[50,26],[50,27,20,25,35],[48,23],[48,24],[48,20],[43,25],[43,22],[43,18],[43,48],[43,4,47,5],[41,43],[41,41,9,48],[41,41,16,47,17],[45,41],[45,1,45],[45,8,45],[42,45],[42,42,6,45],[42,42,10,45],[42,42,2,45],[37,42],[37,37,7,42],[37,37,8,42],[44,37],[44,44,11,37],[44,44,14,37],[44,44,12,37],[44,44,15,37],[38,44],[38,38,19,44],[38,38,21,44],
[39,38],[39,39,3,38],[40,39],[40,40,34,39],[47,40],[46]],tFuncs:function(){function a(a,b,c,e,d,l,r){return["each",b,l,e&&eval(e.text),eval(c.text)]}function d(a){return["lit",eval(a.text)]}function c(a,b,c){return[b.text,a,c]}return[,function(a){return["prog",a]},function(){return[]},function(a,b){a.push(b);return a},function(a,b,c,e,d){return["if",b,e]},function(a,b,c,d,l,r,w){return["if",b,d,r]},a,a,function(a,b,c,d,l,r){return["set",c.text,l]},function(a,b,c){return["eval",b,!0]},function(a,b,
c){return["eval",b,!1]},function(a){return["text",a.text]},function(a,b,c,d){return["inc",eval(c.text)]},,,,d,d,function(a){return["lit","true"==a.text]},function(a){return["id",a.text]},function(a,b,c){return b},,function(a,b,c){return[".",a,c.text]},function(a,b,c,d){return["[]",a,c]},,function(a,b){return["!",b]},function(a,b){return["u-",b]},,c,c,c,,c,c,,c,c,c,c,,function(a,b,c){return["eq",a,c]},function(a,b,c){return["ne",a,c]},,c,,c]}()})}();return{parse:E,compile:F,render:function(a,d){return F(a)(d)},
version:"1.2.0"}}();"object"==typeof module&&module&&"object"==typeof module.exports?module.exports=r:"function"==typeof define&&(define.amd||define.cmd)?define(function(){return r}):"undefined"!=typeof KISSY&&KISSY.add("crox",function(){return r});l&&(l.Crox=r)})(this);
