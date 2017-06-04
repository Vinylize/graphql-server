import Sequelize from 'sequelize';
import uuid from 'uuid';
import envFile from 'node-env-file';

const schema = {
  user: {
    root: {
      row_id: { v: { type: Sequelize.UUID, unique: 'v' } },
      e: { v: { type: Sequelize.STRING, unique: 'v' } },
      pw: { v: { type: Sequelize.STRING } },
      n: { v: { type: Sequelize.STRING } },
      mode: { v: { type: Sequelize.INTEGER } },
      idUrl: { v: { type: Sequelize.STRING } },
      pUrl: { v: { type: Sequelize.STRING } },
      p: { v: { type: Sequelize.STRING } },
      isPV: { v: { type: Sequelize.BOOLEAN } },
      cAt: { v: { type: Sequelize.DATE } },
      r: { v: { type: Sequelize.INTEGER } },
      dt: { v: { type: Sequelize.STRING } },
      d: { v: { type: Sequelize.STRING } },
      isWJ: { v: { type: Sequelize.BOOLEAN } },
      isRA: { v: { type: Sequelize.BOOLEAN } },
      rAAt: { v: { type: Sequelize.INTEGER } },
      isB: { v: { type: Sequelize.BOOLEAN } },
      permission: { v: { type: Sequelize.STRING } },
      isUA: { v: { type: Sequelize.BOOLEAN } },
      uAAt: { v: { type: Sequelize.DATE } },
      isSA: { v: { type: Sequelize.BOOLEAN } },
      sAAt: { v: { type: Sequelize.DATE } },
      lat: { v: { type: Sequelize.FLOAT } },
      lon: { v: { type: Sequelize.FLOAT } },
      code: { v: { type: Sequelize.INTEGER } },
      vAt: { v: { type: Sequelize.DATE } },
      eAt: { v: { type: Sequelize.DATE } }
    },
    userPaymentInfo: {
      sub_id: { v: { type: Sequelize.UUID, unique: 'v' } },
      type: { v: { type: Sequelize.STRING } },
      num: { v: { type: Sequelize.STRING } },
      provider: { v: { type: Sequelize.STRING } }
    },
    runnerPaymentInfo: {
      sub_id: { v: { type: Sequelize.UUID, unique: 'v' } },
      type: { v: { type: Sequelize.STRING } },
      num: { v: { type: Sequelize.STRING } },
      provider: { v: { type: Sequelize.STRING } }
    },
    userAddress: {
      sub_id: { v: { type: Sequelize.UUID, unique: 'v' } },
      name: { v: { type: Sequelize.STRING } },
      mAddr: { v: { type: Sequelize.STRING } },
      sAddr: { v: { type: Sequelize.STRING } },
      lat: { v: { type: Sequelize.FLOAT } },
      lon: { v: { type: Sequelize.FLOAT } }
    },
    help: {
      sub_id: { v: { type: Sequelize.UUID, unique: 'v' } },
      comm: { v: { type: Sequelize.STRING } },
      cAt: { v: { type: Sequelize.DATE } },
      aAt: { v: { type: Sequelize.DATE } },
      ans: { v: { type: Sequelize.STRING } },
      ansAt: { v: { type: Sequelize.DATE } }
    }
  },
  order: {
    root: {
      row_id: { v: { type: Sequelize.UUID, unique: 'v' } },
      oId: { v: { type: Sequelize.STRING } },
      rId: { v: { type: Sequelize.STRING } },
      nId: { v: { type: Sequelize.STRING } },
      dest: { v: { type: Sequelize.STRING } },
      dC: { v: { type: Sequelize.INTEGER } },
      rC: { v: { type: Sequelize.INTEGER } },
      rImg: { v: { type: Sequelize.STRING } },
      eDp: { v: { type: Sequelize.INTEGER } },
      rDp: { v: { type: Sequelize.INTEGER } },
      isIC: { v: { type: Sequelize.BOOLEAN } },
      tP: { v: { type: Sequelize.INTEGER } },
      curr: { v: { type: Sequelize.STRING } },
      cAt: { v: { type: Sequelize.DATE } },
      pSAt: { v: { type: Sequelize.DATE } },
      pFAt: { v: { type: Sequelize.DATE } },
      rSAt: { v: { type: Sequelize.DATE } },
      endAt: { v: { type: Sequelize.DATE } },
      n1: { v: { type: Sequelize.STRING } },
      n2: { v: { type: Sequelize.STRING } },
      lat: { v: { type: Sequelize.FLOAT } },
      lon: { v: { type: Sequelize.FLOAT } },
      calculateDetail: { v: { type: Sequelize.STRING } },
      paymentDetail: { v: { type: Sequelize.STRING } },
      rM: { v: { type: Sequelize.INTEGER } },
      rComm: { v: { type: Sequelize.STRING } },
      uM: { v: { type: Sequelize.INTEGER } },
      uComm: { v: { type: Sequelize.STRING } }
    },
    regItems: {
      sub_id: { v: { type: Sequelize.UUID, unique: 'v' } },
      iId: { v: { type: Sequelize.STRING } },
      n: { v: { type: Sequelize.STRING } },
      p: { v: { type: Sequelize.INTEGER } },
      cnt: { v: { type: Sequelize.INTEGER } }
    },
    customItems: {
      sub_id: { v: { type: Sequelize.UUID, unique: 'v' } },
      iId: { v: { type: Sequelize.STRING } },
      n: { v: { type: Sequelize.STRING } },
      manu: { v: { type: Sequelize.STRING } },
      cnt: { v: { type: Sequelize.INTEGER } }
    }
  },
  node: {
    root: {
      row_id: { v: { type: Sequelize.UUID, unique: 'v' } },
      n: { v: { type: Sequelize.STRING } },
      p: { v: { type: Sequelize.STRING } },
      addr: { v: { type: Sequelize.STRING } },
      c1: { v: { type: Sequelize.STRING } },
      c2: { v: { type: Sequelize.STRING } },
      type: { v: { type: Sequelize.STRING } },
      pId: { v: { type: Sequelize.STRING } },
      imgUrl: { v: { type: Sequelize.STRING } },
      cAt: { v: { type: Sequelize.DATE } },
      like: { v: { type: Sequelize.INTEGER } },
      lat: { v: { type: Sequelize.FLOAT } },
      lon: { v: { type: Sequelize.FLOAT } }
    },
    nodeItems: {
      sub_id: { v: { type: Sequelize.UUID, unique: 'v' } },
      name: { v: { type: Sequelize.STRING } },
      imgUrl: { v: { type: Sequelize.STRING } },
      price: { v: { type: Sequelize.INTEGER } },
      weight: { v: { type: Sequelize.INTEGER } }
    }
  },
  partner: {
    root: {
      row_id: { v: { type: Sequelize.UUID, unique: 'v' } },
      pw: { v: { type: Sequelize.STRING } },
      name: { v: { type: Sequelize.STRING } },
      p: { v: { type: Sequelize.STRING } },
      cAt: { v: { type: Sequelize.DATE } },
      isA: { v: { type: Sequelize.BOOLEAN } },
      AAt: { v: { type: Sequelize.DATE } },
      isFA: { v: { type: Sequelize.BOOLEAN } },
      FAAt: { v: { type: Sequelize.DATE } }
    },
    partnerPaymentInfo: {
      sub_id: { v: { type: Sequelize.UUID, unique: 'v' } },
      type: { v: { type: Sequelize.INTEGER } },
      num: { v: { type: Sequelize.STRING } },
      provider: { v: { type: Sequelize.STRING } }
    }
  }
};

/* eslint-disable array-callback-return */

// Add id columns for binding tables
Object.keys(schema).map((key1) => {
  Object.keys(schema[key1]).map((key2) => {
    Object.keys(schema[key1][key2]).map((key3) => {
      schema[key1][key2][key3].id = {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      };
      if (key2 === 'root') {
        if (key3 !== 'row_id') schema[key1][key2][key3].row_id = { type: Sequelize.UUID, unique: 'row_id' };
      } else {
        schema[key1][key2][key3].row_id = { type: Sequelize.UUID };
        if (key3 !== 'sub_id') schema[key1][key2][key3].sub_id = { type: Sequelize.UUID, unique: 'sud_id' };
      }
    });
  });
});

if (!process.env.MYSQL_DATABASE) envFile('./env.dev.list');
const db = new Sequelize(process.env.MYSQL_DATABASE, process.env.MYSQL_USER, process.env.MYSQL_PASSWORD, {
  host: process.env.MYSQL_URL,
  port: process.env.MYSQL_PORT,
  dialect: 'mysql',
  define: {
    charset: 'utf8',
    timestamps: false
  },
});

/* eslint-enable array-callback-return */

const mRefs = {
  user: {
    root: {},
    userPaymentInfo: {},
    runnerPaymentInfo: {},
    userAddress: {},
    help: {}
  },

  order: {
    root: {},
    regItems: {},
    customItems: {}
  },

  node: {
    root: {},
    nodeItems: {}
  },

  partner: {
    root: {},
    partnerPaymentInfo: {}
  }
};

const mDefaultSchema = {
  user: {
    root: {
      idUrl: null,
      pUrl: null,
      isPV: false,
      p: null,
      r: 5,
      dt: null,
      isRA: null,
      rAAt: null,
      isWJ: false,
      isB: false,
      isSA: false,
      sAAt: null
    }
  },
  order: {
    root: {
      rId: null,
      rImg: null,
      RDP: null,
      uM: 3,
      uComm: null,
      rM: 3,
      rComm: null
    }
  },
  node: {
    root: {
      like: 0
    },
    nodeItems: {
      iImgUrl: null
    }
  },
  partner: {
    root: {
    },
    partnerQualification: {
      isA: false,
      aAt: null,
      isFA: false,
      fAAt: null
    }
  }
};

class Reference {
  constructor(key, object) {
    this[key] = object;
  }

  setColumn(key, object) {
    this[key] = object;
  }

  findDataById(properties, id, idProp) {
    return new Promise((resolve, reject) => {
      let where = {};
      const idRoot = this.row_id ? 'row_id' : 'sub_id';
      let idType = idProp;
      if (!idProp) idType = idRoot;
      let attributes = [];
      if (idRoot === 'row_id') {
        attributes = [['v', idRoot]];
        where = { v: id };
      } else {
        attributes = ['row_id', ['v', idRoot]];
        if (idType === 'row_id') where = { row_id: id };
        else if (idType === 'sub_id') where = { v: id };
      }
      return this[idRoot].findAll({
        rejectOnEmpty: true,
        attributes,
        where,
        include:
          properties.map((prop) => {
            const condition = {};
            condition[idType] = id;
            if (prop !== idRoot && this[prop]) {
              return {
                model: this[prop],
                as: prop,
                attributes: [['v', prop]],
                where: condition,
                required: false,
              };
            }
            return null;
          })
      })
      .then((results) => {
        const results2 = [];
        let temp = {};
        results.map((item) => {
          temp = {};
          temp.row_id = item.dataValues.row_id;
          if (idRoot === 'sub_id') temp.sub_id = item.dataValues.sub_id;
          Object.keys(item.dataValues).map((prop) => {
            if (prop !== 'row_id' && prop !== 'sub_id') {
              item.dataValues[prop].map((key) => {
                temp[prop] = key.dataValues[prop];
                return null;
              });
            }
            return null;
          });
          results2.push(temp);
          return null;
        });
        return resolve(results2);
      })
      .catch(reject);
    });
  }

  findData(properties, condition) {
    return new Promise((resolve, reject) => {
      const idRoot = this.row_id ? 'row_id' : 'sub_id';
      let attributes = [];
      if (this.row_id) attributes = [['v', idRoot]];
      else attributes = ['row_id', ['v', idRoot]];
      if (Object.prototype.hasOwnProperty.call(condition.where, 'row_id') || Object.prototype.hasOwnProperty.call(condition.where, 'sub_id')) {
        let idType = null;
        if (Object.prototype.hasOwnProperty.call(condition.where, 'row_id')) idType = 'row_id';
        if (Object.prototype.hasOwnProperty.call(condition.where, 'sub_id')) idType = 'sub_id';
        return this.findDataById(properties, condition.where[idType], idType)
          .then(result => resolve(result))
          .catch(reject);
      }
      return this[idRoot].findAll({
        rejectOnEmpty: true,
        attributes,
        include:
          Object.keys(condition.where).map((prop) => {
            if (prop !== idRoot && this[prop]) {
              return {
                model: this[prop],
                as: prop,
                attributes: [['v', prop]],
                where: { v: condition.where[prop] },
                required: true,
              };
            }
            return null;
          })
      })
        .then(results => Promise.all(results.map(result =>
          this.findDataById(properties, result.dataValues[idRoot])
          .then(result2 => result2[0])
        )))
        .then(result => resolve(result))
        .catch(reject);
    });
  }

  createData(properties, id) {
    return new Promise((resolve, reject) => {
      let newId = uuid.v1();
      if (this.row_id) {
        if (id) newId = id;
        return db.transaction(t => this.row_id.create({ v: newId }, { transaction: t })
          .then(() => Promise.all(
            Object.keys(properties).map((key) => {
              if (this[key]) return this[key].create({ row_id: newId, v: properties[key] }, { transaction: t });
              return null;
            })
          )))
          .then(() => resolve(newId))
          .catch(reject);
      }
      return db.transaction(t => this.sub_id.create({ row_id: id, v: newId }, { transaction: t })
        .then(() => Promise.all(
          Object.keys(properties).map((key) => {
            if (this[key]) return this[key].create({ row_id: id, sub_id: newId, v: properties[key] }, { transaction: t });
            return null;
          })
        ))).then(() => resolve(newId))
        .catch(reject);
    });
  }

  updateData(properties, condition) {
    return new Promise((resolve, reject) => this.findData([], condition)
      .then(ids => db.transaction(t => Promise.all(
        ids.map(id => Promise.all(
          Object.keys(properties).map((key) => {
            if (this.row_id) {
              return this[key].findOne({ where: { row_id: id.row_id } }, { transaction: t })
              .then((data) => {
                if (data) return this[key].update({ v: properties[key] }, { where: { row_id: id.row_id } }, { transaction: t });
                return this[key].create({ row_id: id.row_id, v: properties[key] }, { transaction: t });
              });
            }
            return this[key].findOne({ where: { sub_id: id.sub_id } }, { transaction: t })
            .then((data) => {
              if (data) return this[key].update({ v: properties[key] }, { where: { sub_id: id.sub_id } }, { transaction: t });
              return this[key].create({ row_id: id.row_id, sub_id: id.sub_id, v: properties[key] }, { transaction: t });
            });
          })
        )))
        .then(() => resolve(ids.map(v => Object.assign(v, properties))))))
        .catch(reject)
    );
  }
}


/* eslint-disable array-callback-return */

// Making associations among tables
Object.keys(schema).map((key1) => {
  Object.keys(schema[key1]).map((key2) => {
    mRefs[key1][key2] = new Reference();
    Object.keys(schema[key1][key2]).map((key3) => {
      mRefs[key1][key2].setColumn(key3, db.define(`${key1}_${key2}_${key3}`, schema[key1][key2][key3], {
        timestamps: false,
        tableName: `${key1}_${key2}_${key3}`,
        freezeTableName: true
      }));
    });
  });
});
Object.keys(schema).map((key1) => {
  Object.keys(schema[key1]).map((key2) => {
    Object.keys(schema[key1][key2]).map((key3) => {
      if (schema[key1][key2].row_id) {
        if (key3 !== 'row_id') {
          mRefs[key1][key2][key3].belongsTo(mRefs[key1][key2].row_id, { foreignKey: 'row_id', targetKey: 'v' });
          mRefs[key1][key2].row_id.hasMany(mRefs[key1][key2][key3], { foreignKey: 'row_id', sourceKey: 'v', constraints: false, as: key3 });
        }
      } else {
        if (key3 !== 'sub_id') {
          mRefs[key1][key2][key3].belongsTo(mRefs[key1][key2].sub_id, { foreignKey: 'sub_id', targetKey: 'v' });
          mRefs[key1][key2].sub_id.hasMany(mRefs[key1][key2][key3], { foreignKey: 'sub_id', sourceKey: 'v', constraints: false, as: key3 });
        }
        mRefs[key1][key2][key3].belongsTo(mRefs[key1].root.row_id, { foreignKey: 'row_id', targetKey: 'v' });
        mRefs[key1].root.row_id.hasMany(mRefs[key1][key2][key3], { foreignKey: 'row_id', sourceKey: 'v', constraints: false, as: key3 });
      }
    });
  });
});

/* eslint-enable array-callback-return */

export {
  mRefs,
  mDefaultSchema,
  db
};
