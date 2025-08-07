#!/usr/bin/env python3

import RPi.GPIO as GPIO
import sqlite3
from mfrc522 import SimpleMFRC522

DATABASE = './MojaBazaDanych.db'
reader = SimpleMFRC522()

def find_patient_by_rfid(uid):
    db = sqlite3.connect(DATABASE)
    cursor = db.cursor()
    cursor.execute("SELECT * FROM pacjenci WHERE numer_rfid = ?", (uid,))
    patient = cursor.fetchone()
    cursor.close()
    db.close()
    return patient

try:
    while True:
        print("Przyłóż kartę/tag RFID do czytnika...")
        uid, text = reader.read()
        print(f"UID: {uid}")
        
        patient = find_patient_by_rfid(str(uid))
        if patient:
            print(f"Znaleziono pacjenta: {patient[1]} {patient[2]}")
        else:
            print("Pacjent nie znaleziony.")
finally:
    GPIO.cleanup()

