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
    const tooltipEl = document.getElementById('countdown-tooltip'); // Get the new tooltip element

    // Function to update the tooltip text
    const updateTooltip = () => {
        const now = new Date().getTime();
        const distanceInDays = Math.floor((weddingDate - now) / (1000 * 60 * 60 * 24));

        if (distanceInDays > 365) {
            tooltipEl.textContent = "Relax, we're still planning";
        } else if (distanceInDays <= 365 && distanceInDays > 180) {
            tooltipEl.textContent = "Less than a year now!";
        } else if (distanceInDays <= 180 && distanceInDays > 90) {
            tooltipEl.textContent = "Have you booked your flights?";
        } else if (distanceInDays <= 90 && distanceInDays > 30) {
            tooltipEl.textContent = "Getting close!";
        } else if (distanceInDays <= 30 && distanceInDays > 0) {
            tooltipEl.textContent = "Too late to back out now!";
        } else {
            tooltipEl.textContent = "We're married!";
        }
    };

    // New plane journey elements and dates
    const planeEmoji = document.getElementById('plane-emoji');
    const today = new Date().getTime();
    // const today = new Date('September 9, 2026 00:00:00');
    const startDate = new Date('September 9, 2025 00:00:00').getTime(); //RSVP deadline
    const totalJourney = weddingDate - startDate;

    // Countdown function
    const updateCountdown = () => {
        const today = new Date().getTime(); 
        const weddingDate = new Date('October 26, 2025 10:00:00').getTime(); // Example wedding date
        const distance = weddingDate - today;

        // Calculate months first and get the remainder
        const totalDays = Math.floor(distance / (1000 * 60 * 60 * 24));
        const months = Math.floor(totalDays / 30.44);
        const remainingDays = totalDays % 30.44;

        // Use the remainder to calculate the next unit
        const days = Math.floor(remainingDays); 
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        countdownEl.innerHTML = `
                <div class="flip-segment">
                    <span class="flip-label text-gray-900">Months</span>
                    <span class="flip-value">${String(months).padStart(2, '0')}</span>
                </div>
                <span class="flip-colon">:</span>
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

    // New function to update the plane's position based on progress
    const updatePlanePosition = () => {
        if (!planeEmoji) return; // Exit if the element is not found
        const today = new Date().getTime(); // Recalculate current time
        const elapsedTime = today - startDate;
        const progress = Math.min(Math.max(elapsedTime / totalJourney, 0), 1); // Clamp progress between 0 and 1
        const maxDistance = 90; // The maximum percentage of the viewport width to move
        const position = progress * maxDistance;
        planeEmoji.style.transform = `translateX(${position}vw)`;
    };


    // Update the countdown and tooltip every second
    const countdownInterval = setInterval(() => {
        updateCountdown();
        updatePlanePosition();
        updateTooltip();
    }, 1000);

    // Initial call to avoid delay
    updateCountdown();
    updatePlanePosition();
    updateTooltip();


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

    // // Start countdown timer
    updateCountdown();
    setInterval(updateCountdown, 1000);
});