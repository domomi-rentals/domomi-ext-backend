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

    createTickee: function(){
        var pdf = new PDFDocument({
            size: 'LEGAL', // See other page sizes here: https://github.com/devongovett/pdfkit/blob/d95b826475dd325fb29ef007a9c1bf7a527e9808/lib/page.coffee#L69
            info: {
                Title: 'DomoMi',
                Author: 'Some Author',
            }
        });

        // Write stuff into PDF
        pdf.text('Hello World');

        // Stream contents to a file
        pdf.pipe(
            fs.createWriteStream('data/renter-tickets/test_complete.pdf')
        )
            .on('finish', function () {
                console.log('PDF closed');
            });

        // Close PDF and write file.
        pdf.end();

        return pdf;

    },

    createTicket: function (renterInfo) {


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
                                ['Phone Number', renterInfo.phone]
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

        } catch (err) {
            console.log("Error: ", err);
        }
       

    }

    


};