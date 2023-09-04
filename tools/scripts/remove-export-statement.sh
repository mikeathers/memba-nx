#!/bin/bash
unameOut="$(uname -s)"
if [[ "$unameOut" == *"Darwin"* ]]; then
    sed -i'' -e '$d' $1
else
    sed -i '$d' $1
fi