//library imports
require("dotenv").config({ path: "./.env" });
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

//controller imports
const { createStudent, getStudent } = require("./controller/studentController")
const { createTeacher, getTeacher } = require("./controller/teacherController")

//router imports
const { studentRouter } = require("./router/studentRouter");
const { teacherRouter } = require("./router/teacherRouter")

//middleware imports
const { verifyTokenLogin } = require("./middleware/verifyToken");

//env imports
const PORT = process.env.PORT || 8000;
const MONGODBURL = process.env.MONGODBURL;

//other consts expressions
const app = express();

//middleware
app.use(helmet());
app.use(cors({
    origin: "*",
    exposedHeaders: ['x-auth-token'],
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Rate limiting — max 20 requests per 15 minutes on auth routes
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    message: { message: "Too many requests, please try again later." },
    standardHeaders: true,
    legacyHeaders: false,
});

//routings
app.use("/student", studentRouter);
app.use("/teacher", teacherRouter);

app.get("/", (req, res) => {
    res.json({ message: "CertifyHub API is live and running", status: "healthy" });
});
app.get("/test", (req, res) => { res.send("server healthy") });
app.post("/verify", verifyTokenLogin);

//todo
app.post("/teacherLogin", authLimiter, getTeacher)
app.post("/studentLogin", authLimiter, getStudent)
app.post("/createTeacher", authLimiter, createTeacher)

// Global error handler
app.use((err, req, res, next) => {
    console.error("Unhandled error:", err);
    res.status(500).send({ message: "Internal server error", error: err.message });
});

const startServer = async () => {
    try {
        await mongoose.connect(`${MONGODBURL}`);
        console.log("Database connected successfully");

        app.listen(PORT, "0.0.0.0", () => {
            console.log(`server started on http://localhost:${PORT}`);
        })
    } catch (err) {
        console.error("failed to start server\n", err);
    }
}

startServer();



