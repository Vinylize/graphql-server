import Transport from 'lokka-transport-http';
import Lokka from 'lokka';
import firebase from 'firebase';

import server from '../server/app';

const config = {
  apiKey: process.env.FIREBASE_API_KEY,
  databaseURL: process.env.FIREBASE_URL,
};

firebase.initializeApp(config);
// const db = firebase.database();

const clientDefault = new Lokka({
  transport: new Transport(`http://localhost:${process.env.PORT}/graphql`)
});
const clientUserA = new Lokka({
  transport: new Transport(`http://localhost:${process.env.PORT}/graphql`)
});
const clientUserB = new Lokka({
  transport: new Transport(`http://localhost:${process.env.PORT}/graphql`)
});

const uuid = Date.now();
const userA = {
  e: `userA@${uuid}.com`,
  n: 'userA',
  pw: 'userApassword',
  accessToken: undefined
};
const userB = {
  e: `userB@${uuid}.com`,
  n: 'userB',
  pw: 'userBpassword',
  accessToken: undefined
};


/* eslint-disable*/
it('Server open test.', function (done) {
  this.timeout(5000);
  server(() => {
    done();
  });
});

describe('Create User test', () => {
  it('Create userA', function (done) {
    this.timeout(10000);
    clientDefault.mutate(`{createUser(input:{e:"${userA.e}",n:"${userA.n}",pw:"${userA.pw}"}){result}}`)
      .then(() => {
        done();
      });
  });

  it('Create userB', function (done) {
    this.timeout(10000);
    clientDefault.mutate(`{createUser(input:{e:"${userB.e}",n:"${userB.n}",pw:"${userB.pw}"}){result}}`)
      .then(() => {
        done();
      });
  });
});

describe('Login User test', () => {
  it('Login userA', function (done) {
    this.timeout(10000);
    firebase.auth().signInWithEmailAndPassword(userA.e, userA.pw)
      .then(() => firebase.auth().getToken().then((response) => {
        clientUserA._transport._httpOptions.headers.authorization = userA.accessToken = response.accessToken;
        done();
      }));
  });

  it('Login userB', function (done) {
    this.timeout(10000);
    firebase.auth().signInWithEmailAndPassword(userA.e, userA.pw)
      .then(() => firebase.auth().getToken().then((response) => {
        clientUserB._transport._httpOptions.headers.authorization = userB.accessToken = response.accessToken;
        done();
      }));
  });
});

describe('query viewer test', () => {
  it('view userA', function (done) {
    this.timeout(10000);
    done();
  });

  it('view userB', function (done) {
    this.timeout(10000);
    done();
  });
});
/* eslint-enable func-names */
