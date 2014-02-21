module.exports = [
    {
        request: {
            url: '/api/billing/transactions/12345',
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
    {
        request: {
            url: '/api/12345/billing_periods',
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
    {
        request: {
            url: '/api/billing/account/12345',
            method: 'GET'
        },
        response : {
            status: 200,
            headers: {
                'content-type': 'application/json'
            },
            file: './test/api-mocks/responses/account.json'
        }
    }
];
