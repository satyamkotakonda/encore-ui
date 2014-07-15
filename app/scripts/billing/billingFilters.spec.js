describe('BillingFilters', function () {
    var table, currencySuffix, currentPO, closedPO, createTransactions, tranType;

    var purchaseOrders;

    beforeEach(function () {
        module('billingApp');

        inject(function (TransactionTableFilter, CurrencySuffixFilter,
            CurrentPurchaseOrderFilter, ClosedPurchaseOrdersFilter, TransactionTypeFilter) {
            table = TransactionTableFilter;
            currencySuffix = CurrencySuffixFilter;
            currentPO = CurrentPurchaseOrderFilter;
            closedPO = ClosedPurchaseOrdersFilter;
            tranType = TransactionTypeFilter;

            purchaseOrders = [{
                'poNumber': '1234567',
                'startDate': '2014-05-16Z'
            }, {
                'poNumber': '929292',
                'startDate': '2014-05-16Z',
                'endDate': '2014-05-16Z',
            }];
        });
    });

    it('TransactionTable filter should exist', function () {
        expect(table).to.exist;
        expect(table).to.not.be.empty;
    });

    it('TransactionTable filter should return same number of rows passed when no filter applied', function () {
        var actions = createTransactions();
        expect(table(actions).length).to.eq(actions.length);
    });

    it('TransactionTable filter should filter results', function () {
        var actions = createTransactions(),
            now = new Date(),
            startTestDate = new Date(now.getFullYear(), now.getMonth(), now.getDate()),
            endTestDate = new Date(startTestDate);

        startTestDate.setMonth(now.getMonth() - 1);
        endTestDate.setMonth(now.getMonth() - 3);

        expect(actions).to.not.be.empty;
        expect(table(actions, { type: 'Payment' }).length).to.eq(3);
        expect(table(actions, { type: 'ADJUSTMENT' }).length).to.eq(3);
        expect(table(actions, { status: 'Paid' }).length).to.eq(5);
        expect(table(actions, { reference: '76' }).length).to.eq(2);
        expect(table(actions, { reference: '0', status: 'Paid' }).length).to.eq(4);
        expect(table(actions, { period: '-1' }).length).to.eq(4);
        expect(table(actions, { period: '-3' }).length).to.eq(9);
        expect(table(actions, { period: startTestDate.toJSON() }).length).to.eq(4);
        expect(table(actions, { period: endTestDate.toJSON() }).length).to.eq(9);
        expect(table(actions, { period: startTestDate.toJSON() + '|' + endTestDate.toJSON() }).length).to.eq(8);
    });

    it('CurrencySuffix filter should exist', function () {
        expect(currencySuffix).to.exist;
        expect(currencySuffix).to.not.be.empty;
    });

    it('CurrencySuffix filter should format number values into their prefixed forms', function () {
        expect(currencySuffix(2124)).to.eq('$2,124.00');
        expect(currencySuffix(381492513)).to.eq('$381.49m');
        expect(currencySuffix(25145)).to.eq('$25.15k');
        expect(currencySuffix(12315100000)).to.eq('$12.32b');
        expect(currencySuffix(-1359314.12)).to.eq('($1.36)m');
    });

    it('CurrentPurchaseOrder filter should exist', function () {
        expect(currentPO).to.exist;
        expect(currentPO).to.not.be.empty;
    });

    it('CurrentPurchaseOrder filter should return the current purchase order', function () {
        expect(currentPO(purchaseOrders)).to.be.an.object;
    });

    it('ClosedPurchaseOrder filter should exist', function () {
        expect(closedPO).to.exist;
        expect(closedPO).to.not.be.empty;
    });

    it('ClosedPurchaseOrder filter should filter results by those that are not current', function () {
        expect(closedPO(purchaseOrders).length).to.eq(1);
        expect(_.first(closedPO(purchaseOrders))).to.be.an.object;
    });

    it('TransactionType filter should return the transaction type in lowercase + plural form', function () {
        expect(tranType('INVOICE')).to.eq('invoices');
        expect(tranType('PAYMENT')).to.eq('payments');
        expect(tranType('REVERSAL')).to.eq('reversals');
        expect(tranType('REFUND')).to.eq('refunds');
    });

    it('TransactionType filter should properly format write off trantype', function () {
        expect(tranType('WRITE OFF')).to.eq('writeoffs');
    });

    it('TransactionType filter should handle adjustment transaction types', function () {
        expect(tranType('CREDIT')).to.eq('adjustments');
        expect(tranType('DEBIT')).to.eq('adjustments');
    });

    it('TransactionType filter not add an extra plural "s" if the trantype is already plural', function () {
        expect(tranType('INVOICES')).to.not.eq('invoicess');
        expect(tranType('payments')).to.eq('payments');
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
                'tranRefNum': '81931301',
                'date': today.toJSON(),
                'type': 'Payment',
                'status': 'Settled',
                'amount': -11.378992513054982,
                'balance': 0
            },
            {
                'tranRefNum': '50977603',
                'date': lastMonth.toJSON(),
                'type': 'Payment',
                'status': 'Settled',
                'amount': -11.378992513054982,
                'balance': 0
            },
            {
                'tranRefNum': '26034609',
                'date': lastMonth.toJSON(),
                'type': 'Reversal',
                'status': 'Paid',
                'amount': 4.12360714841634,
                'balance': 4.12360714841634
            },
            {
                'tranRefNum': '59400044',
                'date': lastMonth.toJSON(),
                'type': 'Invoice',
                'status': 'Paid',
                'amount': -11.772235081996769,
                'balance': -7.648627933580428
            },
            {
                'tranRefNum': '98975138',
                'date': lastMonth1Day.toJSON(),
                'type': 'Payment',
                'status': 'Settled',
                'amount': -5.772235081996769,
                'balance': -4.648627933580428
            },
            {
                'tranRefNum': '72341094',
                'date': lastMonth1Day.toJSON(),
                'type': 'Invoice',
                'status': 'Paid',
                'amount': -1.772235081996769,
                'balance': -1.648627933580428
            },
            {
                'tranRefNum': '41400002',
                'date': lastMonth1Day.toJSON(),
                'type': 'CREDIT',
                'status': 'Paid',
                'amount': -31.772235081996769,
                'balance': -3.648627933580428
            },
            {
                'tranRefNum': '59896376',
                'date': threeMonth.toJSON(),
                'type': 'DEBIT',
                'status': 'Paid',
                'amount': -7.3051205445081,
                'balance': -14.953748478088528
            },
            {
                'tranRefNum': '62985984',
                'date': threeMonth.toJSON(),
                'type': 'CREDIT',
                'status': 'Unpaid',
                'amount': -13.849712662864476,
                'balance': -28.803461140953004
            }
        ];
    };
});
