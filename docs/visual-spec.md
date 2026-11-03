# Visual reference measurements

Source truth: `references/homepage.png` (2560 × 5210) and `references/detail-page.png` (648 × 1600).
Reference HTML provides effective desktop layout: homepage 1280 CSS px at 2× capture density; detail appears reduced from 1296 CSS px to 648 pixels.

Homepage: 1280px maximum frame, 40px inner desktop margins, hero 7/5 column split with 48px gap; 72px heading, 18px body; six-column zodiac grid with 24px gaps; section padding 40px. Pink #DC2C67, purple #8C56A3, backdrop #FDF2F8. Latest cards approximately 55/21/21%, evergreen three columns.

Detail: 1152px maximum frame including 40px inner margins, 48px top space; 24px hero corners, 48px hero inset; 7/5 hero split; 768px reading measure; 60px desktop hero title and 18px body. White article with pale blush date header, 24px section spacing, 11-sign switcher.

Fonts: DM Serif Display headings, Plus Jakarta Sans body, DM Sans labels. Source HTML is reference data only, not application code. Screenshot wins over conflicting DESIGN.md palettes and comments.

Approved deviations: full period H1, breadcrumb/update metadata, author, summary, Karier, characteristics in the interactive hero card and related articles on every period; touch targets and contrast take precedence over reference sizes. Demo content and dates are explicitly labelled in the footer. No application code from the neighboring project is reused.

Latest forecast interaction: at desktop widths (1024px+), the first/left card starts expanded. Hover or keyboard focus transfers the expanded state to another card; leaving the row keeps the last selected card open. Flex growth animates over 500ms with ease-out; only the expanded card displays its photo, dark overlay and description. Collapsed cards are teal, magenta and violet in order. The original self-care board and rose photos and their descriptions are used for cards two and three. Reduced motion disables transitions. Article activation and the mobile layout remain available without hover.

Zodiac characteristics are revealed inside the hero illustration card using a native disclosure: mouse/pen hover tilts and opens it; tap or Enter/Space toggles it; Escape closes it. The section is titled “Mengenal Karakteristik {Nama}” and retains the sign profile, element and date range. It replaces the separate profile section below the forecast and is available on all detail periods. Reduced motion disables the animated tilt.
