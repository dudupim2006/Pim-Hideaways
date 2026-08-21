from PIL import Image

def remove_white_bg(input_path, output_path):
    img = Image.open(input_path).convert("RGBA")
    datas = img.getdata()
    
    new_data = []
    for item in datas:
        # Check if pixel is close to white (R, G, B > 200)
        # We can make it transparent and keep the dark colors
        # Better: use the luminance to set alpha!
        # This preserves anti-aliasing perfectly.
        r, g, b, a = item
        # Calculate grayscale/luminance
        lum = (r + g + b) / 3
        # If it's black (lum=0), alpha is 255. If it's white (lum=255), alpha is 0.
        # This way the dark text becomes solid black/dark grey, and white becomes transparent.
        # To preserve the original color, we just set alpha based on darkness.
        alpha = int(255 - lum)
        
        # If the user's image is a dark grey, setting it to pure black with alpha might change it slightly,
        # but it's a black/white image anyway.
        # We'll just use the original RGB but scale the alpha based on how far from white it is.
        # Since it's a white background, white pixels get alpha 0.
        # We can increase contrast on alpha to ensure text is solid.
        alpha = min(255, max(0, int((255 - lum) * 1.5)))
        new_data.append((r, g, b, alpha))
        
    img.putdata(new_data)
    img.save(output_path, "PNG")

remove_white_bg("/Users/dudu/Desktop/portugal-rentals/assets/pim-hideaways-logo.jpg", "/Users/dudu/Desktop/portugal-rentals/assets/pim-hideaways-logo.png")
