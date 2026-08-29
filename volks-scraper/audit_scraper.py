import requests
import sys
import os
import json
import re
from bs4 import BeautifulSoup
from urllib.parse import urljoin

sys.stdout.reconfigure(encoding='utf-8')

# Target Pages
BASE_URL = "https://volksresources.com"
PAGES = {
    "home": "/",
    "about": "/about.php",
    "careers": "/search-jobs.php",
    "wireless": "/wireless.php",
    "osp": "/osp.php",
    "data_center": "/data-center-installation.php"
}

# Directories
DATA_DIR = "data"
CONTENT_DIR = os.path.join(DATA_DIR, "content")
ASSETS_DIR = os.path.join(DATA_DIR, "assets")

os.makedirs(CONTENT_DIR, exist_ok=True)
os.makedirs(ASSETS_DIR, exist_ok=True)

# Headers to prevent SSL/bot blocking
HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
}

# Regex patterns for contact info
PHONE_PATTERN = re.compile(r'\+?\d{1,3}[-.\s]?\(?\d{1,4}\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}')
EMAIL_PATTERN = re.compile(r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}')

def download_asset(url, asset_type):
    if not url:
        return
    if url.startswith('data:'):
        return # Skip base64
        
    full_url = urljoin(BASE_URL, url)
    filename = full_url.split("/")[-1].split("?")[0]
    
    if not filename:
        filename = "index.html"
        
    # Prevent invalid filenames on windows
    filename = re.sub(r'[\\/*?:"<>|]', "", filename)
    
    save_path = os.path.join(ASSETS_DIR, filename)
    
    # Don't download twice
    if os.path.exists(save_path):
        return
        
    try:
        response = requests.get(full_url, headers=HEADERS, stream=True, timeout=10)
        if response.status_code == 200:
            with open(save_path, 'wb') as f:
                for chunk in response.iter_content(1024):
                    f.write(chunk)
            print(f"  Downloaded {asset_type}: {filename}")
    except Exception as e:
        print(f"  Failed to download {full_url}: {e}")

def scrape_page(name, path):
    url = BASE_URL + path
    print(f"\nScraping {name} ({url})...")
    
    try:
        response = requests.get(url, headers=HEADERS, timeout=10)
        response.raise_for_status()
    except Exception as e:
        print(f"Error fetching {url}: {e}")
        return
        
    soup = BeautifulSoup(response.text, "html.parser")
    
    # Extract text content
    text_content = []
    for tag in soup.find_all(['p', 'h1', 'h2', 'h3', 'li']):
        text = tag.get_text(strip=True)
        if text:
            text_content.append(text)
            
    raw_text = soup.get_text(" ", strip=True)
    
    # Extract numbers and emails
    emails = list(set(EMAIL_PATTERN.findall(raw_text)))
    phones = list(set(PHONE_PATTERN.findall(raw_text)))
    
    # Save content
    content_data = {
        "page": name,
        "url": url,
        "emails": emails,
        "phones": phones,
        "text": text_content
    }
    
    content_file = os.path.join(CONTENT_DIR, f"{name}.json")
    with open(content_file, "w", encoding="utf-8") as f:
        json.dump(content_data, f, indent=4, ensure_ascii=False)
    print(f"  Saved content to {content_file}")
    
    # Extract assets
    images = soup.find_all('img')
    for img in images:
        src = img.get('src')
        if src:
            class_list = img.get('class', [])
            class_str = " ".join(class_list).lower()
            
            if 'logo' in src.lower() or 'logo' in class_str:
                download_asset(src, 'Logo')
            else:
                download_asset(src, 'Image')
                
    icons = soup.find_all('link', rel=lambda r: r and 'icon' in r.lower())
    for icon in icons:
        href = icon.get('href')
        if href:
            download_asset(href, 'Icon')

def main():
    print("Starting content audit...")
    for name, path in PAGES.items():
        scrape_page(name, path)
    print("\nAudit complete.")

if __name__ == "__main__":
    main()
