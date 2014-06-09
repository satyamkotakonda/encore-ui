describe('Billing: billingSvcs', function () {
    var paymentInfo, billInfo, purchaseOrder, poUtil, payment, billErrorResp, msg;
    beforeEach(function () {
        module('constants');
        module('billingSvcs');

        inject(function (PaymentInfo, BillInfo, PurchaseOrder, PurchaseOrderUtil, Payment,
            BillingErrorResponse, STATUS_MESSAGES) {
            paymentInfo = PaymentInfo;
            billInfo = BillInfo;
            purchaseOrder = PurchaseOrder;
            poUtil = PurchaseOrderUtil;
            payment = Payment;
            billErrorResp = BillingErrorResponse;
            msg = STATUS_MESSAGES;
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

    it('billingSvcs PurchaseOrder.disablePO should return PurchaseOrder resource ', function () {
        expect(purchaseOrder.disablePO('12345', '123456')).to.be.instanceof(purchaseOrder);
    });

    it('billingSvcs Payment.makePayment should return Payment resource ', function () {
        expect(payment.makePayment('12345', '1000', 'urn:uuid:aaaaaa')).to.be.instanceof(payment);
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

    it('billingSvcs BillingErrorResponse should return an object of type badRequest', function () {
        var error = billErrorResp({
            status: 400,
            data: {
                badRequest: {
                    message: 'This is a test bad Request'
                }
            }
        });
        expect(error.type).to.be.eq('badRequest');
        expect(error.msg).to.be.eq('This is a test bad Request');
    });

    it('billingSvcs BillingErrorResponse should return an object of type permissionDenied', function () {
        var error = billErrorResp({
            status: 404,
            data: {
                notFound: {
                    message: 'The resource is not found'
                }
            }
        });
        expect(error.type).to.be.eq('permissionDenied');
        expect(error.msg).to.be.eq(msg.permissionDenied);
    });
});