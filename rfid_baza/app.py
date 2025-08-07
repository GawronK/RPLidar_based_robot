from flask import Flask, render_template, request, jsonify
import sqlite3

DATABASE = './MojaBazaDanych.db'

app = Flask(__name__)

selected_uid = None

def get_db():
    db = sqlite3.connect(DATABASE)
    return db

def query_db(query, args=(), one=False):
    cur = get_db().cursor()
    cur.execute(query, args)
    rv = cur.fetchall()
    cur.close()
    return (rv[0] if rv else None) if one else rv

@app.route('/', methods=['GET', 'POST'])
def index():
    db = get_db()
    cursor = db.cursor()
    cursor.execute('SELECT * FROM pacjenci')
    pacjenci = cursor.fetchall()
    cursor.close()
    db.close()
    return render_template('index.html', pacjenci=pacjenci)

def save_selected_uid(uid):
    with open('selected_uid.txt', 'w') as file:
        file.write(uid)

@app.route('/set_selected_patient', methods=['POST'])
def set_selected_patient():
    global selected_uid
    selected_uid = request.form['uid']
    save_selected_uid(selected_uid)  # Zapisz UID do pliku
    print(f"UID pacjenta ustawiony na: {selected_uid}")
    return jsonify({'status': 'success', 'uid': selected_uid})

if __name__ == '__main__':
    app.run(debug=True)