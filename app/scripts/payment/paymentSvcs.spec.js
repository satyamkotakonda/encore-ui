describe('PaymentFormURI', function () {
    var PaymentFormURI, Environment;
    var path = '/v1/forms/method_capture?sessionId=';
    beforeEach(function () {
        module('paymentSvcs');

        inject(function (_Environment_, _PaymentFormURI_) {
            PaymentFormURI = _PaymentFormURI_;
            Environment = _Environment_;
        });

        sinon.stub(Environment, 'get');
    });

    afterEach(function () {
        Environment.get.restore();
    });

    it('should get an instance of PaymentFormURI', function () {
        expect(PaymentFormURI).to.not.be.undefined;
    });

    it('should return staging endpoint in staging env', function () {
        Environment.get.returns({ name: 'staging' });
        expect(PaymentFormURI()).to.eq('https://staging.forms.payment.api.rackspacecloud.com' + path);
    });

    it('should return dev endpoint in dev env', function () {
        Environment.get.returns({ name: 'local' });
        expect(PaymentFormURI()).to.eq('https://staging.forms.payment.pipeline2.api.rackspacecloud.com' + path);
    });

    it('should return production endpoint in prod env', function () {
        Environment.get.returns({ name: 'unified-prod' });
        expect(PaymentFormURI()).to.eq('https://forms.payment.api.rackspacecloud.com' + path);
    });
});

describe('PaymentSession', function () {
    var $resource, Session, PaymentSession;
    beforeEach(function () {
        module('paymentSvcs');

        inject(function (_$resource_, _Session_, _PaymentSession_) {
            $resource = _$resource_;
            Session = _Session_;
            PaymentSession = _PaymentSession_;
        });
    });

    it('should successfully POST a constructed session body', function () {
        var data = {
            'session': {
                'ran': '020-1234',
                'postbackURL': 'test.com'
            }
        };
        var spy = sinon.spy(PaymentSession, 'save');
        PaymentSession.create('1234', 'test.com');
        expect(spy).to.have.been.calledWith({}, data);
    });
});
