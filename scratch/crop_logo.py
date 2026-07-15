from PIL import Image

def crop_logo():
    # Open the transparent logo
    img = Image.open('public/assets/logo.png')
    
    # Get bounding box of non-transparent pixels
    bbox = img.getbbox()
    if bbox:
        # Crop the image to the bounding box
        cropped_img = img.crop(bbox)
        
        # Save the cropped image back
        cropped_img.save('public/assets/logo.png')
        print(f"Success! Logo cropped from {img.size} to {cropped_img.size}")
    else:
        print("Failed: No non-transparent pixels found in logo.png")

if __name__ == '__main__':
    crop_logo()
