describe('BillingFilters', function () {
    var table, currencySuffix, createTransactions;

    beforeEach(function () {
        module('billingApp');

        inject(function ($filter) {
            table = $filter('TransactionTable');
            currencySuffix = $filter('CurrencySuffix');
        });
    });

    it('TransactionTable filter should exist', function () {
        expect(table).to.exist;
        expect(table).to.not.be.empty;
    });

    it('TransactionTable filter should filter results', function () {
        var actions = createTransactions(),
            now = new Date(),
            startTestDate = new Date(now.getFullYear(), now.getMonth(), now.getDate()),
            endTestDate = new Date(startTestDate);

        startTestDate.setMonth(now.getMonth() - 1);
        endTestDate.setMonth(now.getMonth() - 3);

        expect(actions).to.not.be.empty;
        expect(table(actions, { type: 'Payment' }).length).to.be.eq(3);
        expect(table(actions, { status: 'Paid' }).length).to.be.eq(5);
        expect(table(actions, { reference: '76' }).length).to.be.eq(2);
        expect(table(actions, { reference: '0', status: 'Paid' }).length).to.be.eq(4);
        expect(table(actions, { period: '-1' }).length).to.be.eq(4);
        expect(table(actions, { period: '-3' }).length).to.be.eq(9);
        expect(table(actions, { period: startTestDate.toJSON() }).length).to.be.eq(4);
        expect(table(actions, { period: endTestDate.toJSON() }).length).to.be.eq(9);
        expect(table(actions, { period: startTestDate.toJSON() + '|' + endTestDate.toJSON() }).length).to.be.eq(8);

    });

    it('CurrencySuffix filter should exist', function () {
        expect(currencySuffix).to.exist;
        expect(currencySuffix).to.not.be.empty;
    });

    it('CurrencySuffix filter should format number values into their prefixed forms', function () {
        expect(currencySuffix(2124)).to.be.eq('$2,124.00');
        expect(currencySuffix(381492513)).to.be.eq('$381.49m');
        expect(currencySuffix(25145)).to.be.eq('$25.15k');
        expect(currencySuffix(12315100000)).to.be.eq('$12.32b');
        expect(currencySuffix(-1359314.12)).to.be.eq('($1.36)m');
    });

    createTransactions = function () {
        var today = new Date(),
            lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate()),
            lastMonth1Day = new Date(lastMonth),
            threeMonth = new Date();
        lastMonth1Day.setHours(lastMonth.getHours() - lastMonth.getTimezoneOffset() / 60);
        lastMonth1Day.setSeconds(lastMonth.getSeconds() - 1);
        threeMonth.setMonth(today.getMonth() - 3);

        return [
            {
                'reference': '81931301',
                'date': today.toJSON(),
                'type': 'Payment',
                'status': 'Settled',
                'amount': -11.378992513054982,
                'balance': 0
            },
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
                'reference': '98975138',
                'date': lastMonth1Day.toJSON(),
                'type': 'Payment',
                'status': 'Settled',
                'amount': -5.772235081996769,
                'balance': -4.648627933580428
            },
            {
                'reference': '72341094',
                'date': lastMonth1Day.toJSON(),
                'type': 'Invoice',
                'status': 'Paid',
                'amount': -1.772235081996769,
                'balance': -1.648627933580428
            },
            {
                'reference': '41400002',
                'date': lastMonth1Day.toJSON(),
                'type': 'Adjustment',
                'status': 'Paid',
                'amount': -31.772235081996769,
                'balance': -3.648627933580428
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
