import avro from 'avsc';
import kafka from 'kafka-node';

const messageType = avro.parse({
  name: 'messageType',
  type: 'record',
  fields: [
    {
      name: 'id',
      type: 'string'
    }, {
      name: 'timestamp',
      type: 'double'
    }]
});

const topics = {
  USER_FIND_PASSWORD: 'USER_FIND_PASSWORD',
  USER_SIGNIN: 'USER_SIGNIN',
  USER_BLOCK: 'USER_BLOCK',
  USER_UNBLOCK: 'USER_UNBLOCK',

  ORDER_CREATE: 'ORDER_CREATE',
  ORDER_CATCH: 'ORDER_CATCH',
  ORDER_BUY_COMPLETE: 'ORDER_BUY_COMPLETE',
  ORDER_CANCEL: 'ORDER_CANCEL',
  ORDER_FINISH: 'ORDER_FINISH',

  RUNNER_COORDINATE_UPDATE: 'RUNNER_COORDINATE_UPDATE',

  ADMIN_APPROVE_RUNNER: 'ADMIN_APPROVE_RUNNER',
  ADMIN_DISAPPROVE_RUNNER: 'ADMIN_DISAPPROVE_RUNNER',
  ADMIN_BLOCK: 'ADMIN_BLOCK',
  ADMIN_UNBLOCK: 'ADMIN_UNBLOCK'
};

const HighLevelProducer = kafka.HighLevelProducer;
const HighLevelConsumer = kafka.HighLevelConsumer;

const Client = kafka.Client;
const client = new Client('zk.yetta.co:2181', 'graphql-server', {
  sessionTimeout: 5000,
  spinDelay: 1000,
  retries: 0
});

client.on('error', (error) => {
  console.error(error);
});

let producerInstance = null;
let consumerInstance = null;

const startKafkaProducer = (afterKafkaProducerStartCallback) => {
  producerInstance = new HighLevelProducer(client);
  producerInstance.on('ready', () => {
    if (afterKafkaProducerStartCallback) {
      afterKafkaProducerStartCallback();
    }
  });

  producerInstance.on('error', (error) => {
    console.error(error);
  });
};

const startKafkaConsumer = (targetTopics, options, afterKafkaConsumerStartCallback) => {
  consumerInstance = new HighLevelConsumer(client, targetTopics, options);

  consumerInstance.on('error', (err) => {
    console.log('error', err);
  });

  if (afterKafkaConsumerStartCallback) {
    afterKafkaConsumerStartCallback();
  }
};

const produceMessage = (topic, id) => {
  const messageBuffer = messageType.toBuffer({
    id,
    timestamp: Date.now(),
  });

  const payload = [{
    topic,
    messages: messageBuffer,
    // Use GZip compression for the payload
    attributes: 1
  }];
  producerInstance.send(payload, (error) => {
    if (error) {
      console.error(error);
    }
  });
};

const producer = () => producerInstance;
const consumer = () => consumerInstance;

export {
  messageType,
  topics,
  startKafkaProducer,
  startKafkaConsumer,
  produceMessage,
  producer,
  consumer,
};
