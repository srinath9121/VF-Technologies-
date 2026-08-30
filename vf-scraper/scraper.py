import requests
from bs4 import BeautifulSoup
import json
import os
from urllib.parse import urljoin, urlparse

class SiteCrawler:
    def __init__(self, start_url):
        self.start_url = start_url
        self.domain = urlparse(start_url).netloc
        self.visited_urls = set()
        self.urls_to_visit = [start_url]
        self.data = {
            "pages": [],
            "headings": [],
            "paragraphs": [],
            "images": [],
            "links": []
        }

    def is_internal_link(self, url):
        parsed = urlparse(url)
        return parsed.netloc == self.domain or parsed.netloc == ''

    def crawl(self):
        while self.urls_to_visit and len(self.visited_urls) < 15: # safety limit
            current_url = self.urls_to_visit.pop(0)
            
            # Normalize URL to avoid duplicates (strip trailing slash)
            normalized_url = current_url.rstrip('/')
            
            if normalized_url in [u.rstrip('/') for u in self.visited_urls]:
                continue

            print(f"Crawling: {current_url}")
            try:
                response = requests.get(current_url, timeout=10)
                response.raise_for_status()
            except requests.RequestException as e:
                print(f"Failed to fetch {current_url}: {e}")
                self.visited_urls.add(current_url)
                continue
                
            self.visited_urls.add(current_url)
            
            # Only add to pages if it's not a duplicate normalized URL
            if current_url not in self.data["pages"]:
                self.data["pages"].append(current_url)
            
            soup = BeautifulSoup(response.text, 'html.parser')
            self.extract_content(soup, current_url)

    def extract_content(self, soup, current_url):
        # Extract headings
        for h in soup.find_all(['h1', 'h2', 'h3', 'h4', 'h5', 'h6']):
            text = h.get_text(strip=True)
            if text and text not in self.data["headings"]:
                self.data["headings"].append(text)

        # Extract paragraphs
        for p in soup.find_all('p'):
            text = p.get_text(strip=True)
            if text and text not in self.data["paragraphs"]:
                self.data["paragraphs"].append(text)

        # Extract images
        for img in soup.find_all('img'):
            src = img.get('src')
            if src:
                full_url = urljoin(current_url, src)
                if full_url not in self.data["images"]:
                    self.data["images"].append(full_url)

        # Extract and queue links
        for a in soup.find_all('a'):
            href = a.get('href')
            if href:
                full_url = urljoin(current_url, href)
                # Remove fragments
                full_url = full_url.split('#')[0]
                
                if full_url not in self.data["links"]:
                    self.data["links"].append(full_url)
                
                if self.is_internal_link(full_url) and full_url not in self.visited_urls and full_url not in self.urls_to_visit:
                    # Ignore non-http links and tel/mailto
                    if full_url.startswith('http'):
                        self.urls_to_visit.append(full_url)

    def save_json(self, filepath):
        os.makedirs(os.path.dirname(filepath), exist_ok=True)
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(self.data, f, indent=2, ensure_ascii=False)
        print(f"Data saved to {filepath}")

if __name__ == "__main__":
    url = "https://vf-technologies.com/"
    crawler = SiteCrawler(url)
    crawler.crawl()
    crawler.save_json("data/vf.json")
