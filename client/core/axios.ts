import Axios from 'axios';

const instance = Axios.create({
  baseURL: 'http://localhost:3001',
  withCredentials: false
});

export default instance;
