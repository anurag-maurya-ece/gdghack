# DATA

6. Data model (starter; copy into docs/DATA.md)
Trade-off to remember: locations are one doc per vendor (overwrite) because only the latest position matters. Storing history would make the heatmap better but costs more.

| Collection | Key fields | Access pattern | Note |
| --- | --- | --- | --- |
| vendors | id, phone, name, shopType, language, isOnline | read by map, written by vendor/bot | phone is the identity |
| products | vendorId, name, price, unit, inStock, updatedAt | list by vendor | saved only after vendor confirms |
| locations | vendorId, lat, lng, updatedAt | realtime read by many | one doc per vendor, overwritten |
| orders | id, customerId, vendorId, items, status, createdAt | by vendor and by customer | fixed status flow |
| chats/messages | chatId, senderId, original, lang, translations | ordered by time | translation cached |
| demandCells | cellId, score, byHour, updatedAt | top-N query | recomputed by scheduled job |
