const axios = require('axios');

async function getUser() {
  try {
    const response = await axios.get('http://localhost:3000/users');
    console.log(response.data);
  } catch (error) {
    console.error(error);
  }
}

getUser();
