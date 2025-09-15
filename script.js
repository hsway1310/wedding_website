document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('nav a[href^="#"]');

    // New video modal elements
    const under35Btn = document.getElementById('under-35-btn');
    const over35Btn = document.getElementById('over-35-btn');
    const videoModal = document.getElementById('video-modal');
    const closeVideoBtn = document.getElementById('close-video-btn');
    const fullVideoPlayer = document.getElementById('full-video-player');

    // SCROLL PROMPT ELEMENTS
    const scrollPrompt = document.getElementById('scroll-prompt');
    const footer = document.getElementById('the-footer'); // Get the footer element by its new ID

    // Define the sections to cycle through
    const sections = [
        document.querySelector('header.hero-video-container'),
        document.getElementById('save-the-date'),
        document.getElementById('photo-collage'),
        document.getElementById('the-footer'),
    ];
    
    // Smooth scroll logic for the scroll prompt
    if (scrollPrompt) {
        scrollPrompt.addEventListener('click', function(event) {
            event.preventDefault();
            
            let nextSection = null;

            // Determine which section is currently at the top of the viewport
            for (let i = 0; i < sections.length; i++) {
                const rect = sections[i].getBoundingClientRect();
                // A section is considered current if its top is roughly at the top of the viewport
                if (rect.top <= window.innerHeight * 0.5 && rect.bottom > 0) {
                    // If we found a current section and it's not the last one, get the next one
                    if (i < sections.length - 1) {
                        nextSection = sections[i + 1];
                    }
                    break; // Exit the loop once the current section is found
                }
            }
            
            // If no section is found as "current" (e.g., at the very top of the page), scroll to the first one
            if (!nextSection) {
                nextSection = sections[0];
            }

            if (nextSection) {
                nextSection.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    }

    // Hide/Show scroll prompt based on scroll position, using the footer
    if (scrollPrompt && footer) {
        window.addEventListener('scroll', function() {
            const rect = footer.getBoundingClientRect();
            const windowHeight = window.innerHeight || document.documentElement.clientHeight;

            // Hide the prompt when the top of the footer is visible in the viewport
            if (rect.top <= windowHeight) {
                scrollPrompt.style.opacity = '0';
                scrollPrompt.style.pointerEvents = 'none'; // Makes the element unclickable
            } else {
                scrollPrompt.style.opacity = '1';
                scrollPrompt.style.pointerEvents = 'auto'; // Makes the element clickable again
            }
        });
    }

    // --- NEW VIDEO MODAL LOGIC ---
    // Function to open the modal with a specific video source
    function openModal(videoSrc) {
        if (videoModal && fullVideoPlayer) {
            fullVideoPlayer.src = videoSrc;
            fullVideoPlayer.load();
            fullVideoPlayer.play();
            videoModal.classList.remove('hidden');
            videoModal.classList.add('flex');
        }
    }

    // Function to close the modal and pause the video
    function closeModal() {
        if (videoModal && fullVideoPlayer) {
            fullVideoPlayer.pause();
            fullVideoPlayer.currentTime = 0;
            videoModal.classList.add('hidden');
            videoModal.classList.remove('flex');
        }
    }

    // Event listeners for the new buttons
    if (under35Btn && over35Btn) {
        under35Btn.addEventListener('click', () => {
            const videoSrc = under35Btn.getAttribute('data-video');
            openModal(videoSrc);
        });

        over35Btn.addEventListener('click', () => {
            const videoSrc = over35Btn.getAttribute('data-video');
            openModal(videoSrc);
        });
    }

    // Event listener for the close button
    if (closeVideoBtn) {
        closeVideoBtn.addEventListener('click', closeModal);
    }
    
    // Handle video ending to close the modal
    if (fullVideoPlayer) {
        fullVideoPlayer.addEventListener('ended', closeModal);
    }
    // --- END NEW VIDEO MODAL LOGIC ---

    function centerFirstSection() {
        const firstSection = document.getElementById('watch-video-btn');
        if (firstSection && window.innerWidth <= 768) {
            const elementRect = firstSection.getBoundingClientRect();
            const absoluteElementTop = elementRect.top + window.pageYOffset;
            const middle = absoluteElementTop - (window.innerHeight / 2) + (elementRect.height / 2);
            window.scrollTo({
                top: middle,
                behavior: 'smooth'
            });
        }
    }

    centerFirstSection();
    window.addEventListener('orientationchange', () => {
        setTimeout(centerFirstSection, 100);
    });

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // The old video logic below is now outdated and can be removed or replaced.
    // The new code above handles everything.
    // if (watchVideoBtn && videoModal && closeVideoBtn && fullVideoPlayer) {
    //     watchVideoBtn.addEventListener('click', () => {
    //         videoModal.style.display = 'flex';
    //         fullVideoPlayer.play();
    //     });
    //     closeVideoBtn.addEventListener('click', () => {
    //         videoModal.style.display = 'none';
    //         fullVideoPlayer.pause();
    //         fullVideoPlayer.currentTime = 0;
    //     });
    //     fullVideoPlayer.addEventListener('ended', () => {
    //         videoModal.style.display = 'none';
    //         fullVideoPlayer.currentTime = 0;
    //     });
    // }

    function updateCountdown() {
        const countdownEl = document.getElementById('countdown');
        const eventDate = new Date('2027-06-10T18:00:00');
        const now = new Date();
        if (eventDate - now <= 0) {
            if (countdownEl) {
                countdownEl.innerHTML = "<span class='text-xl font-bold text-gray-900'>It's wedding time!</span>";
            }
            return;
        }

        let years = eventDate.getFullYear() - now.getFullYear();
        let months = eventDate.getMonth() - now.getMonth() + years * 12;
        let days = eventDate.getDate() - now.getDate();
        let hours = eventDate.getHours() - now.getHours();
        let minutes = eventDate.getMinutes() - now.getMinutes();
        let seconds = eventDate.getSeconds() - now.getSeconds();

        if (seconds < 0) { seconds += 60; minutes--; }
        if (minutes < 0) { minutes += 60; hours--; }
        if (hours < 0) { hours += 24; days--; }
        if (days < 0) {
            const prevMonth = new Date(eventDate.getFullYear(), eventDate.getMonth(), 0);
            days += prevMonth.getDate();
            months--;
        }
        if (months < 0) { months += 12; }
        
        if (countdownEl) {
            countdownEl.innerHTML = `
                <div class="flip-countdown flex flex-nowrap justify-center items-center gap-1 sm:gap-2 md:gap-3">
                    <div class="flip-segment">
                        <span class="flip-label text-[10px] sm:text-xs font-['Playfair']">Months</span>
                        <span class="flip-value bg-gray-900 text-white rounded-md text-lg sm:text-xl md:text-3xl p-1 sm:p-2">${String(months).padStart(2, '0')}</span>
                    </div>
                    <span class="flip-colon flex items-center text-black text-lg sm:text-xl font-bold">:</span>
                    <div class="flip-segment">
                        <span class="flip-label text-[10px] sm:text-xs font-['Playfair']">Days</span>
                        <span class="flip-value bg-gray-900 text-white rounded-md text-lg sm:text-xl md:text-3xl p-1 sm:p-2">${String(days).padStart(2, '0')}</span>
                    </div>
                    <span class="flip-colon flex items-center text-black text-lg sm:text-xl font-bold">:</span>
                    <div class="flip-segment">
                        <span class="flip-label text-[10px] sm:text-xs font-['Playfair']">Hours</span>
                        <span class="flip-value bg-gray-900 text-white rounded-md text-lg sm:text-xl md:text-3xl p-1 sm:p-2">${String(hours).padStart(2, '0')}</span>
                    </div>
                    <span class="flip-colon flex items-center text-black text-lg sm:text-xl font-bold">:</span>
                    <div class="flip-segment">
                        <span class="flip-label text-[10px] sm:text-xs font-['Playfair']">Minutes</span>
                        <span class="flip-value bg-gray-900 text-white rounded-md text-lg sm:text-xl md:text-3xl p-1 sm:p-2">${String(minutes).padStart(2, '0')}</span>
                    </div>
                    <span class="flip-colon flex items-center text-black text-lg sm:text-xl font-bold">:</span>
                    <div class="flip-segment">
                        <span class="flip-label text-[10px] sm:text-xs font-['Playfair']">Seconds</span>
                        <span class="flip-value bg-gray-900 text-white rounded-md text-lg sm:text-xl md:text-3xl p-1 sm:p-2">${String(seconds).padStart(2, '0')}</span>
                    </div>
                </div>
            `;
        }
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);
});