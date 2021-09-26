# -*- coding: utf-8 -*-
import requests
from bs4 import BeautifulSoup
from bson import ObjectId
def api_get_posts(database):
    items = _get_all_from_database(database)
    response = {'result':'success', 
                'items':items}
    return response

def api_create_post(database, url, comment):
    document = _get_complete_data(url, comment)
    if _add_to_database(database, document):
        return {'result':'success', 'item': document}
    return {'result':'fail', 'item': None}

def api_delete_post(database, id):
    result = database.posts.delete_one({'_id': ObjectId(id)})
    if result.deleted_count:
        return {'result':'success'}
    {'result':'fail'}
def _get_complete_data(url, comment):
    headers = {'User-Agent' : 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.86 Safari/537.36'}
    data = requests.get(url, headers=headers)
    soup = BeautifulSoup(data.text, 'html.parser')

    image = soup.select_one('meta[property="og:image"]')
    description = soup.select_one('meta[property="og:description"]')
    title = soup.select_one('meta[property="og:title"]')
    if not image: 
        image = soup.select_one('meta[name$="image"]')
    if not description: 
        description = soup.select_one('meta[name$="description"]')
    if not title:
        title = soup.select_one('meta[name$="title"]')

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
    results = list(database.posts.find({}))
    for result in results:
        result['_id'] = str(result['_id'])
    return results

def _add_to_database(database, document):
    result = database.posts.insert_one(document)
    document['_id'] = str(document['_id'])
    return result.acknowledged