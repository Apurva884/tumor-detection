document.addEventListener('DOMContentLoaded', function() {
    // Doctor search functionality
    const searchDoctorsBtn = document.getElementById('searchDoctorsBtn');
    const locationInput = document.getElementById('locationInput');
    const searchInitial = document.getElementById('searchInitial');
    const doctorResults = document.getElementById('doctorResults');
    const locationDisplay = document.getElementById('locationDisplay');

    if (searchDoctorsBtn && locationInput) {
        searchDoctorsBtn.addEventListener('click', function() {
            const location = locationInput.value.trim();
            
            if (location) {
                // Update location display
                if (locationDisplay) {
                    locationDisplay.textContent = location;
                }
                
                // Show results and hide initial state
                if (searchInitial && doctorResults) {
                    searchInitial.classList.add('hidden');
                    doctorResults.classList.remove('hidden');
                }
            } else {
                // If no location entered, show a simple alert
                alert('Please enter a location to search for specialists.');
            }
        });

        // Also trigger search on Enter key
        locationInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchDoctorsBtn.click();
            }
        });
    }
});