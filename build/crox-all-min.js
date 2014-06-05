/*
 Crox v1.3.1
 https://github.com/thx/crox

 Released under the MIT license
 md5: 8da2a66f77bf4c724bc022772a8cc33d
*/
(function(C){var A=function(){function A(a,g){this.row=a;this.col=g}function F(a,g){var f=a.substring(0,g),e=f.match(/\r\n?|\n/g),d=1;e&&(d+=e.length);f=1+/[^\r\n]*$/.exec(f)[0].length;return new A(d,f)}function C(a){return'"'+a.replace(/[\x00-\x1f"\\\u2028\u2029]/g,function(g){switch(g){case '"':return'\\"';case "\\":return"\\\\";case "\b":return"\\b";case "\f":return"\\f";case "\n":return"\\n";case "\r":return"\\r";case "\t":return"\\t"}return"\\u"+("000"+g.charCodeAt(0).toString(16)).slice(-4)})+
'"'}function G(a){return eval(a)}function t(a){return a.replace(/^_+/,"$&$&")}function J(a){function g(b,c,h,g){this.tag=b;this.text=c;this.index=h;this.subMatches=g}function f(){}function e(b){for(var c=1,h=[],g=[1],a=[],e=0;e<b.length;++e)g.push(c+=RegExp("|"+b[e][0].source).exec("").length),a.push(b[e][1]||f),h.push("("+b[e][0].source+")");return[RegExp(h.join("|")+"|","g"),g,a]}g.prototype.toString=function(){return this.text};var d=a.$||"$",b={},h;for(h in a)"$"!=h.charAt(0)&&(b[h]=e(a[h]));
return function(h){var c=h.length,l=0,a=[""],e={text:"",index:0,source:h,pushState:function(b){a.push(b)},popState:function(){a.pop()},retract:function(b){l-=b}};return{scan:function(){do{var f;a:{var r=b[a[a.length-1]],k=r[0];k.lastIndex=l;f=k.exec(h);if(""==f[0]){if(l<c)throw Error("lexer error: "+F(h,l)+"\n"+h.slice(l,l+50));f=new g(d,"",l)}else{e.index=l;l=k.lastIndex;for(var k=r[1],q=0;q<k.length;++q)if(f[k[q]]){r=r[2][q].apply(e,f.slice(k[q],k[q+1]));f=new g(r,f[0],e.index,f.slice(k[q]+1,k[q+
1]));break a}f=void 0}}}while(null==f.tag);return f},getPos:function(b){return F(h,b)}}}}function w(a){var g;a:{switch(a){case "id":case "lit":g=!0;break a}g=!1}return g||"."==a||"[]"==a}function m(a){return w(a)||"!"==a||"u-"==a}function x(a){if(m(a))return!0;switch(a){case "*":case "/":case "%":return!0}return!1}function y(a){if(x(a))return!0;switch(a){case "+":case "-":return!0}return!1}function z(a){if(y(a))return!0;switch(a){case "<":case ">":case "<=":case ">=":return!0}return!1}function B(a){if(z(a))return!0;
switch(a){case "eq":case "ne":return!0}return!1}function D(a){return B(a)||"&&"==a}function H(a){return D(a)||"||"==a}function K(a,g,f){function e(b){c+=b}function d(b){for(var c=0;c<b.length;++c){var a=b[c];switch(a[0]){case "if":e("if("+h(a[1])+"){");d(a[2]);e("}");a[3]&&(e("else{"),d(a[3]),e("}"));break;case "each":var p=a[3]?t(a[3]):"_"+s++,r=h(a[1]);if(/^\w+$/.test(r))var k=r;else k="_"+s++,e("var "+k+" = "+r+";");a[5]?e("for(var "+p+"=0;"+p+"<"+k+".length;"+p+"++){"):e("for(var "+p+" in "+k+
") {");e("var "+a[4]+" = "+k+"["+p+"];");d(a[2]);e("}");break;case "set":e("var "+t(a[1])+"="+h(a[2])+";");break;case "eval":p=h(a[1]);/^\w+$/.test(p)?r=p:(r="_t",e("_t = "+p+";"));e("if("+r+" !=null)_s += "+((f?!a[2]:a[2])?g+"("+r+")":r)+";");break;case "text":e("_s += "+C(a[1])+";");break;case "inc":break;default:throw Error("unknown stmt: "+a[0]);}}}function b(b,c){var a=h(b);c&&!c(b[0])&&(a="("+a+")");return a}function h(c){switch(c[0]){case "id":return t(c[1]);case "lit":return"string"==typeof c[1]?
C(c[1]):String(c[1]);case ".":return b(c[1],w)+"."+c[2];case "[]":return b(c[1],w)+"["+h(c[2])+"]";case "()":var a=[];if(c[2])for(var g=0;g<c[2].length;++g)a.push(h(c[2][g]));return b(c[1],w)+"("+a.join(",")+")";case "!":return"!"+b(c[1],m);case "u-":return"- "+b(c[1],m);case "*":case "/":case "%":return b(c[1],x)+c[0]+b(c[2],m);case "+":case "-":return b(c[1],y)+c[0]+" "+b(c[2],x);case "<":case ">":case "<=":case ">=":return b(c[1],z)+c[0]+b(c[2],y);case "==":case "!=":case "===":case "!==":return b(c[1],
B)+c[0]+b(c[2],z);case "&&":return b(c[1],D)+"&&"+b(c[2],B);case "||":return b(c[1],H)+"||"+b(c[2],D);default:throw Error("unknown expr: "+c[0]);}}var s=0,c="";d(a[1]);return c}function E(a){return L(M(a))}function I(a,g){var f=E(a),e;g&&(e=g.htmlEncode);a=K(f,e||"_htmlEncode",!0);f="";e||(f="var _obj = { '<': '&lt;', '>': '&gt;', '&': '&amp;', '\"': '&quot;' };\tfunction _htmlEncode(s) {\t\treturn String(s).replace(/[<>&\"]/g, function(c) {\t\t\treturn _obj[c];\t\t});\t}");return Function("root",
f+("var _t,_s = '';"+a+"return _s;"))}function N(a,g){function f(a){for(var e=0;e<a.length;++e){var c=a[e];switch(c[0]){case "if":var l="if("+d(c[1])+"){";b+=l;f(c[2]);b+="}";c[3]&&(b+="else{",f(c[3]),b+="}");break;case "each":l="foreach("+d(c[1])+" as "+(c[3]?"$crox_"+t(c[3])+"=>":"")+("$crox_"+t(c[4]))+")";b+=l;b+="{";f(c[2]);b+="}";break;case "set":c="$crox_"+t(c[1])+" = "+d(c[2])+";";b+=c;break;case "eval":l=d(c[1]);b+="crox_echo("+l+", "+(g?!c[2]:c[2])+");";break;case "text":l=c[1];/<\?(?:php)?|\?>/.test(l)?
(c="echo "+("'"+String(c[1]).replace(/['\\]/g,"\\$&")+"'")+";",b+=c):b+="?>"+l+"<?php ";break;case "inc":c="include '"+c[1].replace(/\.\w+$/,".php")+"';";b+=c;break;default:throw Error("unknown stmt: "+c[0]);}}}function e(b,a){var c=d(b);a&&!a(b[0])&&(c="("+c+")");return c}function d(b){switch(b[0]){case "id":return"$crox_"+t(b[1]);case "lit":return"string"==typeof b[1]?"'"+String(b[1]).replace(/['\\]/g,"\\$&")+"'":String(b[1]);case ".":return e(b[1],w)+"->"+b[2];case "[]":return e(b[1],w)+"["+d(b[2])+
"]";case "!":return"!crox_ToBoolean("+e(b[1],m)+")";case "u-":return"- "+e(b[1],m);case "*":case "/":case "%":return e(b[1],x)+b[0]+e(b[2],m);case "+":return"crox_plus("+e(b[1],null)+", "+e(b[2],null)+")";case "-":return e(b[1],y)+"- "+e(b[2],x);case "<":case ">":case "<=":case ">=":return e(b[1],z)+b[0]+e(b[2],y);case "==":case "!=":case "===":case "!==":return e(b[1],B)+b[0]+e(b[2],z);case "&&":return"crox_logical_and("+e(b[1],null)+", "+e(b[2],null)+")";case "||":return"crox_logical_or("+e(b[1],
null)+", "+e(b[2],null)+")";default:throw Error("unknown expr: "+b[0]);}}var b="";f(a[1]);b="?>"==b.slice(0,2)?b.slice(2):"<?php "+b;return b="<?php "==b.slice(-6)?b.slice(0,-6):b+"?>"}function O(a){function g(b){return"$crox_"+t(b)}function f(b){s+=b}function e(c){for(var a=0;a<c.length;++a){var d=c[a];switch(d[0]){case "if":f("#if("+b(d[1])+")");e(d[2]);d[3]&&(f("#{else}"),e(d[3]));f("#{end}");break;case "each":++h;var s=b(d[1]);if(/^$\w+$/.test(s))var p=s;else p="$list"+(1==h?"":h),f("#set ("+
p+" = "+s+")");d[5]?(f("#foreach("+g(d[4])+" in "+p+")"),d[3]&&f("#set("+g(d[3])+" = $velocityCount - 1)")):d[3]?(f("#foreach("+g(d[3])+" in "+p+".keySet())"),f("#set("+g(d[4])+" ="+p+".get("+g(d[3])+"))")):f("#foreach("+g(d[4])+" in "+p+")");e(d[2]);f("#{end}");--h;break;case "set":f("#set ("+g(d[1])+"="+b(d[2])+")");break;case "eval":d=b(d[1]);/^$\w+$/.test(d)?f("$!{"+d.slice(1)+"}"):f("#set($t = "+d+")$!{t}");break;case "text":f(d[1].replace(/\$/g,"$${dollar}").replace(/#/g,"$${sharp}"));break;
case "inc":f("#parse('"+d[1].replace(/\.\w+$/,".vm")+"')");break;default:throw Error("unknown stmt: "+d[0]);}}}function d(c,a){var g=b(c);a&&!a(c[0])&&(g="("+g+")");return g}function b(c){switch(c[0]){case "id":return g(c[1]);case "lit":return"string"==typeof c[1]?(c=c[1],c=-1==c.indexOf("'")?"'"+c+"'":"('"+c.split("'").join("'+\"'\"+'")+"')",c):String(c[1]);case ".":return d(c[1],w)+"."+c[2];case "[]":return d(c[1],w)+"["+b(c[2])+"]";case "!":return"!"+d(c[1],m);case "u-":if("u-"==c[1][0])throw Error("\u7981\u6b62\u4e24\u4e2a\u8d1f\u53f7\u8fde\u7528");
return"-"+d(c[1],m);case "*":case "/":case "%":return d(c[1],x)+c[0]+d(c[2],m);case "+":case "-":return d(c[1],y)+c[0]+" "+d(c[2],x);case "<":case ">":case "<=":case ">=":return d(c[1],z)+c[0]+d(c[2],y);case "==":case "!=":case "===":case "!==":return d(c[1],B)+c[0].slice(0,2)+d(c[2],z);case "&&":return d(c[1],D)+"&&"+d(c[2],B);case "||":return d(c[1],H)+"||"+d(c[2],D);default:throw Error("unknown expr: "+c[0]);}}var h=0,s="#set($dollar='$')#set($sharp='#')";e(a[1]);return s}A.prototype.toString=
function(){return"("+this.row+","+this.col+")"};var M=function(){var a=[[/\s+/],[/\/\/[^\r\n]*|\/\*[\s\S]*?\*\//],[/[A-Za-z_]\w*/,function(a){switch(a){case "true":case "false":return"boolean";case "set":case "include":return a;default:if(-1!=" abstract boolean break byte case catch char class const continue debugger default delete do double else enum export extends final finally float for function goto if implements import in instanceof int interface let long native new package private protected public return short static super switch synchronized this throw throws transient try typeof var void volatile while with yield ".indexOf(" "+
a+" ")||"null"==a)throw Error("Reserved: "+a+" "+F(this.source,this.index));return"realId"}}],[/"(?:[^"\\]|\\[\s\S])*"|'(?:[^'\\]|\\[\s\S])*'/,function(a){return"string"}],[/\d+(?:\.\d+)?(?:e-?\d+)?/,function(a){return"number"}],[function(a){a.sort().reverse();for(var f=0;f<a.length;++f)a[f]=a[f].replace(/[()*+?.[\]|]/g,"\\$&");return RegExp(a.join("|"))}("! % && ( ) * + - . / < <= = > >= [ ] || === !== == != ,".split(" ")),function(a){return/[*/%]/.test(a)?"mul":/[<>]/.test(a)?"rel":/[!=]=/.test(a)?
"eq":a}]];return J({"":[[/(?:(?!{{)[\s\S])+/,function(a){return"text"}],[/{{{/,function(a){this.pushState(a);return a}],[/{{(?:\/if|else|\/each|\/forin|\/raw)}}/,function(a){return a}],[/{{#raw}}/,function(a){this.pushState("raw");return a}],[/{{(?:#(?:if|each|forin)(?=\s))?/,function(a){this.pushState("{{");return a}]],raw:[[/(?:(?!{{\/raw}})[\s\S])+/,function(a){this.popState();return"rawtext"}]],"{{":a.concat([[/}}/,function(a){this.popState();return a}]]),"{{{":a.concat([[/}}}/,function(a){this.popState();
return a}]])})}(),L=function(){return function(a){function g(b,a){return h[b][a]}for(var f=a.nStart,e=a.tSymbols,d={},b=0;b<e.length;++b)d[e[b]]=b;var h=a.tAction,s=a.tGoto,c=a.tRules,l=a.tFuncs,m=a.actionIndex;m&&(g=function(b,a){var c=h[m[b]];return c[a]||c._});return function(b,a){function h(a){throw Error("Syntax error: "+b.getPos(m.index)+(a?"\n"+a:""));}var k=0,q=[0],m=b.scan(),u=[],t={get:function(b){return u[u.length+b]},set:function(b,a){u[u.length+b]=a}};if(a)for(var n in a)t[n]=a[n];for(;;)if(n=
g(k,d[m.tag]))if(0<n)q.push(k=n),u.push(m),m=b.scan();else if(0>n&&-32768<n){n=-n;var k=c[n],v=k.length-1;q.length-=v;k=s[q[q.length-1]][k[0]-f];q.push(k);l[n]?(n=l[n].apply(t,u.splice(u.length-v,v)),u.push(n)):1!=v&&u.splice(u.length-v,v,null)}else return m.tag!=e[0]&&h(),u[0];else{n=[];for(v=0;v<f;++v)g(k,v)&&n.push(e[v]);h("find "+m.tag+"\nexpect "+n.join(" "))}}}({nStart:37,tSymbols:"$ ! && ( ) + , - . = [ ] boolean eq include mul number rawtext realId rel set string text {{ {{#each {{#forin {{#if {{#raw}} {{/each}} {{/forin}} {{/if}} {{/raw}} {{else}} {{{ || }} }}} AdditiveExpression EqualityExpression LogicalAndExpression LogicalOrExpression MemberExpression MultiplicativeExpression PrimaryExpression RelationalExpression UnaryExpression _text args epsilon expr id name program statement statements texts".split(" "),
tAction:[{_:-2},{_:-32768},{22:3,23:4,24:5,25:6,26:7,27:8,33:9,_:-1},{_:-19},{1:13,3:14,7:15,12:16,14:17,16:18,18:19,20:20,21:21,_:0},{1:13,3:14,7:15,12:16,14:33,16:18,18:19,20:34,21:21,_:0},{17:38,_:0},{_:-17},{_:-3},{22:3,27:8,_:-13},{_:-26},{21:44,_:-23},{_:-25},{_:-21},{14:33,18:19,20:34,_:-22},{_:-24},{5:46,7:47,_:-44},{13:48,_:-48},{2:49,_:-50},{34:50,_:-52},{3:51,8:52,10:53,_:-36},{15:54,_:-41},{_:-29},{19:55,_:-46},{_:-39},{35:56,_:0},{_:-27},{_:-23},{_:-22},{14:33,18:19,20:34,21:57,_:0},
{35:61,_:0},{31:62,_:0},{36:63,_:0},{_:-18},{_:-37},{4:64,_:0},{_:-38},{35:65,_:0},{9:66,_:0},{1:13,3:14,7:15,12:16,14:33,16:18,18:19,20:34,21:21,_:-53},{14:33,18:19,20:34,_:0},{_:-11},{_:-15},{_:-16},{14:33,18:19,20:34,21:57,_:-53},{_:-20},{_:-12},{_:-28},{_:-14},{15:54,_:-42},{15:54,_:-43},{19:55,_:-47},{13:48,_:-49},{2:49,_:-51},{4:85,6:86,_:0},{4:87,_:0},{_:-34},{_:-30},{11:88,_:0},{_:-40},{5:46,7:47,_:-45},{35:89,_:0},{35:90,_:0},{35:91,_:0},{35:92,_:0},{22:3,23:4,24:5,25:6,26:7,27:8,30:93,32:94,
33:9,_:0},{35:95,_:0},{_:-33},{_:-32},{_:-31},{_:-4},{_:-10},{_:-35},{22:3,23:4,24:5,25:6,26:7,27:8,28:102,33:9,_:0},{22:3,23:4,24:5,25:6,26:7,27:8,28:103,33:9,_:0},{22:3,23:4,24:5,25:6,26:7,27:8,29:104,33:9,_:0},{22:3,23:4,24:5,25:6,26:7,27:8,29:105,33:9,_:0},{22:3,23:4,24:5,25:6,26:7,27:8,30:106,33:9,_:0},{_:-6},{_:-7},{_:-8},{_:-9},{_:-5}],actionIndex:[0,1,2,3,4,5,5,5,6,5,7,8,9,5,5,5,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,29,30,31,32,33,34,35,36,37,38,5,5,5,5,5,39,40,5,5,5,
41,42,43,44,44,0,45,46,47,48,5,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,5,68,69,0,0,0,0,70,0,71,72,73,74,75,76,77,78,79,80,81,82],tGoto:[{15:1,17:2},,{9:10,16:11,18:12},,{0:22,1:23,2:24,3:25,4:26,5:27,6:28,7:29,8:30,12:31,13:32},{0:22,1:23,2:24,3:25,4:26,5:27,6:28,7:29,8:30,12:35,13:32},{0:22,1:23,2:24,3:25,4:26,5:27,6:28,7:29,8:30,12:36,13:32},{0:22,1:23,2:24,3:25,4:26,5:27,6:28,7:29,8:30,12:37,13:32},,{0:22,1:23,2:24,3:25,4:26,5:27,6:28,7:29,8:30,12:39,13:32},,,{9:40},{4:26,6:28,
8:41,13:32},{0:22,1:23,2:24,3:25,4:26,5:27,6:28,7:29,8:30,12:42,13:32},{4:26,6:28,8:43,13:32},,,,,{13:45},,,,,,,,,,,,,,,{13:58,14:59},{13:58,14:60},,,,,,,,,,{4:26,5:67,6:28,8:30,13:32},{4:26,5:68,6:28,8:30,13:32},{0:22,4:26,5:27,6:28,7:69,8:30,13:32},{0:22,1:70,4:26,5:27,6:28,7:29,8:30,13:32},{0:22,1:23,2:71,4:26,5:27,6:28,7:29,8:30,13:32},{0:22,1:23,2:24,3:25,4:26,5:27,6:28,7:29,8:30,10:72,11:73,12:74,13:32},{13:75},{0:22,1:23,2:24,3:25,4:26,5:27,6:28,7:29,8:30,12:76,13:32},{4:26,6:28,8:77,13:32},
{0:78,4:26,5:27,6:28,8:30,13:32},,,,{11:79,13:58,14:80},{11:81,13:58,14:82},{17:83},,,,,{0:22,1:23,2:24,3:25,4:26,5:27,6:28,7:29,8:30,12:84,13:32},,,,,,,,,,,,,,,,,{9:10,16:11,18:12},,,{0:22,1:23,2:24,3:25,4:26,5:27,6:28,7:29,8:30,12:96,13:32},,,{17:97},{17:98},{17:99},{17:100},,{17:101},,,{9:10,16:11,18:12},{9:10,16:11,18:12},{9:10,16:11,18:12},{9:10,16:11,18:12},{9:10,16:11,18:12}],tRules:[[56,52],[52,54],[54],[54,54,53],[53,26,49,35,54,30],[53,26,49,35,54,32,54,30],[53,24,49,51,48,35,54,28],[53,
24,49,51,51,35,54,28],[53,25,49,51,48,35,54,29],[53,25,49,51,51,35,54,29],[53,23,20,50,9,49,35],[53,23,49,35],[53,33,49,36],[53,55],[53,23,14,21,35],[51,21],[51,50],[55,46],[55,55,46],[46,22],[46,27,17,31],[50,18],[50,20],[50,14],[43,21],[43,16],[43,12],[43,50],[43,3,49,4],[41,43],[41,41,8,50],[41,41,10,49,11],[41,41,3,48,4],[41,41,3,47,4],[47,49],[47,47,6,49],[45,41],[45,1,45],[45,7,45],[42,45],[42,42,15,45],[37,42],[37,37,5,42],[37,37,7,42],[44,37],[44,44,19,37],[38,44],[38,38,13,44],[39,38],[39,
39,2,38],[40,39],[40,40,34,39],[49,40],[48]],tFuncs:function(){function a(b,a,d,c,e,f,g){return["each",a,f,c,d,!0]}function g(b,a,d,c,e,f,g){return["each",a,f,c,d,!1]}function f(b){return b.text}function e(b,a,d,c){return["()",b,d]}function d(b,a,d){return[a.text,b,d]}return[,function(b){return["prog",b]},function(){return[]},function(b,a){b.push(a);return b},function(b,a,d,c,e){return["if",a,c]},function(b,a,d,c,e,f,g){return["if",a,c,f]},a,a,g,g,function(b,a,d,c,e,f){return["set",d.text,e]},function(b,
a,d){return["eval",a,!1]},function(b,a,d){return["eval",a,!0]},function(a){return["text",a]},function(a,d,e,c){return["inc",G(e.text)]},function(a){return G(a.text)},f,function(a){return a},function(a,d){return a+d},f,function(a,d,e){return d.text},,,,function(a){return["lit",G(a.text)]},function(a){return["lit",+a.text]},function(a){return["lit","true"==a.text]},function(a){return["id",a.text]},function(a,d,e){return d},,function(a,d,e){return[".",a,e.text]},function(a,d,e,c){return["[]",a,e]},e,
e,function(a){return[a]},function(a,d,e){a.push(e);return a},,function(a,d){return["!",d]},function(a,d){return["u-",d]},,d,,d,d,,d,,d,,d,,d]}()})}();return{parse:E,compile:I,render:function(a,g){return I(a)(g)},compileToPhp:function(a){return N(E(a),!0)},compileToVM:function(a,g){return O(E(a))},version:"1.3.1"}}();"object"==typeof module&&module&&"object"==typeof module.exports?module.exports=A:"function"==typeof define&&(define.amd||define.cmd)?define(function(){return A}):"undefined"!=typeof KISSY&&
KISSY.add(function(){return A});C&&(C.Crox=A)})(this);
