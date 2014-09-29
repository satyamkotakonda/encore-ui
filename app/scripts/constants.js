angular.module('constants', [])
    .constant('STATUS_MESSAGES', {
        permissionDenied: 'Permission Denied',
        overview: {
            error: 'There was an error loading Account Information'
        },
        transactions: {
            error: 'There was an error loading Account Transactions',
            search: 'Searching for account'
        },
        payment: {
            error: 'There was an error Posting the Payment Request',
            loading: 'Posting Payment',
            success: 'The Payment was successfully Submitted'
        },
        paymentDisable: {
            error: 'There was an error disabling the payment method',
            loading: 'Disabling payment method',
            success: 'The payment method was successfully disabled'
        },
        session: {
            error: 'There was an error creating the session.',
            loading: 'Creating a new session for payment method capture...',
            success: 'Session created. Redirecting to payment form.'
        },
        changeDefault: {
            error: 'There was an error Changing the Default Payment',
            loading: 'Changing Default Payment Method',
            success: 'The Default Payment Method was successfully Changed'
        },
        usage: {
            error: 'There was an error loading Estimated Charges.'
        },
        purchaseOrders: {
            loading: 'Loading Purchase Orders',
            loadingError: 'Error loading Purchase Orders'
        },
        purchaseOrderCreate: {
            success: 'The new Purchase Order has been Activated',
            error: 'Error Activating new Purchase Order',
            loading: 'Creating new Purchase Order'
        },
        purchaseOrderDisable: {
            success: 'The current Purchase Order has been Disabled',
            error: 'Error Disabling current Purchase Order',
            loading: 'Disabling current Purchase Order'
        }
    })
    .constant('DATE_FORMAT', 'MM / dd / yyyy')
    .constant('TRANSACTION_TYPES', ['PAYMENT', 'INVOICE', 'REVERSAL', 'ADJUSTMENT', 'WRITE OFF', 'REFUND'])
    .constant('TRANSACTION_STATUSES', ['OPEN', 'CLOSED', 'PENDING', 'NONE'])
    .constant('LOADING_MSG', 'Loading...')
    .constant('NOTFOUND_MSG', '(Not found in Account)');
