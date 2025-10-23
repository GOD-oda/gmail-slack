# gmail-slack

## Setup
required

- clasp 
- node >= 23.11.0

```shell
$ npm i @google/clasp -g
```

```shell
$ clasp login
```

```shell
$ clasp clone <your_script_id>
```

and remove app.js, appsscript.json

and rewrite rootDir to dist 

# Add a new SLACK channel

If you want to notify to a new SLACK channel, please follow the steps below.

1. Add channel id to gas environment value.
2. Add notify bot to a new channel for integration.

## Deploy

```shell
$ make deploy
```

or

```shell
$ npm install
$ npm run build
$ clasp push
```

## URL

https://script.google.com/
