document.addEventListener('DOMContentLoaded', function () {
    // Function to fetch and update parking data
    function updateParkingData() {
        fetch('/get_parking_data')
            .then(response => response.json())
            .then(data => {
                const parkingDataContainer = document.getElementById('parking-data');
                parkingDataContainer.innerHTML = ''; // Clear previous data

                data.forEach(lot => {
                    const lotElement = document.createElement('div');
                    lotElement.classList.add('lot');

                    // Calculate the percentage of available spots
                    const availableSpots = parseInt(lot.available_spots);
                    const totalSpots = parseInt(lot.total_spots);
                    let percentage = 0;

                    if (!isNaN(availableSpots) && !isNaN(totalSpots) && totalSpots > 0) {
                        percentage = ((availableSpots / totalSpots) * 100).toFixed(2);
                    }

                    // Create HTML structure for each parking lot with progress bar
                    lotElement.innerHTML = `
                        <h3>${lot.lot_name}</h3>
                        <p>Available Spots: ${lot.available_spots}</p>
                        <p>Total Spots: ${lot.total_spots}</p>
                        <div class="progress-container">
                            <div class="progress-bar" style="width: 0%;" data-percentage="${percentage}"></div>
                        </div>
                        <p class="progress-text">${percentage}% Available</p>
                        <button 
                            class="alert-button" 
                            data-lot="${lot.lot_name}" 
                            data-available="${lot.available_spots}" 
                            data-total="${lot.total_spots}">
                            Check Availability
                        </button>
                    `;

                    // Append to the container
                    parkingDataContainer.appendChild(lotElement);
                });

                // Animate the progress bars after they are added to the DOM
                animateProgressBars();

                // Rebind alert buttons
                bindAlertButtons();
            })
            .catch(error => console.error('Error fetching parking data:', error));
    }

    // Function to bind alert buttons
    function bindAlertButtons() {
        const buttons = document.querySelectorAll('.alert-button');

        buttons.forEach(button => {
            button.addEventListener('click', function () {
                const lotName = this.getAttribute('data-lot');
                const availableSpots = parseInt(this.getAttribute('data-available'));
                const totalSpots = parseInt(this.getAttribute('data-total'));

                if (!isNaN(availableSpots) && !isNaN(totalSpots) && totalSpots > 0) {
                    const percentage = ((availableSpots / totalSpots) * 100).toFixed(2);
                    alert(`Parking Lot: ${lotName}\nAvailable Spots: ${availableSpots}\nPercentage Available: ${percentage}%`);
                } else {
                    alert(`Parking Lot: ${lotName}\nAvailable Spots: ${availableSpots}\nTotal Spots: Unknown or Not Available`);
                }
            });
        });
    }

    // Function to animate the progress bars
    function animateProgressBars() {
        const progressBars = document.querySelectorAll('.progress-bar');

        progressBars.forEach(bar => {
            const percentage = bar.getAttribute('data-percentage');
            bar.style.width = `${percentage}%`;  // Set the width based on the percentage
        });
    }

    // Initial fetch when the page loads
    updateParkingData();

    // Fetch updated data every 10 seconds
    setInterval(updateParkingData, 10000);
});
