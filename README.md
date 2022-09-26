# Shopgate Web Checkout utility for Shopware 6 extensions

## Purpose
This package is developed in support for Shopgate Connect & Engage extensions for Shopware 6.

## Development Instructions

### Adding files to the watch list

This module can be required as a dependency as a local package first, something along these lines:

```shell
cd extensions
git clone git@gitlab.com:apite/shopgate/connect-engage/shopware6-utility.git
git clone git@gitlab.com:apite/shopgate/connect-engage/ext-shopware6-cart.git
cd ext-shopware6-cart/extension
npm install --save ../../shopware6-utility
sgconnect extension create
# follow prompt to make a simple backend extension
cd ../../extensions/some-created-module/extension
ln -fs ../../../shopware6-utility/src/services/apiManager.js
```

Make sure the extension is attached. Once that is done the apiManager file will be in the watch list 
& modifying it will reload the backend quickly.

### Debug SW6 Connect Plugin & WebCheckout

- Install SW6 [locally](https://docs.dockware.io/use-dockware/advanced-run) & enable xDebug
- Install [SG Connect](https://gitlab.com/apite/shopgate/shopware6/shopgate-connect) plugin on SW6
- Edit `src/services/apiManager.js` to contain the following:

```javascript
  instance.defaults.headers.common['Cookie'] = 'XDEBUG_SESSION=XDEBUG_ECLIPSE;'
  instance.defaults.withCredentials = true
```
- Run any pipeline endpoint call via Postman
