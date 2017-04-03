import GeoFire from 'geofire';
import { refs } from './firebase.util';

const nodeGeoFire = new GeoFire(refs.node.coordinate);
const userGeoFire = new GeoFire(refs.user.coordinate);

export {
  userGeoFire,
  nodeGeoFire
};
