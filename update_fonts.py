import re

with open('css/styles.css', 'r') as f:
    css = f.read()

# Replace variables
css = re.sub(r"--font-heading:\s*'Inter',\s*sans-serif;", "--font-heading: 'Buongiorno Rastellino', serif;", css)
css = re.sub(r"--font-body:\s*'Inter',\s*sans-serif;", "--font-body: 'Montserrat', sans-serif;", css)

# Replace 'Playfair Display', serif with var(--font-heading) or 'Buongiorno Rastellino'
css = css.replace("'Playfair Display', serif", "'Buongiorno Rastellino', serif")

# Replace Pinyon Script with Buongiorno Rastellino
css = css.replace("'Pinyon Script', cursive", "'Buongiorno Rastellino', serif")

with open('css/styles.css', 'w') as f:
    f.write(css)
