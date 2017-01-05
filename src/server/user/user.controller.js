import UserModel from '../mongooseSchema/model/user.model';
import jwtUtil from '../util/jwt.util';

export default class UserController {

  static getById(req, res, next) {
    const {_id} = req.params;
    return UserModel.findOne({ _id: _id })
      .then((user)=> {
        if (user) {
          res.status(200).send(user);
        } else {
          res.status(400).send({
            message: 'No user'
          });
        }
      })
      .catch((err) => {
        res.status(500).send({
          message: 'Database internal error.'
        });
      });
  }

  static getAll(req, res, next) {
    return UserModel.find()
      .then((userList)=> {
        if (userList) {
          res.status(200).send({userList});
        } else {
          res.status(400).send({
            message: 'No user'
          });
        }
      })
      .catch((err)=> {
        res.status(500).send({
          message: 'Database internal error.'
        });
      });
  }

  static createUser(req, res, next) {
    const { email, name, password } = req.body;
    console.log(req.body);
    return UserModel.create({ email, name, password })
      .then((user)=> {
        user.accessToken = jwtUtil.createAccessToken(user);
        res.status(200).send(user);
      })
      .catch((err)=> {
        res.status(500).send({
          message: 'Database internal error.'
        });
      });
  }

  static getToken(req, res, next) {
    const { email, password } = req.body;
    return UserModel.findOne({ email: email })
      .then((user)=> {
        if (user) {
          user.comparePassword(password, (err, isMatch) => {
            if (isMatch) {
              user.accessToken = jwtUtil.createAccessToken(user);
              return res.status(200).send(user);
            }
            return res.status(400).send({
              message: 'Worng password.'
            });
          });
        } else {
          return res.status(400).send({
            message: 'Not registered.'
          });
        }
      })
      .catch((err)=> {
        return res.status(500).send({
          message: 'Database internal error.'
        });
      });
  }
}