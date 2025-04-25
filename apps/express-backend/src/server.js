const createError = require('http-errors');
const { execSync } = require("child_process");
const express = require("express");
const path = require("path");
const fileUpload = require("express-fileupload");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
const multer = require("multer");

const indexRouter = require("../routes");
const usersRouter = require("../routes/users");
const authRouter = require("../routes/auth");
const filesRouter = require("../routes/files");
const systemRouter = require("../routes/system");

const handleErrors = require("../middleware/handleErrors");

const PORT = process.env.PORT || 3000;

const UPLOAD_DIR = path.join(__dirname, '../../uploads');

const app = express();

// **🔹 Function to Kill Any Process Using the Port**
const killPortProcess = (port) => {
    try {
        if (process.platform === "win32") {
            // Windows: Find process using netstat and taskkill
            const pid = execSync(`netstat -ano | findstr :${port}`)
                .toString()
                .split("\n")
                .filter(line => line.includes("LISTEN"))
                .map(line => line.trim().split(/\s+/).pop())[0];

            if (pid) {
                console.log(`🔴 Killing process on port ${port} (PID: ${pid})...`);
                execSync(`taskkill /PID ${pid} /F`);
                console.log(`✅ Process ${pid} on port ${port} killed.`);
            }
        } else {
            // Mac/Linux: Use lsof and kill
            execSync(`fuser -k ${port}/tcp`);
            console.log(`✅ Process on port ${port} killed.`);
        }
    } catch (err) {
        console.log(`⚠️ No process found on port ${port}, starting fresh.`);
    }
};

// **Kill process on port before starting**
killPortProcess(PORT);

app.use(cors());

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, UPLOAD_DIR);
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const base = path.basename(file.originalname, ext);
        cb(null, `${base}-${Date.now()}${ext}`);
    }
});

const upload = multer({ storage: storage });

const server = app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});

// **Gracefully handle process shutdown**
const shutdown = () => {
    console.log("🛑 Shutting down server...");
    server.close(() => {
        console.log("✅ Server shut down. Exiting process.");
        process.exit(0);
    });

    // Force exit if necessary after 5s
    setTimeout(() => {
        console.error("⚠️ Forcefully shutting down...");
        process.exit(1);
    }, 5000);
};

process.on("SIGINT", shutdown);  // Ctrl+C
process.on("SIGTERM", shutdown); // System shutdown
process.on("SIGHUP", shutdown);  // Terminal closed

// Middleware setup
app.use(fileUpload({ createParentPath: true, useTempFiles: true, tempFileDir: "/tmp" }));
app.use("/downloads", express.static("public/uploads"));// serve exactly the same folder Multer writes into:
app.use(
    '/uploads',
    express.static(UPLOAD_DIR)
);


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.static(`${__dirname}/node_modules/bootstrap/dist`));
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/api/users", usersRouter);
app.use("/api/auth", authRouter);
app.use("/api/files", filesRouter);
app.use("/api/system", systemRouter);

// Catch 404 errors
app.use((req, res, next) => {
    next(createError(404));
});

// Error handling middleware
app.use(handleErrors);

module.exports = app;
