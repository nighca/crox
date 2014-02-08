# !/bin/sh
clear
echo ''
echo ' ---------------------------------- VM ---------------------------------- '
echo ''
node ../../bin/crox.js -p -t vm -s
TPL=index.vm
#echo "Running Example with input file '$TPL'"

_VELCP=.

for i in ./velocity-1.7/lib/*.jar
do
    _VELCP=$_VELCP:"$i"
done

for i in ./velocity-1.7/*.jar
do
    _VELCP=$_VELCP:"$i"
done

javac -cp $_VELCP Runner.java -J-Dfile.encoding=UTF-8
java -cp $_VELCP Runner $TPL



echo ""
echo ''
echo ' ---------------------------------- PHP ---------------------------------- '
echo ''
node ../../bin/crox.js -p -t php -s

php index.php



echo ''
echo ' ---------------------------------- JS-KISSY ---------------------------------- '
echo ''
node ../../bin/crox.js -p -t js --kissy -s

node index.js

rm a.tpl.js
rm b.tpl.js
rm c.tpl.js
rm d/d.tpl.js



echo ''
echo ''
echo ' ---------------------------------- JS-KISSY-FN ---------------------------------- '
echo ''
node ../../bin/crox.js -p -t js --kissyfn -s

node index.js
# 1. ../b.xxx的引用方式不一样
# 2. 对于空格、回车的处理有区别








