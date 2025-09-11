document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('nav a[href^="#"]');
    const rsvpForm = document.getElementById('rsvp-form');
    const messageBox = document.getElementById('message-box');

    // New video modal elements
    const watchVideoBtn = document.getElementById('watch-video-btn');
    const videoModal = document.getElementById('video-modal');
    const closeVideoBtn = document.getElementById('close-video-btn');
    const fullVideoPlayer = document.getElementById('full-video-player');

    // New scroll prompt elements
    const scrollPrompt = document.getElementById('scroll-prompt');

    // Get all sections to scroll through, including the footer
    const sections = Array.from(document.querySelectorAll('main section, footer'));

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
                    top: targetElement.offsetTop - 10, // Offset for fixed navigation bar
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
            <div class="flip-countdown flex flex-nowrap justify-center items-center gap-1 sm:gap-2 md:gap-4">
                <div class="flip-segment">
                    <span class="flip-label text-xs sm:text-sm">Months</span>
                    <span class="flip-value text-xl sm:text-2xl md:text-3xl p-1 sm:p-2">${String(months).padStart(2, '0')}</span>
                </div>
                <span class="flip-colon flex items-center text-xl sm:text-2xl font-bold mx-0 sm:mx-1 md:mx-2">:</span>
                <div class="flip-segment">
                    <span class="flip-label text-xs sm:text-sm">Days</span>
                    <span class="flip-value text-xl sm:text-2xl md:text-3xl p-1 sm:p-2">${String(days).padStart(2, '0')}</span>
                </div>
                <span class="flip-colon flex items-center text-xl sm:text-2xl font-bold mx-0 sm:mx-1 md:mx-2">:</span>
                <div class="flip-segment">
                    <span class="flip-label text-xs sm:text-sm">Hours</span>
                    <span class="flip-value text-xl sm:text-2xl md:text-3xl p-1 sm:p-2">${String(hours).padStart(2, '0')}</span>
                </div>
                <span class="flip-colon flex items-center text-xl sm:text-2xl font-bold mx-0 sm:mx-1 md:mx-2">:</span>
                <div class="flip-segment">
                    <span class="flip-label text-xs sm:text-sm">Minutes</span>
                    <span class="flip-value text-xl sm:text-2xl md:text-3xl p-1 sm:p-2">${String(minutes).padStart(2, '0')}</span>
                </div>
                <span class="flip-colon flex items-center text-xl sm:text-2xl font-bold mx-0 sm:mx-1 md:mx-2">:</span>
                <div class="flip-segment">
                    <span class="flip-label text-xs sm:text-sm">Seconds</span>
                    <span class="flip-value text-xl sm:text-2xl md:text-3xl p-1 sm:p-2">${String(seconds).padStart(2, '0')}</span>
                </div>
            </div>
        `;
    }


    // New logic to handle the scroll prompt
    scrollPrompt.addEventListener('click', () => {
        let nextSection = null;
        let currentSectionIndex = -1;

        // Find the current section
        const windowHeight = window.innerHeight;
        const scrollPosition = window.scrollY;

        for (let i = 0; i < sections.length; i++) {
            const section = sections[i];
            const rect = section.getBoundingClientRect();
            // A section is considered "current" if its top is within the viewport
            if (rect.top >= 0 && rect.top <= windowHeight) {
                currentSectionIndex = i;
                break;
            }
        }
        
        // If we found a current section and it's not the last one, get the next one
        if (currentSectionIndex !== -1 && currentSectionIndex < sections.length - 1) {
            nextSection = sections[currentSectionIndex + 1];
        } else if (currentSectionIndex === -1 && sections.length > 0) {
            // This handles the initial click on the hero section
            nextSection = sections[0];
        }

        if (nextSection) {
            const offset = 10; // Offset for fixed navigation bar
            const targetPosition = nextSection.offsetTop - offset;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });

    // Update the scroll handler to hide the prompt at the bottom of the page
    function handleScroll() {
        const documentHeight = document.documentElement.scrollHeight;
        const viewportHeight = window.innerHeight;
        const scrollFromTop = window.scrollY;
        const distanceFromBottom = documentHeight - (scrollFromTop + viewportHeight);
        
        // Hide the prompt when the user is near the bottom of the page
        if (distanceFromBottom <= 100) {
            scrollPrompt.style.opacity = '0';
            scrollPrompt.style.visibility = 'hidden';
        } else {
            scrollPrompt.style.opacity = '1';
            scrollPrompt.style.visibility = 'visible';
        }
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);
    window.addEventListener('scroll', handleScroll);
});
