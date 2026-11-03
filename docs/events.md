# Local event dictionary

Inspect `window.__zodiacEvents` in browser developer tools or subscribe to `window.addEventListener('zodiac:analytics', handler)`. The collector is in memory only: reload clears its history. No events are sent to a network collector or written to browser storage.

All events contain `event_name`, `page_path` (pathname only), ISO `timestamp`, and `environment: demo`.

| Event | Trigger | Allowed details |
|---|---|---|
| zodiac_page_view | Page content commits, once per navigation | page_type, zodiac and period on details |
| zodiac_select | Grid or switcher link click | target_zodiac, source: grid/switcher |
| zodiac_finder_submit | Finder submission | result: valid/invalid, error_type: empty/invalid_date |
| zodiac_finder_result_click | Result CTA click | target_zodiac |
| zodiac_period_select | Period link click | from_period, to_period, zodiac |
| zodiac_article_click | Article click | article_id, section: latest/evergreen/related, position (one-based) |
| zodiac_content_state | Unavailable, failed, or expired page commits | state, zodiac, period |

An allowlist drops extra parameter names. Field values, birth day/month, and query strings are never passed to the collector. Demo scenarios are not production tracking. A future provider must respect the host site's consent policy and avoid duplicate listeners.
