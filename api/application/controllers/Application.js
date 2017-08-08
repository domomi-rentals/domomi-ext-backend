'use strict';

const model = 'application';

/**
 * A set of functions called "actions" for `application`
 */

module.exports = {

  /**
   * Get application entries.
   *
   * @return {Object|Array}
   */

  find: function * () {
    this.model = model;
    try {
      let entries = yield strapi.hooks.blueprints.find(this);
      this.body = entries;
    } catch (err) {
      this.body = err;
    }
  },

  /**
   * Get a specific application.
   *
   * @return {Object|Array}
   */

  findOne: function * () {
    this.model = model;
    try {
      let entry = yield strapi.hooks.blueprints.findOne(this);
      this.body = entry;
    } catch (err) {
      this.body = err;
    }
  },

  /**
   * Attach lanlord/contact email to model and send email with pdf.
   *
   * @return {Object}
   */

  validateContact: function * () {
    //Todo: Session Middleware/policy?

    this.model = model;
  

    let email = this.query.email;
    let fname = this.query.fName;
    let lname = this.query.lName;

    // Note: Possibly refactor token code into policy
    let token = this.query.applicationId;
    this.assert(token,400,"No Application token present!");

    let data = strapi.api.application.services.urltoken.resolveToken(token);
    console.dir(data);
    if (typeof data == "string"){ // Could not parse URL token -> Bad request
      this.throw("Error, Invalid Application Token: " + token,400);
    }
    try {
      // console.log(data.appId);
      console.log("Over Here!");
      let application = yield Application.findOne(data.appId);
      if (!application) {
        console.log("No Such Application Found: ", data.appId);
        this.throw(400,"Error, No Such Application Found.");
      } else {
        console.log("Application Found! ", application.id);
        // Update application with contact validated name & email
        let empty = (!application.validatedFname && !application.validatedLname && !application.validatedEmail) ? true : false;
        console.log("EMpty: ",empty);
        if (!empty){
          this.redirect('/renter-info/error.html');
        }
        this.assert(empty, 400, "Contact has already validated email.");
        application.validatedFname = fname; 
        application.validatedLname = lname;
        application.validatedEmail = email;

        let updates = {
          validatedFname: fname,
          validatedLname: lname,
          validatedEmail: email
        }

        // let updatedApp = yield Application.update(application.id.toString(),updates);
        console.log(application.validatedEmail);
        let updatedApp = yield Application.update(application.id,updates);
        this.assert(updatedApp, 400, "Error Updating model!");
        console.log("Updated model successfully");
        
        updatedApp = updatedApp[0]; // Set updatedApp to be first of Update method return array;
        console.log(updatedApp.validatedEmail);
        
        let renter = yield Renter.findOne({
          createdBy: data.user
        });
        console.log(renter);
        this.assert(renter,500,"Error, Renter not Created!");

      
        let filename = renter.fname+"-"+renter.id+".pdf";
        console.log(strapi.api.renter.config.renterTicketPath + "/" + filename);
        let mailOptions = {         
          to: [updatedApp.validatedEmail], // Recipients list.
          subject: 'Renter Ticket!!!',
          text: 'Renter Ticket',
          html: '<p>Hello, here is your requested Homer Renter Ticket!</p>',
          attachment: {
            filename: 'DomoMi.pdf',
            filepath: strapi.api.renter.config.renterTicketPath + "/" + filename 
          }
        };
        let sendEmail = yield strapi.api.application.services.emailapp.sendEmail(mailOptions);
        console.log(sendEmail);
        if (sendEmail.accepted.length > 0){
          this.redirect('/renter-info/success.html');
          // this.body = "Email Sent!";;l
        }else{
          this.redirect('/renter-info/error.html');
          // this.body = "Error sending email.";
        }
        
        // if (sendEmail){
        //   console.dir(sendEmail);
        //   this.body = "Success, Email Sent!";
        // }

        // Services.emailRenterTicket(updatedApp.validatedEmail,data.user);

      }
    } catch (err){
      console.log("Catch Block: ", err);
      this.body = err;
    }
    

     
    // and trigger email to contact with attached renter ticket of data.user
    

  },


  /**
   * Create a application entry.
   *
   * @return {Object}
   */

  create: function * () {
    this.model = model;
    let userId = this.user.id;

    // console.dir(this.request.body);

    this.assert(this.request.body.url,400,"No URL Present on Request");

   
  
    // Create model -> verify?
    // PDF fill form and store securely
    // send response with email info and link to validate contact page
    try {
      //Try see if application already created
      let entry = yield Application.findOne({
        createdBy: userId,
        url: this.request.body.url
      });
      // console.log("Entry: ", entry);
      let applicationId;
      if (!entry){
        console.log("No entry Found -> create new");
        entry = yield Application.create(this.request.body);
        console.log("Created: Entry: ",entry.id);
        applicationId = entry.id;
      }else{ //Entry Found
        applicationId = entry.id;
      }

      if (entry.validationUrl){
          this.body = entry.validationUrl;
          return;
      }
     

      //create token to securely identify user and application.
      let urlData = {user:userId,appId:applicationId}; 
      console.log(urlData);
      let token = strapi.api.application.services.urltoken.createToken(urlData);
      // console.log(token);

      this.assert(token,500,"Error creating Application token");

      // Todo: Return mailto link to validate contact with token as GET querystring
      // let hostURL = "localhost:1337"; // could be hosted on a different domain
      // let hostUrl = "http://ec2-54-149-222-170.us-west-2.compute.amazonaws.com:1337"; // Url not URL
      let hostUrl = "cns.homerchrome.com";
      let validatePageURL = "/renter-info/?id=";

      let returnURL = hostUrl+validatePageURL+token;



      let validationUrl = yield Application.update(applicationId,{validationUrl:returnURL});

      if (validationUrl){
        console.log("Saved Token: ", validationUrl);
      }
      
      this.body = returnURL;

      //this.body = entry;
     
    } catch (err) {
      console.log(err);
      this.body = err;
    }
  },

  /**
   * Update a application entry.
   *
   * @return {Object}
   */

  update: function * () {
    this.model = model;
    try {
      let entry = yield strapi.hooks.blueprints.update(this);
      this.body = entry;
    } catch (err) {
      this.body = err;
    }
  },

  /**
   * Destroy a application entry.
   *
   * @return {Object}
   */

  destroy: function * () {
    this.model = model;
    try {
      let entry = yield strapi.hooks.blueprints.destroy(this);
      this.body = entry;
    } catch (err) {
      this.body = err;
    }
  },

  /**
   * Add an entry to a specific application.
   *
   * @return {Object}
   */

  add: function * () {
    this.model = model;
    try {
      let entry = yield strapi.hooks.blueprints.add(this);
      this.body = entry;
    } catch (err) {
      this.body = err;
    }
  },

  /**
   * Remove a specific entry from a specific application.
   *
   * @return {Object}
   */

  remove: function * () {
    this.model = model;
    try {
      let entry = yield strapi.hooks.blueprints.remove(this);
      this.body = entry;
    } catch (err) {
      this.body = err;
    }
  }
};
