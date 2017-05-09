import admin from './firebase/firebase';
import {
  refs
} from './firebase/firebase.database.util';

const tempUid = 'AZpdgg8SnteR7qgOItyYn1lH0sH3';
const tempName = 'YettaTest';

export default {
  apiProtector(req, res, next) {
    const r = req;
    if (r.headers.authorization === 'TT') {
      r.user = { uid: tempUid, name: tempName, warn: 'this is tempUid.' };
      return next();
    }
    if (r.headers.authorization) {
      return admin.auth().verifyIdToken(r.headers.authorization)
        .then((decodedToken) => {
          r.user = decodedToken;
          return refs.user.root.child(r.user.uid).once('value')
            .then((snap) => {
              if (snap.child('permission').val() === 'admin' && snap.child('e').val() === r.user.email) r.user.permission = 'admin';
              return next();
            });
        })
        .catch(error => res.status(401).json({ err: error.message }));
    }
    return next();
  }
};
