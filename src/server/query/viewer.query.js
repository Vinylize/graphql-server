import {
  refs
} from '../util/firebase/firebase.database.util';
import UserType from '../type/user.type';

const ViewerQuery = {
  viewer: {
    description: 'Logged in viewer.',
    type: UserType,
    resolve: (source, _, { user }) => new Promise((resolve, reject) => {
      if (user) {
        refs.user.root.child(user.uid).once('value')
            .then((snap) => {
              resolve({
                id: user.uid,
                isEV: user.emailVerified,
                ...snap.val()
              });
            }).catch(console.log);
      } else {
          // TODO : implement global error handler.
        reject('This query needs access token. Please check header.authorization.');
      }
    })
  }
};

export default ViewerQuery;
