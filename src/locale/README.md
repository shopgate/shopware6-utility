# Translation Files - Moved

## Important Notice

The translation JSON files that were previously in this directory have been **permanently moved** to the cart extension:

**New location**: `extensions/ext-shopware6-cart/extension/src/locale/`

## Why the Move?

The translation files contained deployment permissions issues when copied via the `post-install.sh` script. Since the cart extension is the one that deploys these translations to the Shopgate platform, it makes sense for it to be the owner of these files.

## Impact

- **Error handling still works**: The error classes in this utility package still reference the same translation keys (e.g., `ApiteSW6Utility.notice.loginBadCredentials`)
- **All extensions still work**: Any extension using this utility package's error handling will continue to work because the cart extension deploys the translations
- **No code changes needed**: Only the physical location of the JSON files has changed

## For Future Reference

If you need to update translations:
1. Edit the files in `extensions/ext-shopware6-cart/extension/src/locale/`
2. The utility package only needs to maintain the translation **key strings** in error classes
3. The actual translation **values** live in the cart extension

## Translation Key Categories

The utility package's error handling uses these translation key patterns:
- `ApiteSW6Utility.cart.*` - Cart totals and summaries
- `ApiteSW6Utility.notice.*` - Error messages
- `ApiteSW6Utility.general.*` - General application messages
- `ApiteSW6Utility.app.*` - App state messages

See the cart extension's locale README for full documentation.
