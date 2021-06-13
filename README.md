# Sourcemapper

Just a wip of building a source maps injection tool for getting full source code in production.

I deleted the original work by accident so this is what I had
left. Right now it's not built to do much of anything. Hope the idea is
helpful though!

## Assumptions
- the servers for the prod web page host source map files via a private api
- the servers aren't publicly accessible but are privately via an internal network

## Goals
- this has no impact to normal prod pages
- it's only usable by internal employees
- fairly easy to set up the mappings (takes a minute or two)

## Future options

It's probably best to build a simple version first that just maps
specific asset files. Later on there could be better functionality like
partial matching with a regex.
