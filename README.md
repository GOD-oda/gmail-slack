# gmail-slack

## Setup
required

- clasp 
- npm >= 8.5.5
- node >= 17.8.0

```shell
$ npm i @google/clasp -g
```

```shell
$ clasp login
```

```shell
$ clasp clone <your_script_id>

and Rewrite rootDir to dist
```

## Deploy

```shell
$ make deploy

or

$ npm install
$ npm run build
$ clasp push
```

