import requests
import sys
from bs4 import BeautifulSoup

sys.stdout.reconfigure(encoding='utf-8')

url = "https://volksresources.com/"

html = requests.get(url).text
soup = BeautifulSoup(html, "html.parser")

print(soup.title.text)
print(soup.get_text(" ", strip=True))
