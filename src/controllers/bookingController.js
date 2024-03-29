const { BookingService }  = require('../services/index');
const { StatusCodes } = require('http-status-codes'); 
const { createChannel , publishMessage } = require('../utils/messageQueue');
const { REMINDER_BINDING_KEY } = require('../config/serverConfig');
const bookingService  = new BookingService();

class BookingController {
    async sendMessageToQueue (req,res){
        try{
            const channel = await createChannel();
            const data = {message : 'Success'};
            publishMessage(channel, REMINDER_BINDING_KEY , JSON.stringify(data));
            return res.status(200).json({
                message : 'we have published the message sucessufully'
            });
        }
        catch(error){
            console.log(error);
        }
        
    }
    async create (req , res) {
        try{
            const response  = await bookingService.createBooking(req.body);
            console.log("FROM BOOKING CONTROLLER", response);
            return res.status(StatusCodes.OK).json({
                message: 'Successfully completed booking',
                success: true,
                err: {},
                data: response
            })
        }
        catch(error){
            return res.status(error.statusCode).json({
                message: error.message,
                success: false,
                err: error.explanation,
                data: {}
            });
        }
        
    }
  
}

// const create = async (req , res) => {
//     try{
//         const response  = await bookingService.createBooking(req.body);
//         console.log("FROM BOOKING CONTROLLER", response);
//         return res.status(StatusCodes.OK).json({
//             message: 'Successfully completed booking',
//             success: true,
//             err: {},
//             data: response
//         });
//     }
//     catch(error){
//         return res.status(error.statusCode).json({
//             message: error.message,
//             success: false,
//             err: error.explanation,
//             data: {}
//         });
//     }
    
// }

module.exports = BookingController