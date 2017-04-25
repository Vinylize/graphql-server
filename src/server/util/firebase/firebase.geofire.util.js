import GeoFire from 'geofire';
import { refs } from './firebase.database.util';

const nodeGeoFire = new GeoFire(refs.node.coordinate);
const userGeoFire = new GeoFire(refs.user.coordinate);

export {
  userGeoFire,
  nodeGeoFire
};
