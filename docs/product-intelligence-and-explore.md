# Product Intelligence And Explore Direction

BinoCart is evolving from a barcode scanner into an independent shopping intelligence layer. The user should not only see prices; they should understand whether a shopping decision is good.

## Market Pulse

Market Pulse is the top-of-market feed. It should highlight signals that matter now:

- unusual price drops or spikes
- meaningful sales or coupon windows
- shortage, restock, and freshness signals
- locally relevant changes in Columbus-area stores
- products or commodities the user is likely to care about

Pulse cards are intentionally compact. They should give enough context to act quickly, then open a deeper product intelligence detail view when tapped.

## Product Intelligence Detail View

The current Pulse detail modal is the first version of BinoCart's product intelligence surface. It should become more than a list of store cards.

For commodities such as eggs, milk, bread, diapers, or coffee, the detail view should answer:

- What product or commodity is Bino analyzing?
- What is the current best local option?
- Which stores and brands are meaningfully different?
- Is the price moving up, down, stable, or unusually low?
- How fresh or confident is the data?
- What should the shopper do next?

Expected actions include add cheapest, save, set alert, inspect store options, and view deeper market history.

## Explore Relationship

Explore should reuse the same visual language as the Pulse detail view, but for deliberate research instead of urgent market signals.

Future Explore pages should support:

- commodity pages, such as Eggs or Milk
- individual product/SKU pages, such as a specific Kraft cheese product
- brand pages, such as Kraft or Friendly Farms
- store modules, such as Aldi in Columbus
- market area pages, such as Columbus grocery staples

The long-term navigation model is not flat search. It should connect market area, stores, categories/commodities, brands, products, SKUs, receipts, favorites, alerts, recipes, and cart optimization.

## Receipt Memory Relationship

Receipt processing is now the first working source of user-generated price memory. Saved receipts create line-item observations with store, date, quantity, price, and visible barcode/UPC/SKU codes when available.

Profile currently shows:

- receipt memory cards that open receipt detail modals
- reviewed receipt JSON downloads
- a first-pass price memory graph grouped by barcode when available, otherwise item name

This should evolve into Explore history for commodities and products. For example, an Eggs page should eventually combine Pulse signals, scanned product records, receipt observations, store comparisons, and confidence/freshness indicators into one explainable intelligence view.

## Interaction Notes

The Local Market Pulse carousel is tuned from Profile > Advanced UI Controls:

- `Show next Pulse preview` controls whether adjacent Pulse card columns peek into view.
- `Fast Pulse snap` controls whether the carousel settles more quickly after swipe.

Default behavior should favor a clean settled state: only the active Pulse card set should be visible after the carousel snaps.
