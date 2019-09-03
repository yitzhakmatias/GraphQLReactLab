const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookingSchema = new Schema({

        event: {
            type: Schema.Types.ObjectId,
            ref: 'Event'
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: 'user'
        },
        createdAt: {
            type: Date,
            required: true
        },
        updatedAt: {
            type: Date,
            required: true
        }
    },
    {timeStamps: true});

module.exports = mongoose.model('Booking', bookingSchema);
