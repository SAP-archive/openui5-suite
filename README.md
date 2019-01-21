![openui5](http://openui5.org/images/OpenUI5_new_big_side.png)

# openui5-suite

## Description

This is an open source extension library to [OpenUI5](https://github.com/SAP/openui5).
It contains a couple of UI5 libraries with additional useful controls.

### List of libraries

 - [sap.suite.statusindicator](src/statusindicator/README.md) - A set of components for displaying animated KPIs.

## Requirements

- [Node.js](https://nodejs.org/) (**version 8.5 or higher**)

## Installation

### With UI5

This library is released as part of [SAPUI5 SDK](https://tools.hana.ondemand.com/#sapui5).

### npm

You can install each library in this repository directly from npm. See instructions for each library:

 - [sap.suite.statusindicator](src/statusindicator/README.md)
 
## Contributing

### General Remarks

You are welcome to contribute code to the Suite Library in order to fix bugs or to implement new features.

There are three important things to know:

1. You must be aware of the [Apache License](/LICENSE.txt) (which describes contributions) and **agree to 
the Contributors License Agreement**. This is common practice in major Open Source projects. To make this process as simple
as possible, we are using *[CLA assistant](https://cla-assistant.io/)* for individual contributions. CLA assistant is
an open source tool that integrates with GitHub very well and enables a one-click experience for accepting the CLA.
For company contributers, special rules apply. See the respective section below for details.

2. Follow our **[Development Guidelines](docs/Guidelines.md)**.

3. **Not all proposed contributions can be accepted**. Some features may just fit a third-party add-on better.
The code must match the overall direction of the Suite Library and improve it. For most bug fixes this is a given,
but a major feature implementation first needs to be discussed with our PO. We are happy to accept new features from 
contributors, but to prevent potential disappointment, please create a feature request first, where we can discuss if
the feature makes sense.

### Contributor License Agreement

When you contribute code, documentation, or anything else, you have to be aware that your contribution is covered
by the same [Apache 2.0 License](http://www.apache.org/licenses/LICENSE-2.0) that is applied to the Suite Library itself.

In particular, you need to agree to the Individual Contributor License Agreement, which can be
[found here](https://gist.github.com/CLAassistant/bd1ea8ec8aa0357414e8). This applies to all contributors, including those
contributing on behalf of a company.

If you agree to its content, you simply have to click on the link posted by the CLA assistant as a comment in the pull
request. Click it to check the CLA, then accept it on the following screen if you agree to it. The CLA assistant saves
this decision for upcoming contributions to that repository and notifies you, if there is any change to the CLA in
the meantime.

#### Company Contributors

If employees of a company contribute code, in **addition** to the individual agreement mentioned above, one company
agreement must be submitted. This is mainly for the protection of the contributing employees.

A company representative authorized to do so needs to download, fill in, and print the
[Corporate Contributor License Agreement](/docs/SAP_Corporate_Contributor_License_Agreement.pdf) form and then proceed
with one of the following options:

- Scan and e-mail it to [opensource@sap.com](mailto:opensource@sap.com) and [openui5.suite@sap.com](mailto:openui5.suite@sap.com)
- Fax it to: +49 6227 78-45813
- Send it by traditional letter to:  
  *Industry Standards & Open Source Team*  
  *Dietmar-Hopp-Allee 16*  
  *69190 Walldorf*  
  *Germany*

The form contains a list of employees who are authorized to contribute on behalf of your company. When this list changes,
please let us know.

### How to Contribute

1. Make sure the change is welcome (see [General Remarks](#general-remarks)).
1. Fork the library.
1. Commit and push your change to the fork.
    - **Please follow our [Development Guidelines](docs/Guidelines.md).**
1. Create a pull request.
1. Follow the link posted by the CLA assistant to your pull request and accept it, as described above.
1. Wait for our code review and approval, possibly enhancing your change on request.
    - Note that the UI5 developers have many duties. So, depending on the required effort for reviewing, testing,
     and clarification, this may take a while.
1. Once the change has been approved and merged, we will inform you in a comment.

## Support

If you found a bug, please report it in the [issue](/../../issues) section. In case you have a question you can ask it in
the [issue](/../../issues) section or you can ask it on [stackoverflow](https://stackoverflow.com/questions/tagged/sapui5)
using the sapui5 tag.

## License

This project is licensed under the Apache Software License, Version 2.0 except as noted otherwise in the [LICENSE](/LICENSE.txt) file.