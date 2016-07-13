var connect = require('../src/connect');
var modifyMemberTasks = require('../src/changeset/send/modifyMemberTasks');
var modifyTest = {
  'type': 'FeatureCollection',
  'features': [{
    'type': 'Feature',
    'geometry': {
      'type': 'Polygon',
      'coordinates': [
        [
          [-107.649259636559, 38.5268053745143],
          [-107.649208651602, 38.5268911544329],
          [-107.649188002053, 38.5269306186419],
          [-107.649162295185, 38.5269157720706],
          [-107.649192101589, 38.5268547227363],
          [-107.649208868551, 38.5268223525366],
          [-107.649225831235, 38.5267931602043],
          [-107.649259636559, 38.5268053745143]
        ]
      ]
    },
    'osmId': '136044',
    'foreignKey': '{F4C1EF00-D7C8-43CC-AE96-0B7C46644ED2}',
    'properties': {
      'OBJECTID': 47,
      'POINAME': 'East Portal Parking',
      'POITYPE': 'Parking',
      'POILABEL': 'East Portal Parking',
      'POIFEATTYPE': null,
      'UnitCode': 'CURE',
      'UnitName': 'Curecanti National Recreation Area',
      'GROUPCODE': null,
      'REGIONCODE': 'IMR',
      'ISEXTANT': 'Yes',
      'CreateDate': 1005264000000,
      'CREATEUSER': 'Park Staff',
      'EditDate': 1444780800000,
      'EDITUSER': 'Park Staff',
      'MapMethod': 'Differential GPS',
      'MapSource': 'GPS',
      'SOURCESCALE': null,
      'SOURCEDATE': null,
      'XYERROR': null,
      'DISTRIBUTE': 'Public',
      'RESTRICTION': 'Unrestricted',
      'LOCATIONID': null,
      'ASSETID': null,
      'FEATUREID': null,
      'GEOMETRYID': '{8ED3AF32-8D1D-4AC9-9E86-38BD8E08A26F}',
      'Notes': 'Campground bathroom',
      'INPLACES': 'Yes',
      'HANDICAP_SPACES': 'no',
      'SURFACE': 'Unpaved',
      'COMMENT': ' ',
      'GlobalID': '7d9bc7b9-265f-40eb-a8d6-bbf7ade5b81c'
    }
  }, {
    'type': 'Feature',
    'geometry': {
      'type': 'Polygon',
      'coordinates': [
        [
          [-107.649410528507, 38.5258788610854],
          [-107.649448290561, 38.5258780132879],
          [-107.649475542103, 38.5258773881441],
          [-107.649478564624, 38.5259167515899],
          [-107.649476738351, 38.5259672259267],
          [-107.649514147472, 38.5259717623133],
          [-107.64955595366, 38.5259708814747],
          [-107.649551870051, 38.5260067532031],
          [-107.649556074421, 38.526070134638],
          [-107.649483872752, 38.5260758915159],
          [-107.649482206915, 38.5261163278797],
          [-107.649528405405, 38.5261169306391],
          [-107.649567174189, 38.5261152274904],
          [-107.649569630575, 38.5261578211905],
          [-107.6495741483, 38.5261909195201],
          [-107.649489151826, 38.5261911952689],
          [-107.64945460756, 38.5261936262459],
          [-107.649412724286, 38.5261962233816],
          [-107.649411930328, 38.5261459507301],
          [-107.649413564834, 38.5261046906693],
          [-107.649417508119, 38.5260691500833],
          [-107.649415242414, 38.526007368155],
          [-107.649416642643, 38.5259641618508],
          [-107.64941285579, 38.5259422904348],
          [-107.649412876757, 38.5259142592206],
          [-107.649410528507, 38.5258788610854]
        ]
      ]
    },
    'osmId': '136044',
    'foreignKey': '{F4C1EF00-D7C8-43CC-AE96-0B7C46644ED2}',
    'properties': {
      'OBJECTID': 45,
      'POINAME': 'East Portal Parking',
      'POITYPE': 'Parking',
      'POILABEL': 'East Portal Parking',
      'POIFEATTYPE': null,
      'UnitCode': 'CURE',
      'UnitName': 'Curecanti National Recreation Area',
      'GROUPCODE': null,
      'REGIONCODE': 'IMR',
      'ISEXTANT': 'Yes',
      'CreateDate': 1005264000000,
      'CREATEUSER': 'Park Staff',
      'EditDate': 1444780800000,
      'EDITUSER': 'Park Staff',
      'MapMethod': 'Differential GPS',
      'MapSource': 'GPS',
      'SOURCESCALE': null,
      'SOURCEDATE': null,
      'XYERROR': null,
      'DISTRIBUTE': 'Public',
      'RESTRICTION': 'Unrestricted',
      'LOCATIONID': null,
      'ASSETID': null,
      'FEATUREID': null,
      'GEOMETRYID': '{F4C1EF00-D7C8-43CC-AE96-0B7C46644ED2}',
      'Notes': 'Ranger Station',
      'INPLACES': 'Yes',
      'HANDICAP_SPACES': 'no',
      'SURFACE': 'Unpaved',
      'COMMENT': ' ',
      'GlobalID': '6368b6df-5dbd-47b9-afc1-a86eaaaea5c1'
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
