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
});
