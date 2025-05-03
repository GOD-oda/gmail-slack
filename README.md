# gmail-slack

## Setup
required

- clasp 
- npm >= 8.5.5
- node >= 20.2.0

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
