import os
from PIL import Image

def make_transparent(input_path, output_path):
    print(f"Loading image from: {input_path}")
    img = Image.open(input_path)
    img = img.convert("RGBA")
    
    datas = img.getdata()
    new_data = []
    
    for item in datas:
        # If the pixel is close to white, make it transparent
        # Threshold: R > 230, G > 230, B > 230
        if item[0] > 230 and item[1] > 230 and item[2] > 230:
            new_data.append((255, 255, 255, 0)) # transparent
        else:
            new_data.append(item)
            
    img.putdata(new_data)
    img.save(output_path, "PNG")
    print(f"Saved transparent image to: {output_path}")

if __name__ == "__main__":
    input_file = "/Users/lek/Gemini/sk150/public/assets/logo.jpg"
    output_file = "/Users/lek/Gemini/sk150/public/assets/logo.png"
    make_transparent(input_file, output_file)
