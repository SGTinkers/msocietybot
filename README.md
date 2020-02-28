# Awesome Project Build with TypeORM

Steps to run this project:

1. Run `npm i` command
2. Setup database settings inside `ormconfig.json` file
3. Run `npm start` command

With Docker:

```
# First time only:
docker-compose run database # Shut down after database has been set up
docker-compose run app npm run migrate

# Every other time:
docker-compose up
```

# Telegraf
We are working on integrating [Telegraf](https://github.com/influxdata/telegraf)
