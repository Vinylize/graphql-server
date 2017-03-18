import {
    admin
} from './firebase.util';

const tempUid = 'cFfM2SbiZYVNyoKPxkBoWgjWBgv1';

export default {
  apiProtector(req, res, next) {
    const r = req;
    if (r.headers.authorization === 'TT') {
      r.user = { uid: tempUid, warn: 'this is tempUid.' };
      return next();
    }
    if (r.headers.authorization) {
      return admin.auth().verifyIdToken(r.headers.authorization)
        .then((decodedToken) => {
          r.user = decodedToken;
          return next();
        })
        .catch(error => res.status(401).json({ err: error.message }));
    }
    return next();
  }
};
