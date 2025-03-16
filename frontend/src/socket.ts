import { io } from 'socket.io-client';

const URL = 'https://synergy-0evb.onrender.com:4000';
const socket = io(URL);

export default socket;
