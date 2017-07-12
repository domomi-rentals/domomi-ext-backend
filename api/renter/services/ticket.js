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
 *
 */

module.exports = {

    createTicket: function (renterInfo) {
        console.log(renterInfo);

        let contactHeader = [{ text: 'First Name', style: 'tableHeader' }, { text: 'Last Name', style: 'tableHeader' }, { text: 'Phone', style: 'tableHeader' }, { text: 'Email', style: 'tableHeader' }];
        let contactBody = [renterInfo.fname, renterInfo.lname, renterInfo.phone, renterInfo.createdBy.email];

        let financeHeader = ['Annual Income', 'Occupation', 'Employment History']; // If financially supported -> add header
        let financeBody = [renterInfo.annualIncome, renterInfo.occupation, renterInfo.linkedinUrl];
        if (renterInfo.annualIncome == '0-10k'){
            financeHeader = ['Annual Income', 'Occupation', 'Financially Supported', 'Employment History']; // If financially supported -> add header
            financeBody = [renterInfo.annualIncome, renterInfo.occupation, 'Yes', renterInfo.linkedinUrl];
        }
        

        let rentalHeader = ['Roommates', 'Pets', 'Parking'];
        let roommates = (renterInfo.roommates) ? renterInfo.roommates : 'None';
        let pets = (renterInfo.pets) ? renterInfo.pets : 'None';
        let parking = (renterInfo.parking) ? renterInfo.parking : 'None';
        let rentalBody = [roommates, pets, parking];

        var dd = {
            content: [
                { text: 'DomoMi Renter Ticket', style: 'header' },
                { text: 'Universal Rental Services', style: 'subheader' },
                { text: 'Contact Details', style: 'h2', margin: [0, 20, 0, 8] },
                {
                    style: 'tableStyle',
                    table: {
                        body: [
                            contactHeader,
                            contactBody
                        ]
                    },
                    layout: {
                        hLineWidth: function (i, node) {
                            return (i === 0 || i === node.table.body.length) ? 2 : 1;
                        },

                        vLineWidth: function (i, node) {
                            return (i === 0 || i === node.table.widths.length) ? 0 : 1;
                        },

                        hLineColor: function (i, node) {
                            return (i === 0 || i === node.table.body.length) ? 'black' : 'gray';
                        },

                        vLineColor: function (i, node) {
                            return (i === 0 || i === node.table.widths.length) ? 'black' : 'gray';
                        },
                    },
                },

                { text: 'Financial Integrity', style: 'h2', margin: [0, 60, 0, 8] },
                {
                    style: 'tableStyle',
                    table: {
                        body: [
                            financeHeader,
                            financeBody
                        ]
                    },
                    layout: {
                        hLineWidth: function (i, node) {
                            return (i === 0 || i === node.table.body.length) ? 2 : 1;
                        },

                        vLineWidth: function (i, node) {
                            return (i === 0 || i === node.table.widths.length) ? 0 : 1;
                        },

                        hLineColor: function (i, node) {
                            return (i === 0 || i === node.table.body.length) ? 'black' : 'gray';
                        },

                        vLineColor: function (i, node) {
                            return (i === 0 || i === node.table.widths.length) ? 'black' : 'gray';
                        },
                    },
                },

                { text: 'Employment History has variable reliability and requires a complete profile review for tenant insurance eligibility.', style: 'quote' },

                { text: 'Rental Conditions', style: 'h2', margin: [0, 60, 0, 8] },
                {
                    style: 'tableStyle',
                    table: {
                        body: [
                            rentalHeader,
                            rentalBody
                        ]
                    },
                    layout: {
                        hLineWidth: function (i, node) {
                            return (i === 0 || i === node.table.body.length) ? 2 : 1;
                        },

                        vLineWidth: function (i, node) {
                            return (i === 0 || i === node.table.widths.length) ? 0 : 1;
                        },

                        hLineColor: function (i, node) {
                            return (i === 0 || i === node.table.body.length) ? 'black' : 'gray';
                        },

                        vLineColor: function (i, node) {
                            return (i === 0 || i === node.table.widths.length) ? 'black' : 'gray';
                        },
                    },
                },
                { text: 'Tenants may consider negotiating rental conditions.', style: 'quote' },
                { text: 'CONSENT: For purpose of determining whether this Renter Ticket is acceptable, the Applicant consents to Domomi Rentals ("DomoMi") Ltd. obtaining credit, personal and employment information on the Applicant from one or more consumer reporting agencies and from other sources of such information. The Applicant authorizes the reporting agencies and any other person, including personnel from any government agency, to disclose relevant information about the Applicant to the Landlord. If this Application is accepted, the Applicant understands that the above information may also be used and disclosed for responding to emergencies, ensuring the orderly management of the tenancy and complying with legal requirements. This Application does not form a "Tenancy". E.&O.E.', style: 'quote', margin: [0, 60, 0, 8] }
            ],
            styles: {
                header: {
                    fontSize: 22,
                    bold: true,
                    alignment: 'center'
                },
                h2: {
                    fontSize: 15,
                    bold: true,
                    alignment: 'auto'
                },
                quote: {
                    fontSize: 8,
                    italics: true,
                    alignment: 'left'
                },
                subheader: {
                    alignment: 'center',
                    margin: [0, 0, 0, 40]
                },
            },
            tableHeader: {
                bold: true,
                fontSize: 13,
                color: '#C6C7'
            }
        }


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
                    { text: 'DomoMi Renter Ticket', style: 'header' },
                    { text: 'The Solution to Renter Verification.', style: 'subheader' },
                    {
                        style: 'tableStyle',
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
                                ['Renter has pets', renterInfo.pets]
                            ]
                        }
                    }
                ],

                styles: {
                    header: {
                        fontSize: 22,
                        bold: true,
                        alignment: 'center'
                    },
                    subheader: {
                        alignment: 'center',
                        margin: [0, 0, 0, 40]
                    },
                    tableStyle: {

                    }
                }
            };
            let path = "data/renter-tickets/";
            let name = renterInfo.fname + "-" + renterInfo.id;
            let pdfDoc = printer.createPdfKitDocument(dd);
            pdfDoc.pipe(fs.createWriteStream(path + name + '.pdf'));
            pdfDoc.end();
            console.log("DONE!");
            return path + name + '.pdf';

        } catch (err) {
            console.log("Error: ", err);
        }


    }




};