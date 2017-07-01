'use strict';

/**
 * Module dependencies
 */

// Public node modules.
const _ = require('lodash');
const nodemailer = require('nodemailer');

/**
 * Email Contact service.
 */

module.exports = {


    sendEmail: function* (emailObj) {


        console.log("Ok in the Fn!");
        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
            // host: 'smtp.gmail.com',
            // port: 465,
            // secure: true, // secure:true for port 465, secure:false for port 587
            service: 'Gmail',
            auth: {
                user: "no-reply@domomi.com",
                pass: "nomo-reply123"
            }

        });

        

        // setup email data with unicode symbols
        let mailOptions = {
            from: '<no-reply@domomi.com>', // sender address
            to: emailObj.to, // list of receivers
            subject: emailObj.subject, // Subject line
            text: emailObj.text, // plain text body
            html: emailObj.html // html body
        };

        if (emailObj.hasOwnProperty("attachment")) {
            console.log("TRUE!");
            mailOptions.attachments = [{   // file on disk as an attachment
                filename: emailObj.attachment.filename,
                path: emailObj.attachment.filepath // stream this file
            }];
        }

        console.log(mailOptions.attachments);

        // TODO: ADD emails to database.
        return transporter.sendMail(mailOptions);

    }



};