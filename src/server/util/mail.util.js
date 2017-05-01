import mg from 'mailgun-js';

const apiKey = process.env.MG_API_KEY;
const domain = process.env.MG_DOMAIN;

const mailgun = mg({ apiKey, domain });

const mailType = {
  default: 'Yetta! 옜다! <no-reply@yetta.co>',
  service: 'Yetta! 옜다! Service Team <support@yetta.co> '
};

const mailTemlplate = {
  welcome: name => `<h1>${name}님 회원가입을 축하합니다</h1>`
};


// TODO : make html template.

const sendMail = (type, to, subject, html) => new Promise((resolve, reject) => {
  const data = {
    from: type,
    to,
    subject,
    html
  };

  mailgun.messages().send(data, (error, body) => {
    if (error) return reject(error);
    return resolve(body);
  });
});

export {
  mailType,
  mailTemlplate,
  sendMail
};
