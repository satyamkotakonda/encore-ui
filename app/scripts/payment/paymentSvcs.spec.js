describe('Billing: paymentSvcs', function () {
    var transform, paymentMethods, testData, testError, emptyTransform;
    beforeEach(function () {
        module('billingSvcs');
        module('paymentSvcs');

        inject(function (Transform) {
            transform = Transform('test.path', 'test.error');
            emptyTransform = Transform();
            testData = '{"test":{"path":true}}';
            testError = '{"test":{"path":true,"error":"Error"}}';
            paymentMethods = [{ isDefault: true, id: 'payment-id-1' },
                              { id: 'payment-id-2' },
                              { id: 'payment-id-3' },
                              { id: 'payment-id-4' }];
        });
    });

    it('paymentSvcs Transform should return a function to transform data', function () {
        expect(transform).to.be.a('function');
    });

    it('paymentSvcs Transform should correctly return the values from the parsed object', function () {
        expect(transform(testData)).to.be.eq(true);
        expect(transform(testError)).to.be.eq('Error');
    });

    it('paymentSvcs Transform should return the parsed object if no path is given', function () {
        expect(JSON.stringify(emptyTransform(testData))).to.deep.eq(testData);
    });

});
