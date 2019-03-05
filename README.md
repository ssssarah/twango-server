# Twango

Base code from https://github.com/andregardi/jwt-express-typeorm

Preprend any typeorm command with "npm run" (CF last line of scripts in package.json), for example: 

> npm run typeorm schema:sync

> npm run typeorm migration:run

> typeorm migration:create -n <migration_name> 

List of all doc pages
https://github.com/typeorm/typeorm/tree/master/docs
https://github.com/typeorm/typeorm/blob/master/docs/using-cli.md


API endpoints:

Register

Log in 

Change password

Create superorder

Delete superorder

Add order to superorder

Delete order from superorder

Change status of order

Get all superorders within reach of location

Get all superorders withing reach with tags/search terms


//SUPERORDER

Get one
GET v1/superOrder/:id

searching:
GET v1/superOrders/search?terms=""&sort=""


