import { io } from 'socket.io-client';

const socket = io('http://localhost:8095');

export default socket;