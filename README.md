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
