"Programs are meant to be read by humans and only incidentally for computers to execute." — H. Abelson and G. Sussman (in "Structure and Interpretation of Computer Programs")

These coding standards are loosesly based on the recommendations provided by [Douglas Crawford](http://javascript.crockford.com/code.html) and common engineering best practices. In order for pull requests to be approved, the following standards must be followed.

# General Guidelines
* [DRY Principle](http://en.wikipedia.org/wiki/Don't_repeat_yourself)
* [Self Documenting Code](http://en.wikipedia.org/wiki/Self-documenting)
* [Code should be concise and easily testable](http://googletesting.blogspot.com/2008/08/by-miko-hevery-so-you-decided-to.html)
* [Re-inventing the Wheel](http://en.wikipedia.org/wiki/Reinventing_the_wheel) - We have included [lodash](http://lodash.com/docs) for common tasks in JavaScript.  Utilize utility methods whenever applicable.
* [Smell Test](http://en.wiktionary.org/wiki/smell_test) - All code submissions are subject to the judgment and opinion of the reviewer.

# Basic formatting

* 4 spaces for indention. No tabs.
* Semicolons at the end of every functional line
* Line length should be under 120 characters
* Single quote, not double
* Variables can be declared with a single var, or multiple
* Spaces in function declarations
* Spaces between logical && and ||

```
var a, b, c;
var name = 'test';
var example = function (argA, argB) {
    ...
};
var test = (condition) ? true : false;
if (condition && otherCondition) {
    //do something awesome
    a = 1;
}
```

# Documentation

**Profusely comment your code**. Self-documenting code is important, but not all code is self-explanatory. Inline comments do wonders to help developers understand the purpose of the code. Even if it only saves a developer five seconds, it's still worth it.

## API Docs

[Ngdoc](https://github.com/angular/angular.js/wiki/Writing-AngularJS-Documentation) is used to generate documentation. All directives, services, functions, etc should be documented using ngdoc.

# Variable conventions

* Variable names should be [camel case](http://en.wikipedia.org/wiki/CamelCase#Programming_and_coding)
* Refrain from using [global variables](http://en.wikipedia.org/wiki/Global_variables)
* Implied global variables should **never** be used (ie: `myGlobalVar = 'Hello world';`). Use `window.myGlobalVar` if you need to make something global.
* Constants should be [Capital Case](http://en.wikipedia.org/wiki/All_caps)

# Function conventions

* Function names should be [camel case](http://en.wikipedia.org/wiki/CamelCase#Programming_and_coding)
* Function names should be verbs if the function changes the state of the program, and nouns if they're used to return a certain value. They should describe what the function does, not what calls the function.
* Minimize Global functions
* Keep functions short.

# Module Definitions

To avoid namespace conflicts, each component is a separate Angular module. For example, all functionality for rx-form lives under the 'encore.ui.rxForm' module.

To define this module, add a line to app.js similar to:
`angular.module('encore.ui.rxMyComponent', [myDependency]);`

This module will be automatically added to the dependency list for the 'encore.ui' base module.

# JSHint

For details on what JSHint rules we follow, take a look at the [.jshintrc file](../.jshintrc).

All JSHint errors must be resolved before a Pull Request can be accepted.

# Unit Testing

"TDD doesn't mean you're better, it just means you catch your mistakes very quickly." [paraphrased @jamesshore](https://twitter.com/klamping/status/314765397184368640)

Testing is just as much about code quality as it is about building a robust regression test suite. Code that is testable is usually more module, less tightly-coupled and more robust.

* All new functionality must have proper unit tests
* Line covereage should be at 80% or higher

# Midway Testing

For any new functionality that can't be tested via unit tests (or is outside of the scope of unit tests), midway tests should be created. We do not currently have code coverage stats for Midway tests, so it's up to you to determine what the appropriate level of testing is.

It's a good rule of thumb that any new directives should have new midway tests.

**For more on both unit and midway testing, read [the Encore UI Testing Handbook](./testing.md).**

# Other Guidelines

* [Write Maintainble Code](http://www.youtube.com/watch?v=c-kav7Tf834)
* The less code on one line, the easier it is to read and the less likely you’ll encounter a merge conflict.
* Adding `'use strict';` to your files isn't necessary, as JSHint and this styleguide take care of most everything that `use strict` helps with. As a rule, we won't

## Name Anonymous Functions (but really avoid using them)

Anonymous functions can make it hard to debug code, especially when they are nested. To avoid this, anytime an anonymous function is used, name that function:

```
element('.foo').on('mouseover', function showAlert () {
    alert('I have a name!');
});
```

It is generally preferred that anonymous functions aren't used and that you declare your functions outside of whatever is calling it. This makes code more modular, easier to re-use and can help make unit testing easier.

Taking the code from before, it now looks like:

```
function showAlert () {
    alert('I have a name!');
}
element('.foo').on('mouseover', showAlert);
```

## Type Checks

See [the jQuery Style Guide](http://contribute.jquery.org/style-guide/js/#type-checks) for guidance on checking data types of variables. For instances where using the `jQuery` object is recommended, instead use the matching Lo-Dash utility method:

 - [Plain Object](http://lodash.com/docs#isPlainObject): `_.isPlainObject(object)`
 - [Function](http://lodash.com/docs#isFunction): `_.isFunction( object )`
 - [Array](http://lodash.com/docs#isArray): `_.isArray( object )`

## Resources

* [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript)
* [Google's JavaScript Style Guide](http://google-styleguide.googlecode.com/svn/trunk/javascriptguide.xml)