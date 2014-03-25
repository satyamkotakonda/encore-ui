angular.module('constants', [])
    .constant('STATUS_MESSAGES', {
        overview: {
            error: 'There was an error Loading Information'
        },
        payment: {
            error: 'There was an error Posting the Payment Request',
            load: 'Posting Payment',
            success: 'The Payment was Successfully Submitted'
        },
        usage: {
            error: 'There was an error loading Estimated Charges.'
        }
    });
