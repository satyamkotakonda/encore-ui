describe('UsageFilters', function () {
    var name, usageTotal, productTotal;

    beforeEach(function () {
        module('billingApp');

        inject(function ($filter) {
            name = $filter('ProductName');
            usageTotal = $filter('UsageTotal');
            productTotal = $filter('UsageProductTotal');
        });

    });

    it('ProductName filter should exist', function () {
        expect(name).to.exist;
        expect(name).to.not.be.empty;
    });

    it('ProductName filter should filter results', function () {
        expect(name('DBAAS').length).to.be.eq(15);
        expect(name('DBAAS')).to.be.eq('Cloud Databases');
    });

    it('UsageProductTotal filter should exist', function () {
        expect(productTotal).to.exist;
        expect(productTotal).to.not.be.empty;
    });

    it('UsageProductTotal filter should filter results', function () {
        var data = [
            { offeringCode: 'LBAAS', amount: '100.00' },
            { offeringCode: 'LBAAS', amount: '200.00' },
            { offeringCode: 'LBAAS', amount: '300.00' },
            { offeringCode: 'DBAAS', amount: '700.00' }
        ];

        expect(productTotal(data)[0].name).to.be.eq('LBAAS');
        expect(productTotal(data)[0].total).to.be.eq(600);
    });

    it('UsageProductTotal filter should return nothing if nothing is given', function () {
        expect(_.isEqual(productTotal(), [])).to.be.eq(true);
    });

    it('UsageTotal filter should total the amounts', function () {
        var data = [
            { offeringCode: 'LBAAS', amount: '100.00' },
            { offeringCode: 'LBAAS', amount: '200.00' },
            { offeringCode: 'LBAAS', amount: '300.00' },
            { offeringCode: 'DBAAS', amount: '700.00' }
        ];

        expect(usageTotal(data)).to.be.eq(1300);
    });

    it('UsageTotal filter should return 0 if nothing is given', function () {
        expect(_.isEqual(usageTotal(), 0)).to.be.eq(true);
    });
});
