export default class MapController {

  static getEnteredUser(req, res, next) {
    const { bottomLeft, upperRight } = req.body;
    const query = UserModel.find({
      coordinate: {
        $geoWithin: {
          $box: [bottomLeft, upperRight]
        }
      }
    });
    query.exec()
      .then((users) => {
        if (users) return res.status(400).send(users);
        return res.status(200).json(users);
      })
      .catch(err => {
        return res.status(500).json({
          message: 'Database internal error.'
        });
      });
  }

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
}
