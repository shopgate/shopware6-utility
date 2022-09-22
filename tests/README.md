### Postman automated tests

### Prerequisites

- Install Shopware 6 with Sample Data
- Install [Shopgate Connect](https://gitlab.com/apite/shopgate/shopware6/shopgate-connect) Plugin & activate
- Install [Platform SDK backend](https://developer.shopgate.com/docs/guides-tutorials/development-tools/platform-sdk/backend)
- Install all extensions needed for tests (e.g. [cart], [user], [favorites])
- Set up ENV variables: `SW_ENDPOINT`, `SW_ACCESS_KEY`. See extension README on how to configure them.

### Setup

```shell
  sgconnect extension manage
  sgconnect backend start
  npm i
```

### Run tests

```shell
   npm run full
```

[cart]: https://gitlab.com/apite/shopgate/connect-engage/ext-shopware6-cart
[user]: https://gitlab.com/apite/shopgate/connect-engage/ext-shopware6-user
[favorites]: https://gitlab.com/apite/shopgate/connect-engage/ext-shopware6-favorites
