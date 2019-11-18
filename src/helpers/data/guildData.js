import axios from 'axios';

const getGuildData = () => new Promise((resolve, reject) => {
  axios.get('https://cors-anywhere.herokuapp.com/https://swgoh.gg/api/guild/4268/')
    .then((res) => {
      resolve(res.data);
    })
    .catch((err) => reject(err));
});

export default { getGuildData };
