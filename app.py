from flask import Flask, render_template, request, jsonify
from pymongo import MongoClient
from alonememoAPI import posts_post_response, posts_get_response
client = MongoClient('localhost', 27017)
db = client.db_alonememo

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/posts', methods=['GET'])
def read_memos():
    response = posts_get_response(db)
    return jsonify(response)

@app.route('/posts', methods=['POST'])
def add_memo():
    url_give = request.form['url_give']
    comment_give = request.form['comment_give']
    response = posts_post_response(db, url_give, comment_give)
    return jsonify(response)

if __name__ == '__main__':
    app.run('0.0.0.0', port=5000, debug=True)