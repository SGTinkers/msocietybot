﷽
# MSOCIETY Bot
![CI](https://github.com/SGTinkers/msocietybot/workflows/CI/badge.svg)
![Dependencies](https://david-dm.org/SGTinkers/msocietybot.svg)
[![codecov](https://codecov.io/gh/SGTinkers/msocietybot/branch/master/graph/badge.svg)](https://codecov.io/gh/SGTinkers/msocietybot)
[![Known Vulnerabilities](https://snyk.io/test/github/SGTinkers/msocietybot/badge.svg?targetFile=package.json)](https://snyk.io/test/github/SGTinkers/msocietybot?targetFile=package.json)

A unified platform to manage MSOCIETY community.

This project is rewritten to Typescript from Go: https://gitlab.com/msociety/msocietybot

## Running

1. Run `npm i` command
2. Copy `env.sample` to `.env`
2. Setup database settings inside `.env` file
3. Run `npm start` command

### Running (with Docker)

```
# First time only:
$ docker-compose run database # Shut down after database has been set up

# Every other time:
$ docker-compose up
```

### Running tests
```
$ npm run test
```

### Output Verbose Logging
You can turn on debug (verbose) logging via supplying the env `DEBUG`:
```
$ DEBUG=telegraf:client,msocietybot npm run start
```
