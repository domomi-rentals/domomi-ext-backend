'use strict';

/**
 * isNewUser policy.
 */

exports.isNewUser = function* (next) {

    // Query to see if user has already created renter info.
    let existing = yield Renter.find({
        "createdBy": this.user.id
    });
    //Yield to controller if nothing is found
    if (!existing.length) {
        yield next;
    } else {
        console.log("Can only create Renter info once!");
        this.status = 409;
        this.body = {
            message: 'Renter details have already been created for this user. Please update instead.'
        };
    }
};