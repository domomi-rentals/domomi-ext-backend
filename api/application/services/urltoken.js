'use strict';

/**
 * Module dependencies
 */

// Public node modules.'

var urlCrypt = require('url-crypt')("qA?QD[P;4g,#43!P]x6ygV7Zf,hrECwR+;[RXW;u:eN");
//  const URLSafeBase64 = require('urlsafe-base64');
/**
 * URL Token service.
 */

module.exports = {


    /**
     * creates a unique URL safe token from an Object
     * 
     * @param {obj} data 
     * @returns {string} token
     */
    createToken: function(data) {
        // let token = urlCrypt.cryptObj(data);
        console.log("In URL Service");
        // let token = URLSafeBase64.encode(data);
        let token = urlCrypt.cryptObj(data);
        // console.log(token);
        return token;
    },

    

    /**
     * Decodes URL token and returns obj.
     * 
     * @param {string} token 
     * @returns {Obj} data OR {String} if Error
     */
    resolveToken: function(token) {
        try {
            // console.log("In URL token service");
            let data = urlCrypt.decryptObj(token);
            // let data = URLSafeBase64.decode(token);
            return data;
        } catch(err){
            return "Error, could not parse Token";
        }
       
    }

};