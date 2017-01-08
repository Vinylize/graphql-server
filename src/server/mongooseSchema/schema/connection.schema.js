import mongoose from 'mongoose';

const ConnectionSchema = new mongoose.Schema({

  port: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  portPoint: {
    type: [Float],
    required: true,
  },
  type: {
    // Just delivery, delivery after buy something,
    type: String,
    required: true,
  },
  cost: {
    type: Number,
    required: true,
  },
  ship: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  status: {
    type: String,
    default: '',
  },
});

export default ConnectionSchema;
