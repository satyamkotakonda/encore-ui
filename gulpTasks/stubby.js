var Stubby = require('stubby').Stubby,
    service = new Stubby(),
    mockApi = require('./../test/api-mocks/requests/billing.js');

module.exports = function () {
    service.start({
        stubs: 3000,
        data: mockApi
    }, function (error) {
        if(error) {
            console.error(error);
            throw new Error(error);
        }
    });
};