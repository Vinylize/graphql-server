import UserModel from '../mongooseSchema/model/user.model';
import jwtUtil from '../util/jwt.util';

export default class UserController {
  static createUser(req, res, next) {
    const { email, name, password } = req.body;
    // UserModel.find({email})
    return UserModel.create({ email, name, password })
      .then((user)=> {
        res.status(201).json({ accessToken: jwtUtil.createAccessToken(user) });
      })
      .catch((err)=> {
        res.status(500).json(err);
      });
  }

  static getToken(req, res, next) {
    const { email, password } = req.body;
    return UserModel.findOne({ email: email })
      .then((user)=> {
        console.log(user);
        if (user) {
          user.comparePassword(password, (err, isMatch) => {
            if (isMatch) {
              return res.status(200).json({ accessToken: jwtUtil.createAccessToken(user) });
            }

            return res.status(400).json({ message: 'Worng password.' });
          });
        } else {
          return res.status(400).json({ message: 'Not registered.' });
        }
      })
      .catch((err)=> {
        console.log(err);
        return res.status(400).json(err.msg);
      });
  }

  static me(req, res, next) {
    const { _id } = req.user;
    return UserModel.findOne({ _id: _id })
      .then((user)=> {
        if (user) {
          res.status(200).json(user);
        } else {
          res.status(400).json({
            message: 'No user'
          });
        }
      })
      .catch((err) => {
        res.status(500).json({
          message: 'Database internal error.'
        });
      });
  }

  static getById(req, res, next) {
    const { id } = req.params;
    return UserModel.findOne({ _id: _id })
      .then((user)=> {
        if (user) {
          res.status(200).json(user);
        } else {
          res.status(400).json({
            message: 'No user'
          });
        }
      })
      .catch((err) => {
        res.status(500).json({
          message: 'Database internal error.'
        });
      });
  }

  // / TODO: Change to in-memory
  static updateMyCoordinate(req, res, next) {
    const { _id } = req.user;
    const { latitude, longitude } = req.body.location;

    return UserModel.findOneAndUpdate({ _id }, { coordinate: [latitude, longitude] })
      .then((user)=> {
        console.log(user.coordinate);
        res.status(200).json({ msg: 'success' });
      })
      .catch((err)=> {
        res.status(500).json(err);
      });
  }

  static getCoordinateById(req, res, next) {
    const { _id } = req.params;
    return UserModel.findOne({ _id })
      .then((user)=> {
        res.status(200).json({ lat: user.coordinate[0], lon: user.coordinate[1] });
      })
      .catch((err)=> {
        res.status(500).json(err);
      });
  }

  static openPort(req, res, next) {
    const { _id } = req.body;
    return UserModel.findOne({ _id })
      .then((user)=> {
        res.status(200).json({ point: user.coordinate });
      })
      .catch((err)=> {
        res.status(500).json(err);
      });
  }
}
