﷽
# MSOCIETY Bot
![CI](https://github.com/SGTinkers/msocietybot/workflows/CI/badge.svg)

A unified platform to manage MSOCIETY community.

This project is rewritten to Typescript from Go: https://gitlab.com/msociety/msocietybot

## Running

1. Run `npm i` command
2. Copy `env.sample` to `.env`
2. Setup database settings inside `.env` file
3. Run `npm start` command

### Running (with Docker):

```
# First time only:
$ docker-compose run database # Shut down after database has been set up
$ docker-compose run app npm run migrate

# Every other time:
$ docker-compose up
```

### Running tests:
```
$ npm run test
```
