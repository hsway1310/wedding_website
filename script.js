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

    // Countdown elements and date
    const countdownEl = document.getElementById('countdown');
    const weddingDate = new Date('June 10, 2027 00:00:00').getTime();

    // Countdown function
    const updateCountdown = () => {
        const now = new Date().getTime();
        const distance = weddingDate - now;

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        // countdownEl.textContent = `${days}d ${hours}h ${minutes}m ${seconds}s`;

        countdownEl.innerHTML = `
                <div class="flip-segment">
                    <span class="flip-label text-gray-900">Days</span>
                    <span class="flip-value">${String(days).padStart(2, '0')}</span>
                </div>
                <span class="flip-colon">:</span>
                <div class="flip-segment">
                    <span class="flip-label text-gray-900">Hours</span>
                    <span class="flip-value">${String(hours).padStart(2, '0')}</span>
                </div>
                <span class="flip-colon">:</span>
                <div class="flip-segment">
                    <span class="flip-label text-gray-900">Minutes</span>
                    <span class="flip-value">${String(minutes).padStart(2, '0')}</span>
                </div>
                <span class="flip-colon">:</span>
                <div class="flip-segment">
                    <span class="flip-label text-gray-900">Seconds</span>
                    <span class="flip-value">${String(seconds).padStart(2, '0')}</span>
                </div>
            `;

        if (distance < 0) {
            clearInterval(countdownInterval);
            countdownEl.textContent = "We're married!";
        }
    };

    // Update the countdown every 1 second
    const countdownInterval = setInterval(updateCountdown, 1000);
    updateCountdown(); // Call once immediately to avoid a 1-second delay

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

    // Handle RSVP form submission
    rsvpForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Get form data
        const formData = new FormData(rsvpForm);
        const name = formData.get('name').trim();
        const guests = parseInt(formData.get('guests'), 10);
        const attendance = formData.get('attendance');

        // Client-side duplicate check
        if (submittedNames.has(name.toLowerCase())) {
            showMessage("You have already RSVP'd with this name. Please contact us if you need to update your details.", 'bg-red-200 text-red-800');
            return;
        }

        showMessage("Submitting your RSVP...", 'bg-gray-200 text-gray-800');

        try {
            // This URL is a placeholder. You need to create a server-side endpoint.
            const backendUrl = 'https://your-api-gateway-url/submit-rsvp';

            const response = await fetch(backendUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: name,
                    guests: guests,
                    attendance: attendance
                }),
            });

            if (!response.ok) {
                // Handle server-side errors, including duplicate names
                const errorData = await response.json();
                throw new Error(errorData.message || 'An error occurred.');
            }

            // On successful submission
            submittedNames.add(name.toLowerCase());
            rsvpForm.reset();
            showMessage("Thank you for your RSVP!", 'bg-green-200 text-green-800');

        } catch (error) {
            console.error('Submission error:', error);
            showMessage(`Error submitting RSVP: ${error.message}`, 'bg-red-200 text-red-800');
        }
    });

    function showMessage(message, className) {
        messageBox.textContent = message;
        messageBox.className = `${className} mb-4 p-4 text-center rounded-lg`;
        messageBox.style.display = 'block';
    }

    // Start countdown timer
    updateCountdown();
    setInterval(updateCountdown, 1000);
});
