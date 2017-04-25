import GeoFire from 'geofire';
import {
  nodeGeoFire
} from './firebase/firebase.geofire.util';

const calcPrice = (nId, items, dest) => new Promise((resolve, reject) => {
  const defaultDistance = 100; // in meters
  const distanceUnit = 100; // in meters
  const defaultFee = 2000; // in KRW
  const additionalFee = 100; // per distance unit , in KRW
  let eDP = 0;
  let tP = 0;

  return nodeGeoFire.get(nId)
  .then((location) => {
    const distance = GeoFire.distance(location, dest) * 1000; // in meters
    const additionalDistance = distance - defaultDistance;
    eDP = additionalDistance > 0 ? Math.ceil(additionalDistance / distanceUnit) * additionalFee : defaultFee;
    for (let i = 0; i < items.length; ++i) tP += items[i].cnt * items[i].p;
    return resolve([eDP, tP]);
  })
  .catch(reject);
});

export default calcPrice;
