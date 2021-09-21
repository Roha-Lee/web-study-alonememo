from flask import Flask, render_template, request, jsonify
from pymongo import MongoClient
from alonememoAPI import *
client = MongoClient('localhost', 27017)
db = client.db_alonememo

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/managePost', methods=['GET'])
def manage_post_get():
    return jsonify({'result':'success','msg':'GET'})

@app.route('/managePost', methods=['POST'])
def manage_post_modify():
    role = request.form['role']
    if role == "ADD":
        print(role)
        return jsonify({'result':'Success','msg':'ADD complete'})
    elif role == "MODIFY":
        print(role)
        return jsonify({'result':'Success','msg':'MODIFY complete'})
    elif role == "REMOVE":
        print(role)
        return jsonify({'result':'Success','msg':'REMOVE complete'})
    else:
        return jsonify({'result':'Fail','msg':'Unknown role'})

if __name__ == '__main__':
    app.run('0.0.0.0', port=5000, debug=True)