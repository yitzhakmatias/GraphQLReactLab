const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const mongoose = require('mongoose');
const graphQlSchema= require('./graphql/schema/index');
const graphQlResolvers= require('./graphql/resolvers/index');

const app = express();



app.use(bodyParser.json());
///Test
/*app.get('/', (req, res, next) => {
    res.send('test');
});*/


//const events = [];



app.use('/graphql', graphqlHttp({
    //Signature
    schema: graphQlSchema,
    //Implementation
    rootValue: graphQlResolvers,
    graphiql: true
}));
//Connect to db
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
}
mutation{
  createUser(userInput:{email:"test@gmail.com",password:"test"}){
    email,
    password
  }
}
*/


