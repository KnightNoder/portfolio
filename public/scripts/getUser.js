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
