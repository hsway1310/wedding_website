document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('nav a[href^="#"]');
    const rsvpForm = document.getElementById('rsvp-form');
    const messageBox = document.getElementById('message-box');

    // New video modal elements
    const watchVideoBtn = document.getElementById('watch-video-btn');
    const videoModal = document.getElementById('video-modal');
    const closeVideoBtn = document.getElementById('close-video-btn');
    const fullVideoPlayer = document.getElementById('full-video-player');

    // Simple client-side storage for submitted names
    // Note: For a real application, this check must be done on the server.
    const submittedNames = new Set();
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            const targetId = link.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80, // Offset for fixed navigation bar
                    behavior: 'smooth'
                });
            }
        });
    });

    // Event listener for the "Watch full save the date video" button
    watchVideoBtn.addEventListener('click', () => {
        videoModal.style.display = 'flex'; // Show the modal
        fullVideoPlayer.play(); // Play the video
    });

    // Event listener to close the video modal
    closeVideoBtn.addEventListener('click', () => {
        videoModal.style.display = 'none'; // Hide the modal
        fullVideoPlayer.pause(); // Pause the video
        fullVideoPlayer.currentTime = 0; // Reset video to the beginning
    });

    // Event listener for when the video ends
    fullVideoPlayer.addEventListener('ended', () => {
        videoModal.style.display = 'none'; // Hide the modal
        fullVideoPlayer.currentTime = 0; // Reset video to the beginning
    });

    // Live countdown timer
    function updateCountdown() {
        const countdownEl = document.getElementById('countdown');
        const eventDate = new Date('2027-06-10T18:00:00');
        const now = new Date();

        if (eventDate - now <= 0) {
            countdownEl.innerHTML = "<span class='text-xl font-bold text-gray-900'>It's wedding time!</span>";
            return;
        }

        // Calculate months, days, hours, minutes, seconds
        let years = eventDate.getFullYear() - now.getFullYear();
        let months = eventDate.getMonth() - now.getMonth() + years * 12;
        let days = eventDate.getDate() - now.getDate();
        let hours = eventDate.getHours() - now.getHours();
        let minutes = eventDate.getMinutes() - now.getMinutes();
        let seconds = eventDate.getSeconds() - now.getSeconds();

        if (seconds < 0) {
            seconds += 60;
            minutes--;
        }
        if (minutes < 0) {
            minutes += 60;
            hours--;
        }
        if (hours < 0) {
            hours += 24;
            days--;
        }
        if (days < 0) {
            // Get days in previous month
            const prevMonth = new Date(eventDate.getFullYear(), eventDate.getMonth(), 0);
            days += prevMonth.getDate();
            months--;
        }
        if (months < 0) {
            months += 12;
        }

        countdownEl.innerHTML = `
            <div class="flip-countdown flex flex-row justify-center items-center gap-4">
                <div class="flip-segment">
                    <span class="flip-label">Months</span>
                    <span class="flip-value">${String(months).padStart(2, '0')}</span>
                </div>
                <span class="flip-colon flex items-center text-2xl font-bold mx-2">:</span>
                <div class="flip-segment">
                    <span class="flip-label">Days</span>
                    <span class="flip-value">${String(days).padStart(2, '0')}</span>
                </div>
                <span class="flip-colon flex items-center text-2xl font-bold mx-2">:</span>
                <div class="flip-segment">
                    <span class="flip-label">Hours</span>
                    <span class="flip-value">${String(hours).padStart(2, '0')}</span>
                </div>
                <span class="flip-colon flex items-center text-2xl font-bold mx-2">:</span>
                <div class="flip-segment">
                    <span class="flip-label">Minutes</span>
                    <span class="flip-value">${String(minutes).padStart(2, '0')}</span>
                </div>
                <span class="flip-colon flex items-center text-2xl font-bold mx-2">:</span>
                <div class="flip-segment">
                    <span class="flip-label">Seconds</span>
                    <span class="flip-value">${String(seconds).padStart(2, '0')}</span>
                </div>
            </div>
        `;
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);

});
