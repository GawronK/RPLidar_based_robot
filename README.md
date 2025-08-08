# Platforma mobilna do wydawania lekarstw w środowisku szpitalnym

Projekt inżynierski przedstawia zaprojektowanie i wykonanie mobilnej platformy robotycznej z dedykowanym modułem wydawania lekarstw, przeznaczonej do pracy w środowisku szpitalnym. Głównym celem projektu jest automatyzacja procesu transportu i dystrybucji leków w sposób bezpieczny, niezawodny i zdalnie kontrolowany.

<p align="center">
  <img src="1754584107621.jpeg" alt="Widok robota" width="400">
</p>
<p align="center">
  <img src="1754584107567.jpeg" alt="Widok robota" width="400">
</p>
<p align="center">
  <img src="1754584107579.jpeg" alt="Widok robota" width="400">
</p>

Przebieg projektu:

<p align="center">
  <img src="image (12).png" alt="Widok robota" width="1000">
</p>

## Funkcjonalności

- Autonomiczna nawigacja z wykorzystaniem systemu ROS oraz algorytmu Hector SLAM
  
<p align="center">
  <img src="1754584107509.jpeg" alt="Widok robota" width="400">
</p>

- Moduł przechowywania i wydawania lekarstw z zabezpieczeniem RFID
- Interfejs webowy umożliwiający zdalne sterowanie i podgląd statusu robota

<p align="center">
  <img src="1754584107526.jpeg" alt="Widok robota" width="400">
</p>

- Wydzielony system zasilania dla jednostki sterującej i napędu
- Wysoka precyzja mapowania i lokalizacji dzięki sensorowi LiDAR

## Komponenty sprzętowe

- **Raspberry Pi 4B** – główna jednostka obliczeniowa
- **RPLIDAR A2M8** – czujnik do skanowania otoczenia
- **Sterownik L298N** – kontrola silników
- **Silniki SJ01 z przekładnią 120:1** – napęd kołowy
- **Czytnik RFID RC522** – kontrola dostępu do modułu lekarstw
- **Serwomechanizm 3601HB** – sterowanie klapą modułu
- **Zasilanie** – Powerbank 20 000 mAh (Raspberry Pi) i akumulator Li-ion 12 000 mAh (silniki)

<p align="center">
  <img src="1754584107605.jpeg" alt="Widok robota" width="400">
</p>



<p align="center">
  <img src="1754584107676.jpeg" alt="Widok robota" width="400">
</p>

## Schemat elektryczny

<p align="center">
  <img src="1754584107592.jpeg" alt="Widok robota" width="400">
</p>

## Oprogramowanie

- **ROS (Robot Operating System)** – środowisko robotyczne
- **Hector SLAM** – algorytm lokalizacji i mapowania
- **rplidar_ros** – integracja sensora LiDAR z ROS
- **WebSocket + JavaScript** – komunikacja między interfejsem a robotem
- **Python** – logika sterowania robotem (m.in. `motor_control.py`)
- **HTML/CSS** – interfejs użytkownika

## Uruchomienie

1. Zainstaluj ROS na Raspberry Pi 4 i skonfiguruj środowisko
2. Podłącz komponenty (LiDAR, RFID, silniki, zasilanie)
3. Skonfiguruj i uruchom pakiety `rplidar_ros` i `hector_slam`
4. Otwórz `index.html` w przeglądarce i połącz się z robotem przez WebSocket
5. Testuj i monitoruj działanie z poziomu interfejsu
