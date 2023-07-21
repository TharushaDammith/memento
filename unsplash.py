import requests
import os


class Unsplash:
    def __init__(self):
        self.access_key = os.environ.get("UNSPLASH_ACCESS_KEY")
        self.endpoint = "https://api.unsplash.com/search/photos"
        self.header = {"Authorization": f"Client-ID {self.access_key}"}

    def search_image(self, query, item_limit=5):
        body = {
            "query": f"{query}",
            "per_page": item_limit,
        }

        response = requests.get(self.endpoint, headers=self.header, params=body)
        data = response.json()
        image_links = [img['links']['download'] for img in data['results']]
        return image_links
