import fs from 'fs';
import {
  mRefs,
  createData
} from './sequelize.database.util';
/* eslint-disable array-callback-return */
const up = () => {
  const data = JSON.parse(fs.readFileSync('seed/seed.json', 'utf8'));
  Object.keys(data).map((table) => {
    if (table === 'user' || table === 'order' || table === 'partner') {
      Object.keys(data[table]).map((key) => {
        createData(mRefs[table].root, { ...data[table][key] }, key);
      });
    }
    return null;
  });
  const nodes = data.node;
  const coordinates = data.nodeProperties.coordinate;
  Object.keys(coordinates).map((key) => {
    nodes[key].lat = coordinates[key].l[0];
    nodes[key].lon = coordinates[key].l[1];
    createData(mRefs.node.root, { ...nodes[key] }, key);
    return null;
  });
};
/* eslint-enable array-callback-return */
if (process.argv[2] === 'up') up();
