import { Server } from 'socket.io';
import productModel from "../model/products.model.js";


function configureSocket(server) {
    const io = new Server(server);

    io.on('connection', async (socket) => {
        console.log('WebSocket endpoint: A user has connected');
        const products = await productModel.find();
        socket.emit('realTimeProducts', products); 
    
        socket.on('update', async (data) => {
            console.log('WebSocket endpoint: Updating products');
            const products = await productModel.find();
            socket.emit('realTimeProducts', products); 
        });
    });
}

export default configureSocket;
