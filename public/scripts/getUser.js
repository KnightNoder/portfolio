const data = document.getElementById('demo');
async function getUsersList() {
  try {
    const resp = await axios.get('/users');
    console.log(resp.data);

    var str = '<ul>';

    resp.data.forEach(function (ele) {
      str += '<li>' + ele.name + '</li> </br>';
    });

    str += '</ul>';
    document.getElementById('slideContainer').innerHTML = str;
    // data.innerHTML = '<li>' + resp.data.join('</li><li>') + '</li>';
  } catch (err) {
    console.log(err, 'error on click button');
  }
}

const GetJoke = async () => {
  const resp = await axios.get(`${GET_JOKE_URL}`);
  if (resp.data.setup && resp.data.delivery) {
    document.getElementById('first_line').innerHTML = resp.data.setup;
    document.getElementById('second_line').innerHTML = resp.data.delivery;
  }
};

setInterval(() => {
  GetJoke();
}, 10000);
