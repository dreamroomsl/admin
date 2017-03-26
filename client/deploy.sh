#!/bin/bash
echo "Deploying application into $1"
rm -rf $1
mkdir -p $1
cp -r ./dist/* $1
echo "Application deployed"
