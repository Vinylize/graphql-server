import UserModel from '../mongooseSchema/model/user.model';
import jwtUtil from '../util/jwt.util';
import twilioUtil from '../util/twilio.util';

export default class UserController {
  static createUser(req, res, next) {
    const { email, name, password } = req.body;
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
              return res.status(200).send({ accessToken: jwtUtil.createAccessToken(user) });
            }

            return res.status(400).send({ message: 'Worng password.' });
          });
        } else {
          return res.status(400).send({ message: 'Not registered.' });
        }

      })
      .catch((err)=> {
        console.log(err);
        return res.status(500).send(err.msg);
      });
  }

  static requestPhoneValidiation(req, res, next) {
    //create phone secret.
    const code = Math.floor(Math.random() * 9000) + 1000;
    twilioUtil.sendVerificationMessage('+8201077031801', code);
    res.status(200).send({ msg: 'send success.' });

  }

  static checkPhoneValidiation(req, res, next) {
    //check phone secret.
  }
}
