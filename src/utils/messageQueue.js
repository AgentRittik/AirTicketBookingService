const amqplib = require('amqplib');
const { MESSAGE_BROKER_URL,EXCHANGE_NAME } = require('../config/serverConfig');

const createChannel = async() => {
    try{
        //setup the connection message broker i.e rabbitMQ
        const connection = await amqplib.connect(MESSAGE_BROKER_URL);
        //this broker has many queues so we setup the channel
        const channel = await connection.createChannel();

        // assertion of queue -> done because whatever the queue you are connection does actually exist oe not 
        //assert exchange -> once the channel is setup the message broker also help us to distribute the message between the queue
        // because you not only maintain only one queue .  we maintain multiple queue
        await channel.assertExchange(EXCHANGE_NAME ,'direct' , false);
        return channel;
    }
    catch(error){
        console.log(error);
    }
}

const subscribeMessage = async(channel , service , binding_key) =>  {
    try{
        const applicationQueue = await channel.assertQueue('QUEUE_NAME');
        channel.bindQueue(applicationQueue.queue ,EXCHANGE_NAME ,binding_key);
        channel.consume(applicationQueue.queue , msg =>{
            console.log('recieved data');
            console.log(msg.content.toString());
            channel.ack(msg);
        });
    }
    catch(error){
        throw error;
    }
    
}

const publishMessage = async(channel, binding_key , message) => {
    try{
        await channel.assertQueue('QUEUE_NAME');
        await channel.publish(EXCHANGE_NAME , binding_key , Buffer.from(message));
    }
    catch(error){
        throw error;
    }
}

module.exports = {
    subscribeMessage,
    createChannel,
    publishMessage
}