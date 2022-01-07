const data = document.getElementById('demo');
async function getUsersList() {
  try {
    const resp = await axios.get('http://localhost:3000/users');
    // console.log(resp.data);
    // data.innerHTML = '<li>' + resp.data.join('</li><li>') + '</li>';
  } catch (err) {
    console.log(err, 'error on click button');
  }
}
