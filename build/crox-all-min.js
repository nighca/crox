/*
 Crox v1.2.0
 https://github.com/thx/crox

 Released under the MIT license
 md5: 89e5af74562f9ef3d52ba371ccd62bee
*/
(function(B){var y=function(){function y(b,a){this.row=b;this.col=a}function E(b,a){var f=b.substring(0,a),d=f.match(/\r\n?|\n/g),g=1;d&&(g+=d.length);f=1+/[^\r\n]*$/.exec(f)[0].length;return new y(g,f)}function B(b){return'"'+b.replace(/[\x00-\x1f"\\\u2028\u2029]/g,function(a){switch(a){case '"':return'\\"';case "\\":return"\\\\";case "\b":return"\\b";case "\f":return"\\f";case "\n":return"\\n";case "\r":return"\\r";case "\t":return"\\t"}return"\\u"+("000"+a.charCodeAt(0).toString(16)).slice(-4)})+
'"'}function I(b){function a(a,z,d,b){this.tag=a;this.text=z;this.index=d;this.subMatches=b}function f(){}function d(a){for(var z=1,d=[],b=[1],e=[],c=0;c<a.length;++c)b.push(z+=RegExp("|"+a[c][0].source).exec("").length),e.push(a[c][1]||f),d.push("("+a[c][0].source+")");return[RegExp(d.join("|")+"|","g"),b,e]}a.prototype.toString=function(){return this.text};var g=b.$||"$",c={},e;for(e in b)"$"!=e.charAt(0)&&(c[e]=d(b[e]));return function(d){var z=d.length,b=0,e=[""],f={text:"",index:0,source:d,pushState:function(a){e.push(a)},
popState:function(){e.pop()},retract:function(a){b-=a}};return{scan:function(){do{var q;a:{var r=c[e[e.length-1]],l=r[0];l.lastIndex=b;q=l.exec(d);if(""==q[0]){if(b<z)throw Error("lexer error: "+E(d,b)+"\n"+d.slice(b,b+50));q=new a(g,"",b)}else{f.index=b;b=l.lastIndex;for(var l=r[1],n=0;n<l.length;++n)if(q[l[n]]){r=r[2][n].apply(f,q.slice(l[n],l[n+1]));q=new a(r,q[0],f.index,q.slice(l[n]+1,l[n+1]));break a}q=void 0}}}while(null==q.tag);return q},getPos:function(a){return E(d,a)},reset:function(){b=
0;e=[""]}}}}function p(b){var a;a:{switch(b){case "id":case "lit":a=!0;break a}a=!1}return a||"."==b||"[]"==b}function k(b){return p(b)||"!"==b||"u-"==b}function v(b){if(k(b))return!0;switch(b){case "*":case "/":case "%":return!0}return!1}function w(b){if(v(b))return!0;switch(b){case "+":case "-":return!0}return!1}function x(b){if(w(b))return!0;switch(b){case "<":case ">":case "<=":case ">=":return!0}return!1}function A(b){if(x(b))return!0;switch(b){case "eq":case "ne":return!0}return!1}function C(b){return A(b)||
"&&"==b}function F(b){return C(b)||"||"==b}function G(b){function a(a){e+=c+a+"\n"}function f(b){for(var d=0;d<b.length;++d){var e=b[d];switch(e[0]){case "if":a("if("+g(e[1])+"){");c+="\t";f(e[2]);c=c.slice(0,-1);a("}");e[3]&&(a("else{"),c+="\t",f(e[3]),c=c.slice(0,-1),a("}"));break;case "each":var h=e[3]||"$i";a("var $list = "+g(e[1])+";");a("for(var "+h+" in $list) {");c+="\t";a("var "+e[4]+" = $list["+h+"];");f(e[2]);c=c.slice(0,-1);a("}");break;case "set":a("var "+e[1]+"="+g(e[2])+";");break;
case "eval":h=g(e[1]);e[2]&&(h="$htmlEncode("+h+")");a("$print("+h+");");break;case "text":a("$print("+B(e[1])+");");break;case "inc":break;default:throw Error("unknown stmt: "+e[0]);}}}function d(a,e){var d=g(a);e&&!e(a[0])&&(d="("+d+")");return d}function g(a){switch(a[0]){case "id":return a[1];case "lit":return"string"==typeof a[1]?B(a[1]):String(a[1]);case ".":return d(a[1],p)+"."+a[2];case "[]":return d(a[1],p)+"["+g(a[2])+"]";case "!":return"!"+d(a[1],k);case "u-":return"- "+d(a[1],k);case "*":case "/":case "%":return d(a[1],
v)+a[0]+d(a[2],k);case "+":case "-":return d(a[1],w)+a[0]+" "+d(a[2],v);case "<":case ">":case "<=":case ">=":return d(a[1],x)+a[0]+d(a[2],w);case "eq":case "ne":return d(a[1],A)+("eq"==a[0]?"===":"!==")+d(a[2],x);case "&&":return d(a[1],C)+"&&"+d(a[2],A);case "||":return d(a[1],F)+"||"+d(a[2],C);default:throw Error("unknown expr: "+a[0]);}}var c="\t",e="";f(b[1]);return e}function D(b){return J(K(b))}function H(b){b=D(b);b=G(b);var a;a="var obj = { '<': '&lt;', '>': '&gt;', '&': '&amp;', '\"': '&quot;' };\n\tfunction $htmlEncode(s) {\n\t\treturn String(s).replace(/[<>&\"]/g, function(c) {\n\t\t\treturn obj[c];\n\t\t});\n\t}var $s = '';function $print(s){ $s += s; }";
a+=b;a+="return $s;";return Function("root",a)}function L(b){function a(){e=e.substr(0,e.length-2)}function f(a){s+=e+a+"\n"}function d(b){for(var g=0;g<b.length;++g){var h=b[g];switch(h[0]){case "if":f("if("+c(h[1])+"){");e+="  ";d(h[2]);a();f("}");h[3]&&(f("else{"),e+="  ",d(h[3]),a(),f("}"));break;case "each":var s=h[3]?"$i_"+h[3]+"=>":"";f("foreach("+c(h[1])+" as "+s+"$i_"+h[4]+")");f("{");e+="  ";d(h[2]);a();f("}");break;case "set":f("$i_"+h[1]+" = "+c(h[2])+";");break;case "eval":s="ToString("+
c(h[1])+")";h[2]&&(s="htmlspecialchars("+s+", ENT_COMPAT, 'GB2312')");f("$t_r .= "+s+";");break;case "text":f("$t_r .= "+("'"+String(h[1]).replace(/['\\]/g,"\\$&")+"'")+";");break;case "inc":break;default:throw Error("unknown stmt: "+h[0]);}}}function g(a,e){var d=c(a);e&&!e(a[0])&&(d="("+d+")");return d}function c(a){switch(a[0]){case "id":return"$i_"+a[1];case "lit":return"string"==typeof a[1]?"'"+String(a[1]).replace(/['\\]/g,"\\$&")+"'":String(a[1]);case ".":return g(a[1],p)+"->"+a[2];case "[]":return g(a[1],
p)+"["+c(a[2])+"]";case "!":return"!ToBoolean("+g(a[1],k)+")";case "u-":return"- "+g(a[1],k);case "*":case "/":case "%":return g(a[1],v)+a[0]+g(a[2],k);case "+":return"plus("+g(a[1],null)+", "+g(a[2],null)+")";case "-":return g(a[1],w)+"- "+g(a[2],v);case "<":case ">":case "<=":case ">=":return g(a[1],x)+a[0]+g(a[2],w);case "eq":case "ne":var e="eq"==a[0]?"===":"!==";return g(a[1],A)+e+g(a[2],x);case "&&":return"logical_and("+g(a[1],null)+", "+g(a[2],null)+")";case "||":return"logical_or("+g(a[1],
null)+", "+g(a[2],null)+")";default:throw Error("unknown expr: "+a[0]);}}var e="",s="$t_r = '';\n";d(b[1]);return s}function M(b,a){function f(a){for(var d=0;d<a.length;++d){var b=a[d];switch(b[0]){case "if":var k="#if("+g(b[1])+")";c+=k;f(b[2]);b[3]&&(c+="#{else}",f(b[3]));c+="#{end}";break;case "each":var k=b[3]?"$_"+b[3]:"$k",h="#set ($list = "+g(b[1])+")";c+=h;c+="#foreach($_"+b[4]+" in $list)";b[3]&&(c+="#set("+k+" = $velocityCount - 1)");f(b[2]);c+="#{end}";break;case "set":b="#set ($_"+b[1]+
"="+g(b[2])+")";c+=b;break;case "eval":b=g(b[1]);c=/^\$([\w-]+)$/.test(b)?c+("${"+RegExp.$1+"}"):c+("#set($t = "+b+")$!{t}");break;case "text":b=b[1].replace(/\$/g,"$${dollar}").replace(/#/g,"$${sharp}");c+=b;break;case "inc":b="#parse('"+b[1].replace(/\.\w+$/,".vm")+"')";c+=b;break;default:throw Error("unknown stmt: "+b[0]);}}}function d(a,b){var d=g(a);b&&!b(a[0])&&(d="("+d+")");return d}function g(a){switch(a[0]){case "id":return"$_"+a[1];case "lit":return"string"==typeof a[1]?(a=a[1],a=-1==a.indexOf("'")?
"'"+a+"'":"('"+a.split("'").join("'+\"'\"+'")+"')",a):String(a[1]);case ".":return d(a[1],p)+"."+a[2];case "[]":return d(a[1],p)+"["+g(a[2])+"]";case "!":return"!"+d(a[1],k);case "u-":if("u-"==a[1][0])throw Error("\u7981\u6b62\u4e24\u4e2a\u8d1f\u53f7\u8fde\u7528");return"-"+d(a[1],k);case "*":case "/":case "%":return d(a[1],v)+a[0]+d(a[2],k);case "+":case "-":return d(a[1],w)+a[0]+" "+d(a[2],v);case "<":case ">":case "<=":case ">=":return d(a[1],x)+a[0]+d(a[2],w);case "eq":case "ne":return d(a[1],
A)+("eq"==a[0]?"==":"!=")+d(a[2],x);case "&&":return d(a[1],C)+"&&"+d(a[2],A);case "||":return d(a[1],F)+"||"+d(a[2],C);default:throw Error("unknown expr: "+a[0]);}}a||(a="\r\n");var c="#set($dollar='$')#set($sharp='#')";f(b[1]);return c}y.prototype.toString=function(){return"("+this.row+","+this.col+")"};var K=function(){var b=[[/\s+/,function(){return null}],[/[A-Za-z_]\w*/,function(a){switch(a){case "true":case "false":return"boolean";case "set":case "include":return a;default:if(-1!=" abstract boolean break byte case catch char class const continue debugger default delete do double else enum export extends final finally float for function goto if implements import in instanceof int interface let long native new package private protected public return short static super switch synchronized this throw throws transient try typeof var void volatile while with yield ".indexOf(" "+
a+" ")||"null"==a)throw Error("Reserved: "+a+" "+E(this.source,this.index));return"realId"}}],[/"(?:[^"\\]|\\[\s\S])*"|'(?:[^'\\]|\\[\s\S])*'/,function(a){return"string"}],[/\d+(?:\.\d+)?(?:e-?\d+)?/,function(a){return"number"}],[function(a){a.sort().reverse();for(var b=0;b<a.length;++b)a[b]=a[b].replace(/[()*+?.[\]|]/g,"\\$&");return RegExp(a.join("|"))}("! % && ( ) * + - . / < <= = > >= [ ] || === !==".split(" ")),function(a){switch(a){case "===":return"eq";case "!==":return"ne";default:return a}}]];
return I({"":[[/(?:(?!{{)[\s\S])+/,function(a){return"{{"==a.substring(0,2)?(this.pushState(a),a):"text"}],[/{{{/,function(a){this.pushState(a);return a}],[/{{(?:\/if|else|\/each)}}/,function(a){return a}],[/{{(?:#(?:if|each)(?=\s))?/,function(a){this.pushState("{{");return a}]],"{{":b.concat([[/}}/,function(a){this.popState();return a}]]),"{{{":b.concat([[/}}}/,function(a){this.popState();return a}]])})}(),J=function(){return function(b){function a(a,b){return c[a][b]}var f=b.nStart,d=b.tSymbols,
g=b.tSymbolIndex,c=b.tAction,e=b.tGoto,s=b.tRules,k=b.tFuncs,p=b.actionIndex;p&&(a=function(a,b){var d=c[p[a]];return d[b]||d._});return function(b,c){function q(a){throw Error("Syntax error: "+b.getPos(n.index)+(a?"\n"+a:""));}var r=0,l=[0],n=b.scan(),t=[],p={get:function(a){return t[t.length+a]},set:function(a,b){t[t.length+a]=b}};if(c)for(var m in c)p[m]=c[m];for(;;)if(m=a(r,g[n.tag]))if(0<m)l.push(r=m),t.push(n),n=b.scan();else if(0>m&&-32768<m){m=-m;var r=s[m],u=r.length-1;l.length-=u;r=e[l[l.length-
1]][r[0]-f];l.push(r);k[m]?(m=k[m].apply(p,t.splice(t.length-u,u)),t.push(m)):1!=u&&t.splice(t.length-u,u,null)}else return n.tag!=d[0]&&q(),t[0];else{m=[];for(u=0;u<f;++u)a(r,u)&&m.push(d[u]);q("find "+n.tag+"\nexpect "+m.join(" "))}}}({nStart:37,tSymbols:"$ ! % && ( ) * + - . / < <= = > >= [ ] boolean eq include ne number realId set string text {{ {{#each {{#if {{/each}} {{/if}} {{else}} {{{ || }} }}} AdditiveExpression EqualityExpression LogicalAndExpression LogicalOrExpression MemberExpression MultiplicativeExpression PrimaryExpression RelationalExpression UnaryExpression epsilon expr id program statement statements".split(" "),
tSymbolIndex:{$:0,"!":1,"%":2,"&&":3,"(":4,")":5,"*":6,"+":7,"-":8,".":9,"/":10,"<":11,"<=":12,"=":13,">":14,">=":15,"[":16,"]":17,"boolean":18,eq:19,include:20,ne:21,number:22,realId:23,set:24,string:25,text:26,"{{":27,"{{#each":28,"{{#if":29,"{{/each}}":30,"{{/if}}":31,"{{else}}":32,"{{{":33,"||":34,"}}":35,"}}}":36,AdditiveExpression:37,EqualityExpression:38,LogicalAndExpression:39,LogicalOrExpression:40,MemberExpression:41,MultiplicativeExpression:42,PrimaryExpression:43,RelationalExpression:44,
UnaryExpression:45,epsilon:46,expr:47,id:48,program:49,statement:50,statements:51},tAction:[{_:-2},{_:-32768},{26:3,27:4,28:5,29:6,33:7,_:-1},{_:-11},{1:9,4:10,8:11,18:12,20:13,22:14,23:15,24:16,25:17,_:0},{1:9,4:10,8:11,18:12,20:29,22:14,23:15,24:30,25:17,_:0},{_:-3},{_:-18},{25:37,_:-15},{_:-17},{_:-13},{20:29,23:15,24:30,_:-14},{_:-16},{7:39,8:40,_:-34},{19:41,21:42,_:-42},{3:43,_:-44},{34:44,_:-46},{9:45,16:46,_:-24},{2:47,6:48,10:49,_:-31},{_:-21},{11:50,12:51,14:52,15:53,_:-39},{_:-27},{35:54,
_:0},{_:-19},{_:-15},{_:-14},{25:55,_:0},{35:56,_:0},{36:57,_:0},{_:-25},{5:58,_:0},{_:-26},{35:59,_:0},{13:60,_:0},{20:29,23:15,24:30,_:0},{_:-9},{25:76,_:-47},{_:-10},{_:-20},{_:-12},{2:47,6:48,10:49,_:-32},{2:47,6:48,10:49,_:-33},{11:50,12:51,14:52,15:53,_:-40},{11:50,12:51,14:52,15:53,_:-41},{19:41,21:42,_:-43},{3:43,_:-45},{_:-22},{17:80,_:0},{_:-30},{_:-28},{_:-29},{7:39,8:40,_:-35},{7:39,8:40,_:-37},{7:39,8:40,_:-36},{7:39,8:40,_:-38},{35:81,_:0},{35:82,_:0},{26:3,27:4,28:5,29:6,31:83,32:84,
33:7,_:0},{35:85,_:0},{_:-23},{_:-4},{_:-8},{26:3,27:4,28:5,29:6,30:89,33:7,_:0},{26:3,27:4,28:5,29:6,30:90,33:7,_:0},{26:3,27:4,28:5,29:6,31:91,33:7,_:0},{_:-7},{_:-6},{_:-5}],actionIndex:[0,1,2,3,4,5,5,5,6,5,5,5,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,5,5,5,5,5,5,34,5,5,5,5,5,5,5,5,35,36,0,37,38,39,5,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,0,0,60,0,61,62,63,64,65,66,67],tGoto:[{12:1,14:2},,{13:8},,{0:18,1:19,2:20,3:21,4:22,5:23,6:24,7:25,
8:26,10:27,11:28},{0:18,1:19,2:20,3:21,4:22,5:23,6:24,7:25,8:26,10:31,11:28},{0:18,1:19,2:20,3:21,4:22,5:23,6:24,7:25,8:26,10:32,11:28},{0:18,1:19,2:20,3:21,4:22,5:23,6:24,7:25,8:26,10:33,11:28},,{4:22,6:24,8:34,11:28},{0:18,1:19,2:20,3:21,4:22,5:23,6:24,7:25,8:26,10:35,11:28},{4:22,6:24,8:36,11:28},,,,,{11:38},,,,,,,,,,,,,,,,,,,,,,,{4:22,5:61,6:24,8:26,11:28},{4:22,5:62,6:24,8:26,11:28},{0:18,4:22,5:23,6:24,7:63,8:26,11:28},{0:18,4:22,5:23,6:24,7:64,8:26,11:28},{0:18,1:65,4:22,5:23,6:24,7:25,8:26,
11:28},{0:18,1:19,2:66,4:22,5:23,6:24,7:25,8:26,11:28},{11:67},{0:18,1:19,2:20,3:21,4:22,5:23,6:24,7:25,8:26,10:68,11:28},{4:22,6:24,8:69,11:28},{4:22,6:24,8:70,11:28},{4:22,6:24,8:71,11:28},{0:72,4:22,5:23,6:24,8:26,11:28},{0:73,4:22,5:23,6:24,8:26,11:28},{0:74,4:22,5:23,6:24,8:26,11:28},{0:75,4:22,5:23,6:24,8:26,11:28},,{9:77},{14:78},,,,{0:18,1:19,2:20,3:21,4:22,5:23,6:24,7:25,8:26,10:79,11:28},,,,,,,,,,,,,,,,,,{13:8},,,{14:86},{14:87},,{14:88},,{13:8},{13:8},{13:8}],tRules:[[52,49],[49,51],[51],
[51,51,50],[50,29,47,35,51,31],[50,29,47,35,51,32,51,31],[50,28,47,25,46,35,51,30],[50,28,47,25,25,35,51,30],[50,27,24,48,13,47,35],[50,27,47,35],[50,33,47,36],[50,26],[50,27,20,25,35],[48,23],[48,24],[48,20],[43,25],[43,22],[43,18],[43,48],[43,4,47,5],[41,43],[41,41,9,48],[41,41,16,47,17],[45,41],[45,1,45],[45,8,45],[42,45],[42,42,6,45],[42,42,10,45],[42,42,2,45],[37,42],[37,37,7,42],[37,37,8,42],[44,37],[44,44,11,37],[44,44,14,37],[44,44,12,37],[44,44,15,37],[38,44],[38,38,19,44],[38,38,21,44],
[39,38],[39,39,3,38],[40,39],[40,40,34,39],[47,40],[46]],tFuncs:function(){function b(a,b,c,e,f,k,p){return["each",b,k,e&&eval(e.text),eval(c.text)]}function a(a){return["lit",eval(a.text)]}function f(a,b,c){return[b.text,a,c]}return[,function(a){return["prog",a]},function(){return[]},function(a,b){a.push(b);return a},function(a,b,c,e,f){return["if",b,e]},function(a,b,c,e,f,k,p){return["if",b,e,k]},b,b,function(a,b,c,e,f,k){return["set",c.text,f]},function(a,b,c){return["eval",b,!0]},function(a,b,
c){return["eval",b,!1]},function(a){return["text",a.text]},function(a,b,c,e){return["inc",eval(c.text)]},,,,a,a,function(a){return["lit","true"==a.text]},function(a){return["id",a.text]},function(a,b,c){return b},,function(a,b,c){return[".",a,c.text]},function(a,b,c,e){return["[]",a,c]},,function(a,b){return["!",b]},function(a,b){return["u-",b]},,f,f,f,,f,f,,f,f,f,f,,function(a,b,c){return["eq",a,c]},function(a,b,c){return["ne",a,c]},,f,,f]}()})}();return{parse:D,compile:H,compileToJs:function(b){return G(D(b))},
render:function(b,a){return H(b)(a)},compileToPhp:function(b){b=L(D(b));var a;a="function temp($i_root) {\nfunction isNumber($a) { return is_float($a) || is_int($a); }\nfunction plus($a, $b) {if (isNumber($a) && isNumber($b)) {\treturn $a + $b;}else {\treturn ToString($a) . ToString($b);}}\n";a+="function logical_and($a, $b) { return $a ? $b : $a; }\n";a+="function logical_or($a, $b) { return $a ? $a : $b; }\n";a+="function ToString($a) {\n\tif (is_string($a)) return $a;\n\tif (isNumber($a)) return (string)$a;\n\tif (is_bool($a)) return $a ? 'true' : 'false';\n\tif (is_null($a)) return 'null';\n\tif (is_array($a)) {\n\t\t$s = '';\n\t\tfor ($i = 0; $i < count($a); ++$i) {\n\t\t\tif ($i > 0) $s .= ',';\n\t\t\tif (!is_null($a[$i]))\n\t\t\t\t$s .= ToString($a[$i]);\n\t\t}\n\t\treturn $s;\n\t}\n\treturn '[object Object]';\n}\n";
a+="function ToBoolean($a) {\n\tif (is_string($a)) return strlen($a) > 0;\n\tif (is_array($a) || is_object($a)) return true;\n\treturn (bool)$a;\n}\n";a+=b;return a+="return $t_r;\n}"},compileToVM:function(b,a){return M(D(b))},version:"1.2.0"}}();"object"==typeof module&&module&&"object"==typeof module.exports?module.exports=y:"function"==typeof define&&(define.amd||define.cmd)?define(function(){return y}):"undefined"!=typeof KISSY&&KISSY.add("crox",function(){return y});B&&(B.Crox=y)})(this);
