import { db } from './sequelize.database.util';

const up = () => {
  console.log('migration starts');
  db.sync();
};

const down = () => {

};

if (process.argv[2] === 'up') up();
else down();
