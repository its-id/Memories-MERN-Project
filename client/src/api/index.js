import axios from 'axois';

const url = "http://localhost:5000/posts";


export const fetchPosts = () => axios.get(url);