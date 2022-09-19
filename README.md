# Shopgate Web Checkout utility for Shopware 6 extensions

### Development

#### Adding files to the watch list

This module can be required as a dependency as a local package first, something along these lines:

```shell
npm install --save ../path/to/mymodule
sgconnect extension create
# follow prompt to make a simple backend extension
cd extensions/some-shopgate-module/extension
ln -fs ../../../path/to/mymodule/src/services/apiManager.js
```

Make sure the extension is attached. Once that is done the apiManager file will be in the watch list 
& modifying it will reload the backend quickly.
