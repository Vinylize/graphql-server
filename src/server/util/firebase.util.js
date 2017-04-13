import admin from 'firebase-admin';

const serviceAccount = require(`../../../${process.env.FIREBASE_SERVICE_ACCOUNT_JSON}`);

const config = {
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_URL,
};

admin.initializeApp(config);

const time = Date.now().toString();
const env = process.env.NODE_ENV;

const db = (env === 'test') ? admin.database().ref(`test${time}`) : admin.database().ref();

const userRef = db.child('/user');
const userPropertiesRef = db.child('/userProperties');

const orderRef = db.child('/order');
const orderPropertiesRef = db.child('/orderProperties');

const nodeRef = db.child('/node');
const nodePropertiesRef = db.child('/nodeProperties');

const partnerRef = db.child('/partner');
const partnerPropertiesRef = db.child('/partnerProperties');

// synchronized with documentation
const refs = {
  user: {
    root: userRef,
    properties: userPropertiesRef,
    userQualification: userPropertiesRef.child('userQualification'),
    runnerQualification: userPropertiesRef.child('runnerQualification'),
    coordinate: userPropertiesRef.child('coordinate'),
    userPaymentInfo: userPropertiesRef.child('userPaymentInfo'),
    runnerPaymentInfo: userPropertiesRef.child('runnerPaymentInfo'),
    address: userPropertiesRef.child('address'),
    phoneVerificationInfo: userPropertiesRef.child('phoneVerificationInfo'),
    help: userPropertiesRef.child('help')
  },
  order: {
    root: orderRef,
    properties: orderPropertiesRef,
    itemInfo: orderPropertiesRef.child('itemInfo'),
    paymentDetail: orderPropertiesRef.child('paymentDetail'),
    calculateDetail: orderPropertiesRef.child('calculateDetail'),
    evalFromUser: orderPropertiesRef.child('evalFromUser'),
    evalFromRunner: orderPropertiesRef.child('evalFromRunner')
  },
  node: {
    root: nodeRef,
    properties: nodePropertiesRef,
    items: nodePropertiesRef.child('items'),
    coordinate: nodePropertiesRef.child('coordinate')
  },
  partner: {
    root: partnerRef,
    properties: partnerPropertiesRef,
    qualification: partnerPropertiesRef.child('qualification'),
    paymentInfo: partnerPropertiesRef.child('paymentInfo')
  }
};

const defaultSchema = {
  user: {
    root: {
      idUrl: null,
      pUrl: null,
      isPV: false,
      p: null,
      r: 5,
      dt: null
    },
    orderQualification: {
      isA: false,
      aAt: null
    },
    runnerQualification: {
      isA: false,
      aAt: null,
      isFA: false,
      fAAt: null,
      isSA: false,
      sAAt: null
    }
  },
  order: {
    root: {
      rId: null,
      rImg: null,
      EDP: null,
      RDP: null,
    },
    itemInfo: {

    },
    evalFromUser: {
      m: 3,
      comm: null
    },
    evalFromRunner: {
      m: 3,
      comm: null
    }
  },
  node: {
    root: {
      like: 0
    },
    items: {
      iImgUrl: null
    }
  },
  partner: {
    root: {
    },
    qualification: {
      isA: false,
      aAt: null,
      isFA: false,
      fAAt: null
    }
  }
};

export {
  admin,
  db,
  defaultSchema,
  refs
};
