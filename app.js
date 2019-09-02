const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const mongoose = require('mongoose');
const {buildSchema} = require('graphql');
const Event = require('./models/event')

const app = express();
app.use(bodyParser.json());
///Test
/*app.get('/', (req, res, next) => {
    res.send('test');
});*/
const events = [];

app.use('/graphql', graphqlHttp({
    //Signature
    schema: buildSchema(`
        type Event{
           _id: ID!
           title: String!
           description: String!
           price: Float!
           date: String!
        }
        input EventInput{
           title: String!
           description: String!
           price: Float!
           date: String!            
        }
        type RootQuery{
             events: [Event!]!   
        }
        type RootMutation{
              createEvent(eventInput: EventInput): Event    
        }    
        schema{
            query: RootQuery 
            mutation: RootMutation
        }
    `),
    //Implementation
    rootValue: {
        events: () => {
            //return events;//['test1', 'test2', 'test3']
            return Event.find().then((events) => {
                    return events.map((e) => {
                        return {...e._doc}
                    });
                }
            ).catch(err => {

                throw  err;
            });
        },
        createEvent: (args) => {
            /* const event = {
                 _id: Math.random().toString(),
                 title: args.eventInput.title,
                 description: args.eventInput.description,
                 price: args.eventInput.price,
                 date: args.eventInput.date
             };*/
            const event = new Event({
                title: args.eventInput.title,
                description: args.eventInput.description,
                price: args.eventInput.price,
                date: new Date(args.eventInput.date)
            });
            event.save()
                .then((res) => {
                        console.log(res);
                        return {...res._doc}
                    }
                ).catch(err => {
                console.log(err);
                throw  err;
            });
            //events.push(event);
            return event;
        }
    },
    graphiql: true
}));

mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0-emzvw.gcp.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`, {useNewUrlParser: true})
    .then(() => {
        app.listen(3000);
    })
    .catch(err => {
        console.log(err)
    });

/* mutation{
    createEvent(eventInput:{
        title:"first Mongo row",
            description: "appTest",
            price: 12.5,
            date:"2019-09-01T07:38:48.976Z"
    }){
        title
    }
} */


