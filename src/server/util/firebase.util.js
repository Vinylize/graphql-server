import admin from 'firebase-admin';

const serviceAccount = require(`../../../${process.env.FIREBASE_SERVICE_ACCOUNT_JSON}`);
const adminOption = {
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_URL
};

admin.initializeApp(adminOption);

const db = admin.database();
const userRef = db.ref('/user');
const userPropertiesRef = db.ref('/userProperties');
const connectionRef = db.ref('/connection');
const connectionPropertiesRef = db.ref('/connectionProperties');
const reportRef = db.ref('/report');

const refs = {
  user: userRef,
  userProperties: userPropertiesRef,
  userPortQualification: userPropertiesRef.child('portQualification'),
  userShipQualification: userPropertiesRef.child('shipQualification'),
  userCoordinate: userPropertiesRef.child('coordinate'),
  userPaymentInfo: userPropertiesRef.child('paymentInfo'),
  userAddress: userPropertiesRef.child('address'),
  userPhoneValidationInfo: userPropertiesRef.child('phoneValidationInfo'),
  connection: connectionRef,
  connectionProperties: connectionPropertiesRef,
  connectionReward: connectionPropertiesRef.child('reward'),
  connectionGoods: connectionPropertiesRef.child('goods'),
  report: reportRef
};

const defaultSchema = {
  user: {
    isPhoneValid: false,
    createdAt: Date.now(),
    phoneNumber: null,
    rating: 0,
    country: null
  },
  userPortQualification: {
    isAgreed: false,
    agreedAt: null
  },
  userShipQualification: {
    isAgreed: false,
    agreedAt: null,
    isApproved: false,
    approvedAt: null
  },
  userPhoneValidationInfo: {
    expiredAt: Date.now() + 120000
  },
  connection: {
    ship: null,
    resultImage: null,
    openedAt: Date.now(),
    isExpired: false
  },
  report: {
    createdAt: Date.now()
  }
};

export default class firebase {
  static get admin() {
    return admin;
  }

  static get refs() {
    return refs;
  }

  static get defaultSchema() {
    return defaultSchema;
  }
}
