import fs from 'fs';
import {
  mRefs
} from './sequelize.database.util';
/* eslint-disable array-callback-return */
const up = () => {
  const data = JSON.parse(fs.readFileSync('seed/seed.json', 'utf8'));
  Object.keys(data).map((table) => {
    if (table === 'user' || table === 'order' || table === 'partner') {
      Object.keys(data[table]).map((key) => {
        mRefs[table].root.createData({ ...data[table][key] }, key);
      });
    }
    return null;
  });
  const nodes = data.node;
  const coordinates = data.nodeProperties.coordinate;
  Object.keys(coordinates).map((key) => {
    nodes[key].coordinate = { type: 'Point', coordinates: [coordinates[key].l[1], coordinates[key].l[0]] };
    mRefs.node.root.createData({ ...nodes[key] }, key);
    return null;
  });
};
/* eslint-enable array-callback-return */
if (process.argv[2] === 'up') up();
