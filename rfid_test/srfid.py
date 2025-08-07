import RPi.GPIO as GPIO
from mfrc522 import SimpleMFRC522

reader = SimpleMFRC522()

try:
    print("Przyłóż kartę/tag RFID, aby odczytać UID")
    
    while True:
        try:
            id, text = reader.read()
            print("UID: ", id)
            
        except KeyboardInterrupt:
        
            break

finally:
    GPIO.cleanup()
    print("Zakończenie pracy z modułem RFID")

