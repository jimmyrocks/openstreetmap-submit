var connect = require('../src/connect');
var modifyMemberTasks = require('../src/modifyMemberTasks');
var modifyTest = {
  'type': 'FeatureCollection',
  'features': [{
    'type': 'Feature',
    'geometry': {
      'type': 'Polygon',
      'coordinates': [-103.96812194989978,
        36.783764446165364
      ],
      'bbox': [-103.96812194989978,
        36.783764446165364, -103.96812194989978,
        36.783764446165364
      ]
    },
    'osmId': '131465',
    'foreignKey': '{DEC4BC0F-5468-4F09-85A1-74058BF1AB57}',
    'properties': {
      'name': 'Test Building',
      'building': 'yes'
    }
  }, {
    'type': 'Feature',
    'geometry': {
      'type': 'MultiPolygon',
      'coordinates': [-103.96812194989978,
        36.783764446165364
      ],
      'bbox': [-103.96812194989978,
        36.783764446165364, -103.96812194989978,
        36.783764446165364
      ]
    },
    'osmId': '1595',
    'foreignKey': '{GEC4BC0F-5468-4F09-85A1-74058BF1AB57}',
    'properties': {
      'name': 'Test Building',
      'building': 'yes'
    }
  }]
};
var options = {
  'osmIdField': 'osmId'
};
var openstreetmapSource = {
  'name': 'OSM Test Source',
  'connection': {
    'type': 'openstreetmap',
    'address': 'http://10.147.153.193:8000/api/',
    'consumer_key': 'CpIont3biEafgafInTYWkFlooQkcFLtGREu6yMG0',
    'consumer_secret': 'MFgSWe00v8EsddR9KI42uZZX61r2XL8JwEPxHY2p',
    'access_key': 'hxsAv009TnD7ujC7msZdZM1zwS238NJ7v5DwIkAz',
    'access_secret': 'mtJJIQazODMOH0r5EI9kQx9f9H3TtFcfDZ21SJjm'
  }
};

module.exports = [{
  'name': 'osmConnection',
  'description': 'Connect to the OSM Server',
  'task': connect,
  'params': [openstreetmapSource],
  'operator': 'jstype',
  'expected': 'object'
}, {
  'name': 'modifyMemberTasks',
  'task': modifyMemberTasks,
  'params': [modifyTest, 'modify', '{{osmConnection}}', options],
  'operator': 'jstype',
  'expected': 'array'
}];
