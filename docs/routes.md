# Route map

One directory: `/zodiak`. `/` redirects to the directory.

| Sign slug | Today | Tomorrow | Week | Month | Year |
|---|---|---|---|---|---|
| aries | /zodiak/aries | /zodiak/aries/besok | /zodiak/aries/minggu-ini | /zodiak/aries/bulan-ini | /zodiak/aries/tahun-ini |
| taurus | /zodiak/taurus | /zodiak/taurus/besok | /zodiak/taurus/minggu-ini | /zodiak/taurus/bulan-ini | /zodiak/taurus/tahun-ini |
| gemini | /zodiak/gemini | /zodiak/gemini/besok | /zodiak/gemini/minggu-ini | /zodiak/gemini/bulan-ini | /zodiak/gemini/tahun-ini |
| cancer | /zodiak/cancer | /zodiak/cancer/besok | /zodiak/cancer/minggu-ini | /zodiak/cancer/bulan-ini | /zodiak/cancer/tahun-ini |
| leo | /zodiak/leo | /zodiak/leo/besok | /zodiak/leo/minggu-ini | /zodiak/leo/bulan-ini | /zodiak/leo/tahun-ini |
| virgo | /zodiak/virgo | /zodiak/virgo/besok | /zodiak/virgo/minggu-ini | /zodiak/virgo/bulan-ini | /zodiak/virgo/tahun-ini |
| libra | /zodiak/libra | /zodiak/libra/besok | /zodiak/libra/minggu-ini | /zodiak/libra/bulan-ini | /zodiak/libra/tahun-ini |
| scorpio | /zodiak/scorpio | /zodiak/scorpio/besok | /zodiak/scorpio/minggu-ini | /zodiak/scorpio/bulan-ini | /zodiak/scorpio/tahun-ini |
| sagitarius | /zodiak/sagitarius | /zodiak/sagitarius/besok | /zodiak/sagitarius/minggu-ini | /zodiak/sagitarius/bulan-ini | /zodiak/sagitarius/tahun-ini |
| capricorn | /zodiak/capricorn | /zodiak/capricorn/besok | /zodiak/capricorn/minggu-ini | /zodiak/capricorn/bulan-ini | /zodiak/capricorn/tahun-ini |
| aquarius | /zodiak/aquarius | /zodiak/aquarius/besok | /zodiak/aquarius/minggu-ini | /zodiak/aquarius/bulan-ini | /zodiak/aquarius/tahun-ini |
| pisces | /zodiak/pisces | /zodiak/pisces/besok | /zodiak/pisces/minggu-ini | /zodiak/pisces/bulan-ini | /zodiak/pisces/tahun-ini |

Slugs and suffixes are closed sets. `sagittarius` is not a second slug. Dynamic parameters are restricted to the generated route list; a request-boundary guard in proxy.ts (Next 16’s middleware successor) also rejects invalid paths before streaming to guarantee HTTP 404. No auth gates apply to these public reading pages. Every period keeps its own canonical.
