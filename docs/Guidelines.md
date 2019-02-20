# Coding Guidelines

## JavaScript Coding Guidelines

We are part of OpenUI5, so we try to follow [UI5 Guidelines](https://github.com/SAP/openui5/blob/master/docs/guidelines.md)
everywhere where it makes sense. In case you are not sure, you can ask in the pull request review or send mail to 
[openui5.suite@sap.com](mailto:openui5.suite@sap.com)

## Testing

Just like OpenUI5 we use QUnit tests. They are executed on every pull request and it's mandatory that they pass for every
pull request before it can be merged.

In case you would like to run them locally. See [running](#runnuing) section.

## Git Guidelines

Follow the [OpenUI5 Commit Message Guidelines](https://github.com/SAP/openui5/blob/master/docs/guidelines.md#data-section).
The only difference is that instead of adding the component in the commit title just add library which you are changing, e.g.:

``` wiki
[FIX] statusindicator: On press event fixed

- Some reasonable description.

Fixes: #42
```

Refer the issue you are fixing / implementing.

If the change is not specific to a single library you can skip the first part of the commit title.

For our onw project planning we are adding keys of associated Jira Items. Our Jira is private, so please ignore them.
We do not require Jira items for contributions from outside of SAP.