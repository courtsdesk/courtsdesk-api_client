# Courtsdesk API Demo App

Sample javascript application that uses the [Courtsdesk API](https://api.courtsdesk.com/docs).

The demo is live at [courtsdesk.github.io/api/demo](http://courtsdesk.github.io/api/demo). Contact support@courtsdesk.com with queries.

## Important

This demo uses the [Client Credentials Oauth 2.0 flow](https://oauth.net/2/grant-types/client-credentials/) and requires you to authenticate with the API by providing your Application Id and Secret key.

This is purely for demonstration purposes and the Client Credentials flow **is not** appropriate for use in a client side application such as this demo (you should instead use the [Authorisation Code Flow](https://oauth.net/2/grant-types/authorization-code/)).

## Getting Started

Register a Courtsdesk API application at https://www.courtsdesk.com/oauth/applications and note your Application Id and Secret.

Copy these files and host them on any HTTP server, or simply run directly by opening [index.html](index.html) in a web browser.

## Usage

Sign in using your Application Id and Secret.

Use the interface to search the [Irish High Court](http://highcourtsearch.courts.ie/) via the [Courtsdesk API](https://api.courtsdesk.com/docs). For a description of the query language consult the [API documentation](https://api.courtsdesk.com/docs). Some examples include:

* `mortgage` Search all facets of the Irish High Court for cases matching the term _mortgage_. This will include closely matching results, such as ones containing the terms _mortgages_ or _mortgate_.
* `+mortgage` Search for cases that match the term _mortgage_ exactly, not permitting any fuzziness.
* `p:mortgage` Search for cases in which one or more of the _plaintiffs_ closely matches the term _mortgage_.
* `p:mortgage -d:irish bank` As above, but exclude any cases with defendants that match _irish bank_.
* `p:sue, +legal:bray harper case_type:JR from:2017-01-01 to:2018-01-01` Find Judicial Review cases, issued during 2017, that includes a plaintiff like _Sue_ and a solicitor called exactly _Bray Harper_.

## Copyright

Copyright 2018 Eaglegal Ltd. T/A Courtsdesk
