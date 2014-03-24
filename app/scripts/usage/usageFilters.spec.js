describe('UsageFilters', function () {
    var name, total;

    beforeEach(function () {
        module('billingApp');

        inject(function ($filter) {
            name = $filter('ProductName');
            total = $filter('UsageTotal');
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

    it('UsageTotal filter should exist', function () {
        expect(total).to.exist;
        expect(total).to.not.be.empty;
    });

    it('UsageTotal filter should filter results', function () {
        var data = [
            { offeringCode: 'LBAAS', amount: '100.00' },
            { offeringCode: 'LBAAS', amount: '200.00' },
            { offeringCode: 'LBAAS', amount: '300.00' }
        ];

        expect(total(data)[0].name).to.be.eq('LBAAS');
        expect(total(data)[0].total).to.be.eq(600);
    });

    it('UsageTotal filter should return nothing if nothing is given', function () {
        expect(_.isEqual(total(), [])).to.be.eq(true);
    });
});
