#!/usr/bin/env python3

import RPi.GPIO as GPIO
from mfrc522 import SimpleMFRC522
from gpiozero import Servo
from time import sleep

reader = SimpleMFRC522()
servo_pin = 12 
servo = Servo(servo_pin)

def read_selected_uid():
    try:
        with open('selected_uid.txt', 'r') as file:
            return file.read().strip()
    except FileNotFoundError:
        print("Nie znaleziono pliku z zapisanym UID.")
        return None

def smooth_move(servo, start, end, step=0.01, delay=0.02):
    if start < end:
        step_range = range(int(start * 100), int(end * 100), int(step * 100))
    else:
        step_range = range(int(start * 100), int(end * 100), -int(step * 100))

    for value in step_range:
        servo.value = value / 100.0
        sleep(delay)

# Zmienna do śledzenia stanu serwa
servo_position = False

try:
    print("Przyłóż kartę/tag RFID")
    while True:
        servo.value=None
        id, text = reader.read()
        print("UID: ", id)

        selected_uid = read_selected_uid()
        if str(id) == selected_uid:
            if not servo_position:
                smooth_move(servo, -1, 0)
                servo_position = True
            else:
                smooth_move(servo, 0, -1)
                servo_position = False
        else:
            print("UID nie zgadza się z wybranym UID pacjenta.")

        sleep(1)

except KeyboardInterrupt:
    print("Program zakończony przez użytkownika")

finally:
    servo.value = None  # Wyłączenie serwomechanizmu
    GPIO.cleanup()

