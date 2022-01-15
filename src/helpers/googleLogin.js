const queryString = require('query-string');
const axios = require('axios');

const googleLoginUrl = () => {
  const stringifiedParams = queryString.stringify({
    client_id: `${process.env.GOOGLE_CLIENT_ID}`,
    redirect_uri: `${process.env.GOOGLE_REDIRECT_URI}`,
    scope: [
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile',
    ].join(' '), // space seperated string
    response_type: 'code',
    access_type: 'offline',
    prompt: 'consent',
  });

  const googleLoginUrl = `https://accounts.google.com/o/oauth2/v2/auth?${stringifiedParams}`;

  return googleLoginUrl;
};

const getGoogleAccessToken = async (code) => {
  const { data } = await axios({
    url: `https://oauth2.googleapis.com/token`,
    method: 'post',
    data: {
      client_id: `${process.env.GOOGLE_CLIENT_ID}`,
      client_secret: `${process.env.GOOGLE_CLIENT_SECRET}`,
      redirect_uri: `${process.env.GOOGLE_REDIRECT_URI}`,
      grant_type: 'authorization_code',
      code,
    },
  });
  return data.access_token;
};

const getGoogleUserInfo = async (access_token) => {
  const { data } = await axios({
    url: 'https://www.googleapis.com/oauth2/v2/userinfo',
    method: 'get',
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });
  console.log(data); // { id, email, given_name, family_name }
  return data.name;
};

module.exports = {
  googleLoginUrl: googleLoginUrl,
  getGoogleAccessToken: getGoogleAccessToken,
  getGoogleUserInfo: getGoogleUserInfo,
};
