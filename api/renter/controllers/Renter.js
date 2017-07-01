'use strict';

const model = 'renter';

/**
 * A set of functions called "actions" for `Renter`
 */

module.exports = {

  /**
   * Get Renter entries.
   *
   * @return {Object|Array}
   */

  find: function * () {
    this.model = model;
    try {
      let entry = yield strapi.hooks.blueprints.find(this);
      this.body = entry;
    } catch (err) {
      this.body = err;
    }
  },

  /**
   * Get a specific Renter.
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
   * Create a Renter entry.
   *
   * @return {Object}
   */

  create: function * () {
    this.model = model;
    // console.dir(this.user.renters);
    try {
      let entry = yield strapi.hooks.blueprints.create(this);
      if (entry){
        let pdf = strapi.api.renter.services.ticket.createTicket(entry);
        console.log("PDF Created: ", pdf);
      }
      this.body = entry;
    } catch (err) {
      console.log(err);
      this.body = err;
    }
  },

  /**
   * Update a Renter entry.
   *
   * @return {Object}
   */

  update: function * () {
    this.model = model;
    try {
      let entry = yield strapi.hooks.blueprints.update(this);
      if (entry){
        let pdf = strapi.api.renter.services.ticket.createTicket(entry);
        console.log("PDF Updated: ", entry);
      }
      this.body = entry;
    } catch (err) {
      this.body = err;
    }
  },

  /**
   * Destroy a Renter entry.
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
   * Add an entry to a specific Renter.
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
   * Remove a specific entry from a specific Renter.
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
