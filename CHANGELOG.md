# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/) and this project adheres
to [Semantic Versioning](http://semver.org/).

## 2.0.1

- removed promotion success message to improve UX

## 2.0.0

- added `product-out-of-stock` error mapping for a nicer popup
- added `min-order-quantity` error mapping for a nicer popup
- added support for error props that are passed as of 6.6.7.0
- changed `purchase-steps-quantity` error wording
- changed `@shopware-pwa/shopware-6-client` usage to pure Axios

## 1.1.2

- fixed logging printouts

## 1.1.1

- fixed FR file name

## 1.1.0

- added translation files for FR, IT & ES

## 1.0.1

- added a silence to an error that happens in a race condition between getRegisterUrl & getCart pipelines
- added additional error handling
- changed PWA version 1.6.1 to fix `Cannot read property data of undefined` ambiguous error

## 1.0.0

- added XDEBUG parameter for PHP debugging

## 0.3.0

- fixed URL concatenation logic to accommodate folders within an endpoint

## 0.2.0

- added a helper function for building the token URL
- added translation for cart summary `Tax` label
- changed URL slug from `sgconnect` to `sgwebcheckout`

## 0.1.0

- moved service & documentation files from all three extensions
