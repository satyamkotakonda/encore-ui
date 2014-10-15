// If the element by binding is found, invoke `innerFn` on the resulting element.
//
// If there is no element found due to the else clause of the `ng-if` directive, return `null`.
// If the element is present, then `innerFn` will be invoked on the result of `element.getText()`.
//
// An example of some html that would need to use this is as follows:
// <span class="accent-text">
//   <span ng-if="balance.amountDue">
//     {{balance.amountDue | currency }} {{balance.currency}}
//   </span>
//   <span ng-if="!balance.amountDue">
//     N/A
//   </span>
// </span>
module.exports.unless = function (element, innerFn) {
    return element.isPresent().then(function (present) {
        if (present) {
            if (innerFn === undefined) {
                return element.getText();
            }

            return element.getText().then(function (text) {
                return innerFn(text);
            });
        } else {
            return null;
        }
    });
};

// "$123.45 USD" -> 123.45
// Converts a currency string to a float, even if the currency type is missing at the end.
module.exports.currencyToFloat = function (text) {
    return parseFloat(text.split(' ')[0].replace(/[,$]/g, '').trim());
};
