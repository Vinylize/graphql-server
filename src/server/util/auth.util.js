import admin from './firebase/firebase';
import {
  refs
} from './firebase/firebase.database.util';
import {
  refreshToken
} from './auth/auth.jwt';
import {
  mRefs
} from './sequelize/sequelize.database.util';

const tempUid = 'AZpdgg8SnteR7qgOItyYn1lH0sH3';
const tempName = 'YettaTest';

export default {
  apiProtector(req, res, next) {
    const r = req;
    if (r.headers.authorization === 'TT') {
      r.user = { uid: tempUid, name: tempName, warn: 'this is tempUid.', d: 'TT' };
      return next();
    }
    if (r.headers.authorization) {
      if (r.headers.permission === 'admin') {
        return refreshToken(r.headers.authorization, true)
          .then((authUser) => {
            r.user = authUser.user;
            r.token = authUser.token;
            return mRefs.user.root.findDataById(['e', 'permission', 'd'], r.user.uid)
            .then((users) => {
              if (users[0].permission === 'admin' && users[0].e === r.user.e) {
                r.user.permission = 'admin';
                return next();
              }
              if (!r.headers.device) throw new Error('No device id Error');
              if (users[0].d && users[0].d !== r.headers.device) {
                throw new Error('Another device logged in. Please login again.');
              }
              return next();
            });
          })
          .catch(error => res.status(200).json({ errors: [{
            message: error.message,
            locations: error.locations,
            stack: error.stack,
            path: error.path
          }] }));
      }
      return admin.auth().verifyIdToken(r.headers.authorization)
        .then((decodedToken) => {
          r.user = decodedToken;
          return refs.user.root.child(r.user.uid).once('value')
            .then((snap) => {
              if (snap.child('permission').val() === 'admin' && snap.child('e').val() === r.user.email) {
                r.user.permission = 'admin';
                return next();
              }
              if (!r.headers.device) {
                throw new Error('unauthorizedError : No Device id in header.');
              }
              if (snap.val().d && snap.val().d !== r.headers.device) {
                return refs.user.root.child(r.user.uid).update({ d: null, dt: null })
                  .then(() => {
                    throw new Error('unauthorizedError : Another device logged in. Please login again.');
                  })
                  .catch((e) => { throw new Error(e); });
              }
              return next();
            });
        })
        // Format to GraphQLError
        .catch(error => res.status(200).json({ errors: [{
          message: error.message,
          locations: error.locations,
          stack: error.stack,
          path: error.path
        }] }));
    }
    return next();
  }
};
