plex-web-firefox-ext
==============

Features
--------------
- Adds link to view the trailer for movies within Plex/Web

Contributors
--------------
* [ufctester](https://github.com/ufctester)

Version History
--------------
- **v0.0.1** - Initial checkin

Building the extension
--------------
To build download and install the [Add-on SDK](https://developer.mozilla.org/en-US/Add-ons/SDK), cd to the extension source code directory and run:

    <sdk_directory>/bin/cfx xpi

To run it in a developers profile run:

    <sdk_directory>/bin/cfx run

Enabling debugging
--------------
In the extension settings page enable debug mode. By default `console.log()` statements in SDK addons won't show up in the browser console. To allow them to show up you will need to open up `about:config`, create a new preference, name it `extensions.sdk.console.logLevel` and set the value as `all`.
