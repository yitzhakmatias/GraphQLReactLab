const Event = require('../../models/event');
const User = require('../../models/user');
const bcrypt = require('bcryptjs');

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

module.exports =
    {
        events: async () => {
            try {
                const events = await Event.find();
                return events.map((e) => {
                    return {
                        ...e._doc,
                        _id: e.id,
                        date: new Date(e._doc.date).toISOString(),
                        creator: user.bind(this, e._doc.creator)
                    }
                });
            } catch (e) {
                throw  e;
            }
            //return events;//['test1', 'test2', 'test3']


        },
        createEvent: async (args) => {
            const event = new Event({
                title: args.eventInput.title,
                description: args.eventInput.description,
                price: args.eventInput.price,
                date: new Date(args.eventInput.date),
                creator: '5d6d47cf1afa442870f3caeb'
            });
            try {
                let createdEvent;
                const result = await event.save();
                createdEvent = {
                    ...result._doc,
                    _id: result._doc._id.toString(),
                    date: new Date(result._doc.date).toISOString(),
                    creator: user.bind(this, result._doc.creator)
                };
                const creator = await User.findById('5d6d47cf1afa442870f3caeb');
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
        }
    };

