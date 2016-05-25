#openstreetmap-submit

#PLEASE **DO NOT** run this on OpenStreetMap

#This was **NOT** created for OpenStreetMap, it is for internal projects only


```js
var Submit = require('openstreetmap-submit');
var submit = new Submit(connectionInformation);
submit(create, modify, remove);
```

###connectionInformation:
```js
  {
    'connection': {
      'address': 'api.openstreetmap.com',
      'consumer_key': 'CONSUMER KEY',
      'consumer_secret': 'CONSUMER SECRET',
    }
  }
```

###create / modify / remove
  * Currently only create works, the rest will come later
  * Accepts a geojson file

I'm thinking that in the future, not only will it require a new connection, but also a new changeset each time
but for now, and just creates, we don't need to do that
