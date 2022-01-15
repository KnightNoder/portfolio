const queryString = require('query-string');
const axios = require('axios');

const getGithubLoginUrl = () => {
  const params = queryString.stringify({
    client_id: process.env.GITHUB_CLIENT_ID,
    redirect_uri: 'http://localhost:3000/authenticate/github',
    scope: ['read:user', 'user:email'].join(' '), // space seperated string
    allow_signup: true,
  });

  const githubLoginUrl = `https://github.com/login/oauth/authorize?${params}`;

  return githubLoginUrl;
};

const getGithubAccessToken = async (code) => {
  const { data } = await axios({
    url: 'https://github.com/login/oauth/access_token',
    method: 'get',
    params: {
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      redirect_uri: 'http://localhost:3000/authenticate/github',
      code,
    },
  });
  /**
   * GitHub returns data as a string we must parse.
   */
  const parsedData = queryString.parse(data);
  console.log(parsedData); // { token_type, access_token, error, error_description }
  if (parsedData.error) throw new Error(parsedData.error_description);
  return parsedData.access_token;
};

const getGitHubUserData = async (access_token) => {
  const { data } = await axios({
    url: 'https://api.github.com/user',
    method: 'get',
    headers: {
      Authorization: `token ${access_token}`,
    },
  });
  console.log(data); // { id, email, name, login, avatar_url }
  return data.login;
};

module.exports = {
  githubLoginUrl: getGithubLoginUrl,
  getGithubAccessToken: getGithubAccessToken,
  getGithubInfo: getGitHubUserData,
};
