import json
from websocket_server import WebsocketServer
import RPi.GPIO as GPIO

# Definicje pinów
in1 = 24
in2 = 27
in3 = 22 #17
in4 = 23
enA = 13
enB = 13
PWM_SPEED = 40

GPIO.setwarnings(False)
# Ustawienia początkowe GPIO
GPIO.setmode(GPIO.BCM)
GPIO.setup([in1, in2, in3, in4], GPIO.OUT)
GPIO.setup([enA, enB], GPIO.OUT)

# Ustawienie PWM dla obu silników
pwmA = GPIO.PWM(enA, 100)  # 100Hz
pwmB = GPIO.PWM(enB, 100)  # 100Hz
pwmA.start(0)
pwmB.start(0)

# Funkcje sterujące silnikami
def motor_backward():
    GPIO.output(in1, GPIO.HIGH)
    GPIO.output(in2, GPIO.LOW)
    GPIO.output(in3, GPIO.HIGH)
    GPIO.output(in4, GPIO.LOW)
    pwmA.ChangeDutyCycle(PWM_SPEED)
    pwmB.ChangeDutyCycle(PWM_SPEED)

def motor_forward():
    GPIO.output(in1, GPIO.LOW)
    GPIO.output(in2, GPIO.HIGH)
    GPIO.output(in3, GPIO.LOW)
    GPIO.output(in4, GPIO.HIGH)
    pwmA.ChangeDutyCycle(PWM_SPEED)
    pwmB.ChangeDutyCycle(PWM_SPEED)

def motor_stop():
    GPIO.output([in1, in2, in3, in4], GPIO.LOW)
    pwmA.ChangeDutyCycle(0)
    pwmB.ChangeDutyCycle(0)

def motor_left():
    GPIO.output(in1, GPIO.HIGH)
    GPIO.output(in2, GPIO.LOW)
    GPIO.output(in3, GPIO.LOW)
    GPIO.output(in4, GPIO.HIGH)
    pwmA.ChangeDutyCycle(PWM_SPEED)
    pwmB.ChangeDutyCycle(PWM_SPEED)

def motor_right():
    GPIO.output(in1, GPIO.LOW)
    GPIO.output(in2, GPIO.HIGH)
    GPIO.output(in3, GPIO.HIGH)
    GPIO.output(in4, GPIO.LOW)
    pwmA.ChangeDutyCycle(PWM_SPEED)
    pwmB.ChangeDutyCycle(PWM_SPEED)
# Mapowanie komend do funkcji
motor_commands = {
    'forward': motor_forward,
    'backward': motor_backward,
    'stop': motor_stop,
    'left': motor_left,
    'right': motor_right,
}

# Funkcje obsługi WebSocket
def new_client(client, server):
    print("New client connected")

def client_left(client, server):
    print("Client disconnected")

def on_message_received(client, server, message):
    try:
        data = json.loads(message)
        command = data['command']
        if command in motor_commands:
            motor_commands[command]()
            print(f"Command: {command}, PWM Speed: {PWM_SPEED}%")
        else:
            print(f"Unknown command: {command}")
    except json.JSONDecodeError as e:
        print("JSON decode error:", e)
    except Exception as e:
        print("Unexpected error:", e)

# Uruchomienie serwera WebSocket
server = WebsocketServer(host='192.168.100.9', port=9080)
server.set_fn_new_client(new_client)
server.set_fn_client_left(client_left)
server.set_fn_message_received(on_message_received)
server.run_forever()

