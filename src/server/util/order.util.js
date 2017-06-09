import GeoFire from 'geofire';
import {
  mRefs
} from './sequelize/sequelize.database.util';

const calcPrice = (nId, items, dest) => new Promise((resolve, reject) => {
  const defaultDistance = 100; // in meters
  const distanceUnit = 100; // in meters
  const defaultFee = 2000; // in KRW
  const additionalFee = 100; // per distance unit , in KRW
  let eDP = 0;
  let tP = 0;

  return mRefs.node.root.findDataById([], nId)
  .then((results) => {
    const location = [results[0].coordinate.coordinates[1], results[0].coordinate.coordinates[0]];
    const distance = GeoFire.distance(location, dest);
    const additionalDistance = distance - defaultDistance;
    eDP = additionalDistance > 0 ? Math.ceil(additionalDistance / distanceUnit) * additionalFee : defaultFee;
    for (let i = 0; i < items.length; ++i) tP += items[i].cnt * items[i].p;
    return resolve([eDP, tP]);
  })
  .catch(reject);
  // return nodeGeoFire.get(nId)
  // .then((location) => {
  //   const distance = GeoFire.distance(location, dest) * 1000; // in meters
  //   const additionalDistance = distance - defaultDistance;
  //   eDP = additionalDistance > 0 ? Math.ceil(additionalDistance / distanceUnit) * additionalFee : defaultFee;
  //   for (let i = 0; i < items.length; ++i) tP += items[i].cnt * items[i].p;
  //   return resolve([eDP, tP]);
  // })
  // .catch(reject);
});

export default calcPrice;
