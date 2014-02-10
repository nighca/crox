# !/bin/sh

sh cleanup.sh
clear

echo ''
echo ' ---------------------------------- VM ---------------------------------- '
echo ''
node ../../bin/crox.js -p -t vm --silent
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
node ../../bin/crox.js -p -t php --silent

php index.php



echo ''
echo ' ---------------------------------- JS-KISSY ---------------------------------- '
echo ''
node ../../bin/crox.js -p --kissy --silent

node index.js


echo ''
echo ''
echo ' ---------------------------------- JS-KISSY-FN ---------------------------------- '
echo ''
node ../../bin/crox.js -p --kissyfn --silent

node index.js


echo ''
echo ''
echo ' ---------------------------------- CommonJS ---------------------------------- '
echo ''
node ../../bin/crox.js -p --nodejs --silent

node index-nodejs.js

echo ''
echo ''
echo ' ---------------------------------- CMD ---------------------------------- '
echo ''
node ../../bin/crox.js -p --cmd --silent

node index-cmd.js


echo ''
echo ''
echo ' ---------------------------------- AMD ---------------------------------- '
echo ''
node ../../bin/crox.js -p --amd --silent

node index-amd.js
# 1. ../b.xxx的引用方式不一样
# 2. 对于空格、回车的处理有区别








