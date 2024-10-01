from flask import Flask, jsonify, render_template
from flask_cors import CORS  # Import CORS
import requests
from bs4 import BeautifulSoup

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

url = "https://parking.fullerton.edu/ParkingLotCounts/mobile.aspx"

# Hardcoded total spots for each parking lot
total_spots_map = {
    "Nutwood Structure": 2484,
    "State College Structure": 1373,
    "Eastside North": 1880,
    "Eastside South": 1341,
    "Lot A & G": 2104,
    "Fullerton Free Church": 700
}

def scrape_parking_data():
    response = requests.get(url)
    soup = BeautifulSoup(response.text, 'html.parser')

    parking_spots = []
    rows = soup.find_all('tr')

    for row in rows:
        columns = row.find_all('td')
        if columns:
            lot_name = columns[0].text.strip().split('\n')[0]
            available_spots = columns[1].text.strip().split('\n')[0]

            # Fetch the total spots from the hardcoded map
            total_spots = total_spots_map.get(lot_name, 'N/A')

            # Extract the last updated time if available
            date_time = columns[3].text.strip() if len(columns) > 3 else 'N/A'

            # Append the parking data to the list
            parking_spots.append({
                'lot_name': lot_name,
                'available_spots': available_spots,
                'total_spots': total_spots,
                'date_time': date_time
            })

    return parking_spots

@app.route('/')
def display_parking_data():
    parking_data = scrape_parking_data()
    return render_template('index.html', parking_data=parking_data)

@app.route('/about')
def about():
    return render_template('about.html')

@app.route('/contact')
def contact():
    return render_template('contact.html')

@app.route('/get_parking_data')
def get_parking_data():
    parking_data = scrape_parking_data()
    return jsonify(parking_data)

if __name__ == "__main__":
    app.run(debug=True, port=5000)  # Change the port number here
