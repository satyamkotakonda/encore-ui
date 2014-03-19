module.exports = [
    //Get Billing Transactions for Account
    {
        request: {
            url: '/api/accounts/billing/(.*)/transactions',
            method: 'GET'
        },
        response : {
            status: 200,
            headers: {
                'content-type': 'application/json'
            },
            file: './test/api-mocks/responses/transactions.json'
        }
    },
    //Get Billing Periods for an account
    {
        request: {
            url: '/api/accounts/billing/(.*)/billing-periods',
            method: 'GET'
        },
        response : {
            status: 200,
            headers: {
                'content-type': 'application/json'
            },
            file: './test/api-mocks/responses/periods.json'
        }
    },
    //Get Available Payment Methods
    {
        request: {
            url: '/api/accounts/payments/(.*)/methods',
            method: 'GET'
        },
        response: {
            status: 200,
            headers: {
                'content-type': 'application/json'
            },
            file: 'test/api-mocks/responses/payment-methods.json'
        }
    },

    //Get Account Info
    {
        request: {
            url: '/api/accounts/billing/(.*)',
            method: 'GET'
        },
        response : {
            status: 200,
            headers: {
                'content-type': 'application/json'
            },
            file: './test/api-mocks/responses/account.json'
        }
    },
    //Post a payment to account
    {
        request: {
            url: '/api/accounts/payments/(.*)',
            method: 'POST'
        },
        response: {
            status: 200,
            headers: {
                'content-type': 'application/json'
            },
            file: 'test/api-mocks/responses/make-payment.json'
        }
    }
];
