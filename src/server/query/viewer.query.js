import {
  mRefs
} from '../util/sequelize/sequelize.database.util';
import UserType from '../type/user.type';

const ViewerQuery = {
  viewer: {
    description: 'Logged in viewer.',
    type: UserType,
    resolve: (source, _, { user }) => new Promise((resolve, reject) => {
      if (user) {
        // refs.user.root.child(user.uid).once('value')
        //     .then((snap) => {
        //       resolve({
        //         id: user.uid,
        //         ...snap.val()
        //       });
        //     }).catch(console.log);
        mRefs.user.root.findDataById([], user.uid)
          .then((results) => {
            resolve({
              id: user.uid,
              ...results[0]
            });
          })
          .catch(reject);
      } else {
          // TODO : implement global error handler.
        reject('This query needs access token. Please check header.authorization.');
      }
    })
  }
};

export default ViewerQuery;
