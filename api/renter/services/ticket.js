'use strict';

/**
 * Module dependencies
 */

// Public node modules.

//var pdfFiller = require('node-pdffiller');
var fs = require('fs');
var PDFDocument = require('pdfkit');
// var pdfkitForm = require('pdfkit-form');
var pdfMake = require('pdfmake');


/**
 * Renter ticket service.
 */

module.exports = {

    createTicket: function (renterInfo) {
        console.log(renterInfo);
        renterInfo.hasPets = (renterInfo.hasPets) ? "Yes" : "No";

        try {
            var fonts = {
                Roboto: {
                    normal: 'data/fonts/Roboto-Regular.ttf',
                    bold: 'data/fonts/Roboto-Medium.ttf',
                    italics: 'data/fonts/Roboto-Italic.ttf',
                    bolditalics: 'data/fonts/Roboto-MediumItalic.ttf'
	            }
            };

            let printer = new pdfMake(fonts);
            let docDefinition = {
                content: [
                    {text:'DomoMi Renter Ticket',style:'header'},
                    {text:'The Solution to Renter Verification.',style:'subheader'},
                    {   style: 'tableStyle',
                        layout: 'noBorders',
                        table: {
                            widths: [100, 200],
                            body: [
                                ['First Name', renterInfo.fname],
                                ['Last Name', renterInfo.lname],
                                ['Birthdate', renterInfo.birthdate],
                                ['Phone Number', renterInfo.phone],
                                ['Current Address', renterInfo.address],
                                ['City', renterInfo.city],
                                ['Currently renting', renterInfo.isRenting],
                                ['Reason for moving', renterInfo.whyMove],
                                ['Renter has pets', renterInfo.hasPets]
                            ]
                        }
                    }
                ],

                styles: {
                    header: {
                        fontSize: 22,
                        bold: true,
                        alignment:'center'
                    },
                    subheader: {
                        alignment:'center',
                        margin: [0, 0, 0, 40]
                    },
                    tableStyle: {
                        
                    }
                }
            };
            let path = "data/renter-tickets/";
            let name = renterInfo.fname+"-"+renterInfo.id;
            let pdfDoc = printer.createPdfKitDocument(docDefinition);
            pdfDoc.pipe(fs.createWriteStream(path+name+'.pdf'));
            pdfDoc.end();
            console.log("DONE!");
            return path+name+'.pdf';

        } catch (err) {
            console.log("Error: ", err);
        }
       

    }

    


};