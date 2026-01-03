from PIL import Image
import os

img_path = '/Users/enayat/.gemini/antigravity/brain/9451d932-aa4f-49d2-91aa-e672af416fe1/uploaded_image_1767431819792.png'

if not os.path.exists(img_path):
    print("Image not found")
    exit(1)

try:
    img = Image.open(img_path)
    img = img.convert('RGB')
    
    # 1. Average Color (good for background feel)
    avg_img = img.resize((1, 1))
    avg_color = avg_img.getpixel((0, 0))
    print(f"AVERAGE: #{avg_color[0]:02x}{avg_color[1]:02x}{avg_color[2]:02x}")

    # 2. Key Colors (corners for gradient)
    w, h = img.size
    tl = img.getpixel((0, 0))
    br = img.getpixel((w-1, h-1))
    print(f"TOP_LEFT: #{tl[0]:02x}{tl[1]:02x}{tl[2]:02x}")
    print(f"BOTTOM_RIGHT: #{br[0]:02x}{br[1]:02x}{br[2]:02x}")

except Exception as e:
    print(f"Error: {e}")
