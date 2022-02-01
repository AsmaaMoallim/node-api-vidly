const winston = require("winston");
module.exports = (err, req, res, next) => {
  // logging levels : [error,warn,info,]
  // winston.error();     //most important
  // winston.warn();      //next
  // winston.info();      //next   like connected to the database
  // winston.http();      //next   
  // winston.verbose()    //next   
  // winston.debug();     //next   debugging information 
  // winston.silly();     //next

  winston.error(err);

  res.status(500).send("something wrong happend!!!");
};
