angular.module('constants', [])
    .constant('STATUS_MESSAGES', {
        overview: {
            error: 'There was an error loading Account Information'
        },
        transactions: {
            error: 'There was an error loading Account Transactions'
        },
        payment: {
            error: 'There was an error Posting the Payment Request',
            load: 'Posting Payment',
            success: 'The Payment was successfully Submitted'
        },
        changeDefault: {
            error: 'There was an error Changing the Default Payment',
            load: 'Changing Default Payment',
            success: 'The Default Payment Method was successfully Changed'
        },
        usage: {
            error: 'There was an error loading Estimated Charges.'
        }
    });