import re

with open('css/styles.css', 'r') as f:
    css = f.read()

# 1. Zoom out intro text
css = css.replace('  font-size: 1.25rem;', '  font-size: clamp(1.05rem, 3vw, 1.25rem);')

# 2. Adjust zigzag gap for mobile/desktop
css = re.sub(
    r'\.mc-zigzag \{\s*display: flex;\s*flex-direction: column;\s*gap: 120px;\s*max-width: 1200px;\s*margin: 0 auto;\s*padding: 0 20px;\s*\}',
    '.mc-zigzag {\n  display: flex;\n  flex-direction: column;\n  gap: 80px;\n  max-width: 1200px;\n  margin: 0 auto;\n  padding: 0 24px;\n}\n@media (min-width: 900px) {\n  .mc-zigzag { gap: 120px; padding: 0 40px; }\n}',
    css
)

# 3. Adjust mc-zigzag-img-wrapper height
css = re.sub(
    r'\.mc-zigzag-img-wrapper \{\s*position: relative;\s*width: 100%;\s*height: 65vh;\s*min-height: 450px;\s*\}',
    '.mc-zigzag-img-wrapper {\n  position: relative;\n  width: 100%;\n  height: 50vh;\n  min-height: 300px;\n}\n@media (min-width: 900px) {\n  .mc-zigzag-img-wrapper { height: 65vh; min-height: 450px; }\n}',
    css
)

# 4. Zoom out h3 size
css = css.replace(
    '.mc-zigzag-text h3 {\n  font-size: 2.2rem;',
    '.mc-zigzag-text h3 {\n  font-size: clamp(1.6rem, 5vw, 2.2rem);'
)

# 5. Make gallery images smaller on mobile
css = css.replace(
    '  .mc-gallery-grid {\n    grid-template-columns: 1fr;\n    grid-auto-rows: 300px;\n  }',
    '  .mc-gallery-grid {\n    grid-template-columns: 1fr;\n    grid-auto-rows: 220px;\n  }'
)

with open('css/styles.css', 'w') as f:
    f.write(css)
