# API endpoints:

- Register: DONE
- Log In: DONE
- Create superOrder: DONE
- Get superOrder: DONE (todo filter out isDeleted)
- Delete superOrder: DONE, to TEST
- Create order: DONE, to TEST
- Delete order: DONE, to TEST
- Search superOrders withing reach with tags/search terms: DONE, to TEST (todo filter out isDeleted)
- Get my superOrders: TODO
- Get my orders' superOrders: TODO
- Change status of order: TODO
- Change password: TODO
- Search superOrders within reach of location: TODO, still have to figure out API for coordinates check?

- Define anything related to retrieving user profiles

# Twango

Base code from https://github.com/andregardi/jwt-express-typeorm

Preprend any typeorm command with "npm run" (CF last line of scripts in package.json), for example: 

> npm run typeorm schema:sync

> npm run typeorm migration:run

> typeorm migration:create -n <migration_name> 

List of all doc pages
- https://github.com/typeorm/typeorm/tree/master/docs
- https://github.com/typeorm/typeorm/blob/master/docs/using-cli.md


