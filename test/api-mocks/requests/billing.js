module.exports = [
    //Get Billing Transactions for Account
    {
        request: {
            url: '/api/accounts/12345/transactions',
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
            url: '/api/accounts/12345/billing-periods',
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
    //Get Account Info
    {
        request: {
            url: '/api/accounts/12345',
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
    //Get Available Payment Methods
    {
        request: {
            url: '/api/accounts/12345/methods',
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
    //Post a payment to account
    {
        request: {
            url: '/api/accounts/12345/payment',
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
