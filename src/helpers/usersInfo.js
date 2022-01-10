const axios = require('axios');

const userList = async function getUser() {
  console.log('in func');
  try {
    const response = await axios.get('http://localhost:3000/users');
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

const a = userList();

console.log(a, 'a');

module.exports = userList;
