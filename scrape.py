import json
import requests
from bs4 import BeautifulSoup
import time

# List of collections with their URLs, page counts, and output file names
collections = [
    {"url": "https://www.raretimeny.com/collections/rolex?page={}", "pages": 175, "file": "rolex.json"},
    {"url": "https://www.raretimeny.com/collections/audemars-piguet?page={}", "pages": 12, "file": "piguet.json"},
    {"url": "https://www.raretimeny.com/collections/patek-philippe?page={}", "pages": 13, "file": "patek.json"},
    {"url": "https://www.raretimeny.com/collections/cartier?page={}", "pages": 60, "file": "cartier.json"},
]

# Function to extract product information from a single page
def extract_product_info(soup):
    product_cards = soup.select('.sf__pcard')
    products = []
    for card in product_cards:
        title_element = card.select_one('.sf__pcard-name')
        image_element = card.select_one('.sf__image-box img')
        description_element = card.select_one('.content-view-list .leading-7')
        
        title = title_element.get_text(strip=True) if title_element else 'No title'
        
        image_url = 'No image'
        if image_element:
            if image_element.has_attr('data-src'):
                image_url = image_element['data-src'].split(',')[0].split(' ')[0]
            elif image_element.has_attr('src'):
                image_url = image_element['src']
        
        # Replace {width}x with 180x in the image URL if present
        image_url = image_url.replace("{width}x", "180x")
        
        description = description_element.get_text(strip=True) if description_element else 'No description'
        
        products.append({
            'title': title,
            'imageUrl': image_url,
            'description': description
        })
    return products

# Loop through each collection
for collection in collections:
    base_url = collection["url"]
    pages = collection["pages"]
    file_name = collection["file"]
    collection_products = []

    for page in range(1, pages + 1):
        print(f"Scraping page {page} of {base_url.format(page)}...")
        url = base_url.format(page)
        response = requests.get(url)
        if response.status_code == 200:
            soup = BeautifulSoup(response.content, 'html.parser')
            page_products = extract_product_info(soup)
            collection_products.extend(page_products)
        else:
            print(f"Failed to retrieve page {page}")
        time.sleep(1)  # Sleep for 1 second to avoid getting blocked

    # Save the product data to a JSON file
    with open(file_name, 'w') as json_file:
        json.dump(collection_products, json_file, indent=2)

    print(f"Scraped {len(collection_products)} products and saved to {file_name}")
