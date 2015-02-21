#!/bin/bash

function invoke() {
    echo $1
    eval $1
}

invoke '[ -f ./tmp/unicorn.pid ] && kill -QUIT $(< ./tmp/unicorn.pid)'
invoke 'git pull origin master'
invoke 'npm install'
invoke 'NODE_ENV=production ./node_modules/gulp/bin/gulp.js'
invoke 'bundle install --path vendor/bundle'
invoke 'bundle exec unicorn -c unicorn.rb -E production -D'
