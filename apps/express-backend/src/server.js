const createError = require('http-errors');
const express = require('express');
const path = require('path');
const fileUpload = require('express-fileupload');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');

const indexRouter = require('../routes')
const usersRouter = require('../routes/users');
const authRouter = require('../routes/auth');

const handleErrors = require('../middleware/handleErrors');

const app = express();
app.use(cors());

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/')
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname); // e.g. .jpg, .png, etc.
        const baseName = path.basename(file.originalname, ext);
        const timestamp = Date.now();
        cb(null, `${baseName}-${timestamp}${ext}`);
    }
});

const upload = multer({ storage: storage });

const PORT = process.env.PORT || 3000; // Use environment variable or default to 3000

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


// enable files upload
app.use(fileUpload({
    createParentPath: true,
    useTempFiles: true,
    tempFileDir: '/tmp'
}));

app.use('/downloads', express.static('public/uploads'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: 'true' }));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(`${__dirname}/node_modules/bootstrap/dist`));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// app.use(cors({ credentials: true, origin: false }));
// Then use it before your routes are set up:
app.use('/', indexRouter);
app.use('/api/users', usersRouter);
app.use('/api/auth', authRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
    next(createError(404));
});

// error handler
app.use(handleErrors);

module.exports = app;
