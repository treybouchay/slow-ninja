# Catalog interaction views

Switchable on the live site via the **Catalog views** bar above the games section.
Preference is stored in `localStorage` under `slow-ninja-catalog-view`.

| ID | Component | Origin | Notes |
| --- | --- | --- | --- |
| `starlane` | `views/starlane.tsx` | tag `timeline-starlane-v1` / `74cdedd` | Horizontal starlane: circles wake on scroll, active grows, lane pans, clipped segments, dossier cards. **Animation verified.** |
| `shelf` | `views/shelf.tsx` | `4e137a5` | Three standing game boxes on a shelf; click pulls a cart forward. |
| `diagonal-case` | `views/diagonal-case.tsx` | `5c253c5` | Isometric top-down case; carts slide out toward you and expand. |
| `file-case` | `views/file-case.tsx` | current | Icon-style three-quarter file box; stacks front-to-back; pull up to expand. |

The homepage/games pages render `CatalogExplorer` (exported as `GamesTimeline`).
