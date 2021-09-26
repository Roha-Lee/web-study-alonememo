from flask import Flask, render_template, request, jsonify
from pymongo import MongoClient
import requests
from alonememoAPI import api_get_posts, api_create_post, api_delete_post
client = MongoClient('localhost', 27017)
db = client.db_alonememo

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/api/getPosts', methods=['GET'])
def read_memos():
    response = api_get_posts(db)
    return jsonify(response)

@app.route('/api/createPost', methods=['POST'])
def add_memo():
    url_give = request.form['url_give']
    comment_give = request.form['comment_give']
    response = api_create_post(db, url_give, comment_give)
    return jsonify(response)

@app.route('/api/deletePost', methods=['DELETE'])
def delete_memo():
    id_give = request.form['id_give']
    response = api_delete_post(db, id_give)
    return jsonify(response)

if __name__ == '__main__':
    app.run('0.0.0.0', port=5000, debug=True)