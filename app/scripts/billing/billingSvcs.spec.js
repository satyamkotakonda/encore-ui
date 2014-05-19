describe('Billing: billingSvcs', function () {
    var paymentInfo, billInfo, purchaseOrder, poUtil;
    beforeEach(function () {
        module('billingSvcs');

        inject(function (PaymentInfo, BillInfo, PurchaseOrder, PurchaseOrderUtil) {
            paymentInfo = PaymentInfo;
            billInfo = BillInfo;
            purchaseOrder = PurchaseOrder;
            poUtil = PurchaseOrderUtil;
        });
    });

    it('billingSvcs PaymentInfo.updateNotificationOption should return PaymentInfo resource ', function () {
        expect(paymentInfo.updateNotificationOption({ id: '12345' }, 'OPT_IN')).to.be.instanceof(paymentInfo);
    });

    it('billingSvcs BillInfo.updateInvoiceDeliveryMethod should return BillInfo resource ', function () {
        expect(billInfo.updateInvoiceDeliveryMethod({ id: '12345' }, 'PAPERLESS')).to.be.instanceof(billInfo);
    });

    it('billingSvcs PurchaseOrder.createPO should return PurchaseOrder resource ', function () {
        expect(purchaseOrder.createPO('12345', '123456')).to.be.instanceof(purchaseOrder);
    });

    it('billingSvcs PurchaseOrderUtil.isCurrent should return true if current PO ', function () {
        expect(poUtil.isCurrent({
            startDate: '2014-04-04',
            poNumber: '123456'
        }, true)).to.be.true;
    });

    it('billingSvcs PurchaseOrderUtil.isCurrent should return false if no valid PO passed ', function () {
        expect(poUtil.isCurrent()).to.be.false;
    });
});