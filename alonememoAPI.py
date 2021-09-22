# -*- coding: utf-8 -*-
import requests
from bs4 import BeautifulSoup
from werkzeug.wrappers import response
def posts_get_response(database):
    items = _get_all_from_database(database)
    response = {'result':'success', 
                    'items':items}
    return response

def posts_post_response(database, url, comment):
    document = _get_complete_data(url, comment)
    if _add_to_database(database, document):
        response = {'result':'success', 
                    'item': document}
    else:
        response = {'result':'fail', 
                    'item': None}
    return response

def _get_complete_data(url, comment):
    headers = {'User-Agent' : 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.86 Safari/537.36'}
    data = requests.get(url, headers=headers)
    soup = BeautifulSoup(data.text, 'html.parser')

    image = soup.select_one('meta[property="og:image"]')
    description = soup.select_one('meta[property="og:description"]')
    title = soup.select_one('meta[property="og:title"]')
    image = image['content'] if image else 'static/images/no_img.png'
    description = description['content'] if description else 'no description'
    title = title['content'] if title else 'no title'
    
    document = {'url': url, 
                'image': image,
                'title': title, 
                'description': description, 
                'comment': comment}
    return document

def _get_all_from_database(database):
    result = list(database.posts.find({}, {'_id': 0}))
    return result

def _add_to_database(database, document):
    result = database.posts.insert_one(document)
    document['_id'] = None
    return result.acknowledged