const Event = require('../../models/event');
const User = require('../../models/user');
const Booking = require('../../models/booking');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const transformEvent = (event) => {
    return {
        ...event._doc,
        _id: event.id,
        date: new Date(event._doc.date).toISOString(),
        creator: user.bind(this, event._doc.creator)
    }
};
const transformBooking = (booking) => {
    return {
        ...booking._doc,
        _id: booking.id,
        user: user.bind(this, booking._doc.user),
        event: singleEvent.bind(this, booking._doc.event),
        createdAt: new Date(booking._doc.createdAt).toISOString(),
        updatedAt: new Date(booking._doc.updatedAt).toISOString()
    }
};
const events = async (eventIds) => {
    //  console.log(eventIds);
    try {
        const events = await Event.find({_id: {$in: eventIds}});
        return events.map(event => {
            return {
                ...event._doc,
                _id: event.id,
                date: new Date(event._doc.date).toISOString(),
                creator: user.bind(this, event.creator)
            }
        });

    } catch (err) {
        throw  err;
    }
};
const user = async (userId) => {

    try {
        const user = await User.findById(userId);
        //console.log(user._doc.createdEvents);
        return {
            ...user._doc,
            _id: user._id,
            createdEvents: events.bind(this, user._doc.createdEvents)
        };

    } catch (err) {
        throw  err;
    }
    //console.log(userId + "pepe");

};
const singleEvent = async eventId => {
    try {
        const event = await Event.findById(eventId);
        return {
            ...event._doc,
            _id: event.id,
            creator: user.bind(this, event.creator)
        }

    } catch (e) {
        throw e;
    }
};
module.exports =
    {
        events: async () => {
            try {
                const events = await Event.find();
                return events.map((e) => {
                    return transformEvent(e);
                });
            } catch (e) {
                throw  e;
            }
            //return events;//['test1', 'test2', 'test3']


        },
        createEvent: async (args, req) => {
            if (!req.isAuth) {
                throw new Error('not auth');
            }
            const event = new Event({
                title: args.eventInput.title,
                description: args.eventInput.description,
                price: args.eventInput.price,
                date: new Date(args.eventInput.date),
                creator: req.userId//'5d6d47cf1afa442870f3caeb'
            });
            try {
                let createdEvent;
                const result = await event.save();
                createdEvent = transformEvent(result);

                const creator = await User.findById(req.userId);
                //  console.log(res);
                //    return {...res._doc}
                if (!creator) {
                    throw new Error('User not found')
                }
                creator.createdEvents.push(event);
                await creator.save();
                return createdEvent;
            } catch (e) {
                throw e;
            }

//events.push(event);

        },
        createUser: async args => {

            console.log(args.userInput.email);
            try {
                const usr = User.findOne({email: args.userInput.email});

                if (!usr) {
                    throw new Error('User exists PEPE')
                }
                const hasshPass = await bcrypt.hash(args.userInput.password, 12);
                const user = new User({
                    email: args.userInput.email,
                    password: hasshPass
                });
                const result = await user.save();
                return {...result._doc, password: null, _id: result.id}

            } catch (e) {
                throw e;
            }
        },
        bookings: async (args, req) => {
            if (!req.isAuth) {
                throw new Error('not auth');
            }
            try {
                const bookings = await Booking.find();
                return bookings.map(booking => {
                    return transformBooking(booking)
                });
            } catch (e) {
                throw e;
            }
        },
        bookEvent: async (args, req) => {
            if (!req.isAuth) {
                throw new Error('not auth');
            }
            const fetchedEvent = await Event.findOne({_id: args.eventId});
            const booking = new Booking(
                {
                    user: req.userId,
                    event: fetchedEvent,
                    createdAt: Date.now().toString(),
                    updatedAt: Date.now().toString()
                });
            try {
                const result = await booking.save();
                return transformBooking(result);
            } catch (e) {
                throw e;
            }
        },
        cancelBooking: async (args, req) => {
            if (!req.isAuth) {
                throw new Error('not auth');
            }
            try {
                const booking = await Booking.findById(args.bookingId).populate('event');
                const event = transformEvent(booking.event);
                await Booking.deleteOne({_id: args.bookingId});
                return event
            } catch (e) {
                throw e;
            }
        },
        login: async ({email, password}) => {
            const user = await User.findOne({email: email});
            if (!user) {
                throw  new Error('not valid credentials');
            }
            const isEqual = await bcrypt.compare(password, user.password);
            if (!isEqual) {
                throw  new Error('Invalid credentials');
            }
            //secretKey any key
            const token = jwt.sign({userId: user.id, email: user.email},
                'secretKey',
                {expiresIn: '1h'}
            );
            return {
                userId: user.id,
                token: token,
                tokenExpiration: 1
            }
        }
    };

