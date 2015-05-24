/*global jest, describe, it, jasmine, expect, beforeEach*/

jest.dontMock('../actions/validate.js');

describe('Auth', function() {

    //var React = require('react/addons');
    var validate = require('../actions/validate.js');
    //var TestUtils = React.addons.TestUtils;

    var signup = {
        form: 'signup',
        mail: 'thibaut.duchene@wanadoo.fr',
        password: 'freeride38',
        confirmPassword: 'freeride38'
    };
    var falseSignup = {
        form: 'signup',
        mail: 'thib.du@gmail',
        password: 'wep',
        confirmPassword: 'wep'
    };
    var falseSignup1 = {
        form: 'signup',
        mail: 'thib.duchene@wanadoo.fr',
        password: 'freeride38',
        confirmPassword: 'freeride39'
    };
    // var falseSignup2 = {
    //     form: 'signup',
    //     mail: 'thib.duchene@wanadoo.fr',
    //     password: 'freeride3',
    //     confirmPassword: 'freeride3'
    // };
    var valid = validate.falseSignupDetails(signup);

    it('should valid details against signup', function() {
        expect(valid).toEqual(false);
    });

    var notvalid = validate.falseSignupDetails(falseSignup);

    it('should not valid details against falseSignup', function() {
        expect(notvalid).toEqual(jasmine.any(Object));
    });


    // validate.falseSignupDetails(signup);
    // validate.falseSignupDetails(falseSignup);
    // validate.falseSignupDetails(falseSignup1);
    // validate.falseSignupDetails(falseSignup2);
});
