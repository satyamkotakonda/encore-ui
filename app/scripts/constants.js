angular.module('constants', [])
    .constant('STATUS_MESSAGES', {
        permissionDenied: 'Permission Denied',
        overview: {
            error: 'There was an error loading Account Information'
        },
        transactions: {
            error: 'There was an error loading Account Transactions'
        },
        payment: {
            error: 'There was an error Posting the Payment Request',
            load: 'Posting Payment',
            success: 'The Payment was successfully Submitted'
        },
        changeDefault: {
            error: 'There was an error Changing the Default Payment',
            load: 'Changing Default Payment',
            success: 'The Default Payment Method was successfully Changed'
        },
        usage: {
            error: 'There was an error loading Estimated Charges.'
        },
        purchaseOrders: {
            create: 'Creating new Purchase Order',
            createError: 'Error Activating new Purchase Order.',
            createSuccess: 'The new Purchase Order has been Activated',
            disable: 'Disabling current Purchase Order',
            disableError: 'Error Disabling current Purchase Order.',
            disableSuccess: 'The current Purchase Order has been Disabled',
            loading: 'Loading Purchase Orders',
            loadingError: 'Error loading Purchase Orders'
        }
    })
    .constant('DATE_FORMAT', 'MM / dd / yyyy')
    .constant('TRANSACTION_TYPES', ['PAYMENT', 'INVOICE', 'REVERSAL', 'ADJUSTMENT', 'WRITE OFF', 'REFUND'])
    .constant('TRANSACTION_STATUSES', ['OPEN', 'CLOSED', 'PENDING', 'NONE'])
    .constant('LOADING_MSG', 'Loading...')
    .constant('NOTFOUND_MSG', '(Not found in Account)');