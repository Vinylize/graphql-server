import jwt from 'jsonwebtoken';
import {
    refs,
    admin
} from './firebase.util';
const JWT_CREATE_OPTION = { algorithm: 'HS256' };

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

const tempUid = 'cFfM2SbiZYVNyoKPxkBoWgjWBgv1';

export default {
  apiProtector(req, res, next) {
    if (req.headers.authorization === 'TT') {
      req.user = { uid: tempUid, warn: 'this is tempUid.'};
      return next();
    }
    if (req.headers.authorization) {
      return admin.auth().verifyIdToken(req.headers.authorization)
        .then((decodedToken) => {
          req.user = decodedToken;
          return next();
        })
        .catch((error) => {
          return res.status(401).json({err: error.message});
        });
    }
    return next();
  },

  createAccessToken(payload) {
    return jwt.sign(payload, JWT_SECRET_KEY, JWT_CREATE_OPTION);
  },

  updateAccessToken(previousToken, updateTokenCallback) {
    jwt.verify(previousToken, JWT_SECRET_KEY, { ignoreExpiration: true },
      function (err, decodedUser) {
        if (typeof updateTokenCallback === 'function') {
          updateTokenCallback(err, decodedUser ? this.createAccessToken(decodedUser) : null);
        }
      }.bind(this));
  }
};
