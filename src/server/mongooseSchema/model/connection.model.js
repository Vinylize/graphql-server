import mongoose from 'mongoose';
import ConnectionSchema from '../schema/connection.schema';

const staticFunc = {
  findById: function (_id)  {
    return this.findOne({ _id: _id }).exec();
  },

  strictFindById: function (_id) {
    return this.findOne({ _id: _id }).exec()
      .then((existingUser) => {
        if (existingUser) {
          return existingUser;
        }

        throw new Error(userCallback.ERR_USER_NOT_FOUND);
      });
  },

  findByEmail: function (email) {
    return this.findOne({ email: email }).exec();
  },

  strictFindByEmail: function (email) {
    return this.findOne({ email: email }).exec()
      .then((existingUser) => {
        if (existingUser) {
          return existingUser;
        }

        throw new Error(userCallback.ERR_USER_NOT_FOUND);
      });
  },

  updateById: function (_id, options) {
    return this.update({ _id: _id }, {
      $set: options,
    }).exec();
  },
};

ConnectionSchema.statics = staticFunc;

export default  mongoose.model('Connection', ConnectionSchema);
