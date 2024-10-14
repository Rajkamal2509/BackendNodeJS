

const express = require('express');
const path = require('path');
const cors = require('cors');
const app = express();
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const counters = {};
const expressJson = express.json(); 
const bodyParserJson  = express.urlencoded({extended: true ,limit: '50mb'}); 
const bodyParser = require('body-parser')

// app.use([expressJson, bodyParserJson]);
global.__basedir = __dirname;
// var options = {
//   explorer: true
// };

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


app.use(cors(), function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization");
    next();
});
// app.use(express.json({ limit: '50mb' }));
// app.use(
//     express.urlencoded({
//         extended: true,
        // limit: '50mb'
//     })
// );

app.use(express.json({limit: '50mb'}));
app.use(bodyParser.json({limit :'100mb'}))
app.use(bodyParser.urlencoded({ extended: true, limit: '100mb' ,parameterLimit: 1000000 }))
app.use(cors({origin: true, credentials: true}));


    // const app = express();
    // app.enable('trust proxy');
    // app.use(expressSession({ secret: 'secret', resave: false, saveUninitialized: true }));
    // app.use(expressVisitorCounter({ hook: counterId => counters[counterId] = (counters[counterId] || 0) + 1 }));
    // app.get('/', (req, res, next) => res.json(counters));

    app.get('/', (req, res, next) =>{
        res.status(200).json({
            message: "Hello World"
        })
    });
  
app.use("/public", express.static(path.join(__dirname, 'public')));
const models = require('./database/models');
const { env } = require('process');
models.sequelize.sync();
require('./routes')(app);

const port = 9006;
app.listen(port, () => {
    console.log(`Server is listening on port ${port}!`);
});