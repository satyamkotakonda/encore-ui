describe('BillingFilters', function () {
    var table, createTransactions;

    beforeEach(function () {
        module('billingApp');

        inject(function ($filter) {
            table = $filter('TransactionTable');
        });
    });
    
    it('TransactionTable filter should exist', function () {
        expect(table).to.exist;
        expect(table).to.not.be.empty;
    });

    it('TransactionTable filter should filter results', function () {
        var actions = createTransactions();
        expect(actions).to.not.be.empty;
        expect(table(actions, { type: 'Payment' }).length).to.be.eq(1);
        expect(table(actions, { status: 'Paid' }).length).to.be.eq(3);
        expect(table(actions, { reference: '76' }).length).to.be.eq(2);
        expect(table(actions, { reference: '0', status: 'Paid' }).length).to.be.eq(2);
        expect(table(actions, { date: '-1' }).length).to.be.eq(5);
    });

    createTransactions = function () {
        var today = new Date(),
            lastMonth = new Date(),
            threeMonth = new Date();
        lastMonth.setMonth(today.getMonth() -1);
        threeMonth.setMonth(today.getMonth() -3);

        return [
            {
                'reference': '50977603',
                'date': lastMonth.toJSON(),
                'type': 'Payment',
                'status': 'Settled',
                'amount': -11.378992513054982,
                'balance': 0
            },
            {
                'reference': '26034609',
                'date': lastMonth.toJSON(),
                'type': 'Reversal',
                'status': 'Paid',
                'amount': 4.12360714841634,
                'balance': 4.12360714841634
            },
            {
                'reference': '59400044',
                'date': lastMonth.toJSON(),
                'type': 'Invoice',
                'status': 'Paid',
                'amount': -11.772235081996769,
                'balance': -7.648627933580428
            },
            {
                'reference': '59896376',
                'date': threeMonth.toJSON(),
                'type': 'Adjustment',
                'status': 'Paid',
                'amount': -7.3051205445081,
                'balance': -14.953748478088528
            },
            {
                'reference': '62985984',
                'date': threeMonth.toJSON(),
                'type': 'Adjustment',
                'status': 'Unpaid',
                'amount': -13.849712662864476,
                'balance': -28.803461140953004
            }
        ];
    };
});