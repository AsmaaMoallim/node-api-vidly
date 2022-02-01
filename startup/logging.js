require("express-async-errors"); // it wraps every router called with a next ... so the error middleware will work becase it comes after everything called...
// the logging of errors
const winston = require("winston");
// after requiring winston
// require("winston-mongodb");

const logger = winston.createLogger({
  // level: process.env.LOG_LEVEL || "info",
  format: winston.format.json(),
  transports: [
    new winston.transports.Console({ colorize: true, prettyPrint: true }),
    new winston.transports.File({ filename: "myLogginFile" }),
    // new winston.transports.MongoDB({ db: "mongodb://localhost/vidly" }),
  ],
  exceptionHandlers: [
    new winston.transports.File({ filename: "exception.log" }),
  ],
  rejectionHandlers: [
    new winston.transports.File({ filename: "rejections.log" }),
  ],
});
// winston.ExceptionHandler.handlers(
//   new winston.transports.Console(
//     { colorize: true, prettyPrint: true },
//     new winston.transports.File({ filename: "myLogginFile.json" }),
//     new winston.transports.MongoDB({ db: "mongodb://localhost/vidly" })
//   )
// );
// // winston.add(new winston.transports.Console({colorize: true , prettyPrint : true}));
// // winston.add(new winston.transports.File({ filename: "myLogginFile.json" })); //here you crete a new transport other than the default one
// winston.add(
//   new winston.transports.MongoDB({ db: "mongodb://localhost/vidly" })
// ); //here you create a new transport other than the default one

// // this is to handell uncaughtExceptions  (only synchrnous)
// process.on("uncaughtException", (ex) => {
//   console.log(ex.message, ex);
//   winston.error(ex.message, ex);
//   process.exit(); // it better to exit and restart with a process manager
// });
// // throw new Error("outside the express..")

// // this is to handell uncaughtExceptions   (asynchrnous)
// process.on("unhandledRejection", (ex) => {
//   console.log(ex.message, ex);
//   winston.error(ex.message, ex);
//   process.exit(); // it better to exit and restart with a process manager
// });

// const e = new Error("just to test rejected promise")
// const p = Promise.reject(e);
// p.then(() => console.error("haha"));

module.exports.logger = logger;
// module.exports.fn = fn;
