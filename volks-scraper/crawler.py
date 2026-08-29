import requests
import json
import sys
import os
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse

sys.stdout.reconfigure(encoding='utf-8')

BASE_URL = "https://volksresources.com/"
DOMAIN = "volksresources.com"

# Headers to prevent getting blocked
HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
}

def is_internal(url):
    parsed = urlparse(url)
    # It's internal if it has no netloc (relative) or if the netloc matches our domain
    return not parsed.netloc or DOMAIN in parsed.netloc

def crawl():
    visited = set()
    to_visit = [BASE_URL]
    
    # Data structure requested in Step 5
    data = {
        "pages": [],
        "headings": [],
        "paragraphs": [],
        "images": [],
        "links": []
    }
    
    print("Starting crawler...")
    
    while to_visit:
        current_url = to_visit.pop(0)
        
        if current_url in visited:
            continue
            
        print(f"Crawling: {current_url}")
        visited.add(current_url)
        data["pages"].append(current_url)
        
        try:
            response = requests.get(current_url, headers=HEADERS, timeout=10)
            if response.status_code != 200:
                continue
                
            soup = BeautifulSoup(response.text, "html.parser")
            
            # Extract Headings
            for tag in soup.find_all(['h1', 'h2', 'h3', 'h4', 'h5', 'h6']):
                text = tag.get_text(" ", strip=True)
                if text and text not in data["headings"]:
                    data["headings"].append(text)
                    
            # Extract Paragraphs
            for tag in soup.find_all('p'):
                text = tag.get_text(" ", strip=True)
                if text and text not in data["paragraphs"]:
                    data["paragraphs"].append(text)
                    
            # Extract Images
            for img in soup.find_all('img'):
                src = img.get('src')
                if src:
                    full_src = urljoin(current_url, src)
                    if full_src not in data["images"]:
                        data["images"].append(full_src)
                        
            # Extract Links & Queue internal ones
            for a in soup.find_all('a'):
                href = a.get('href')
                if href:
                    full_href = urljoin(current_url, href)
                    # Strip fragments for visiting
                    clean_href = full_href.split('#')[0]
                    
                    if clean_href not in data["links"]:
                        data["links"].append(clean_href)
                        
                    # Queue internal links that we haven't visited
                    if is_internal(clean_href) and clean_href not in visited and clean_href not in to_visit:
                        # Ensure we are only crawling http/https links
                        if clean_href.startswith('http'):
                            to_visit.append(clean_href)
                            
        except Exception as e:
            print(f"Error crawling {current_url}: {e}")
            
    # Save the result
    os.makedirs("data", exist_ok=True)
    out_file = os.path.join("data", "volks.json")
    with open(out_file, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
        
    print(f"\nCrawling complete!")
    print(f"Total Pages: {len(data['pages'])}")
    print(f"Total Headings: {len(data['headings'])}")
    print(f"Total Paragraphs: {len(data['paragraphs'])}")
    print(f"Total Images: {len(data['images'])}")
    print(f"Total Links: {len(data['links'])}")
    print(f"Data saved to {out_file}")

if __name__ == "__main__":
    crawl()
