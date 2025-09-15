// script.js
document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('nav a[href^="#"]');
    const under35Btn = document.getElementById('under-35-btn');
    const over35Btn = document.getElementById('over-35-btn');
    const videoModal = document.getElementById('video-modal');
    const closeVideoBtn = document.getElementById('close-video-btn');
    const fullVideoPlayer = document.getElementById('full-video-player');
    const scrollPrompt = document.getElementById('scroll-prompt');
    const footer = document.getElementById('the-footer');

    // Define the sections to cycle through
    const sections = [
        document.querySelector('header.hero-video-container'),
        document.getElementById('save-the-date'),
        document.getElementById('photo-collage'),
        document.getElementById('the-footer'),
    ];

    // Throttle function to limit event calls
    const throttle = (func, limit) => {
        let inThrottle;
        return function () {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    };

    // Hide/Show scroll prompt based on scroll position, using the footer
    if (scrollPrompt && footer) {
        const handleScroll = () => {
            const rect = footer.getBoundingClientRect();
            const windowHeight = window.innerHeight || document.documentElement.clientHeight;
            if (rect.top <= windowHeight) {
                scrollPrompt.style.opacity = '0';
                scrollPrompt.style.pointerEvents = 'none';
            } else {
                scrollPrompt.style.opacity = '1';
                scrollPrompt.style.pointerEvents = 'auto';
            }
        };
        window.addEventListener('scroll', throttle(handleScroll, 100)); // Throttled scroll listener
    }

    // Function to open the modal with a specific video source
    function openModal(videoSrc) {
        if (videoModal && fullVideoPlayer) {
            // Append a unique timestamp to the video URL to prevent caching issues
            const cacheBuster = `?t=${new Date().getTime()}`;
            const newVideoSrc = videoSrc + cacheBuster;

            fullVideoPlayer.src = newVideoSrc;
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
            fullVideoPlayer.removeAttribute('src');
            videoModal.classList.add('hidden');
            videoModal.classList.remove('flex');
        }
    }

    // Event listeners for the new buttons, including touchstart for mobile
    if (under35Btn && over35Btn) {
        const under35VideoSrc = under35Btn.getAttribute('data-video');
        const over35VideoSrc = over35Btn.getAttribute('data-video');

        const openUnder35 = () => openModal(under35VideoSrc);
        const openOver35 = () => openModal(over35VideoSrc);

        under35Btn.addEventListener('click', openUnder35);
        under35Btn.addEventListener('touchstart', openUnder35);

        over35Btn.addEventListener('click', openOver35);
        over35Btn.addEventListener('touchstart', openOver35);
    }

    // Event listener for the close button, including touchstart for mobile
    if (closeVideoBtn) {
        const closeVideo = () => closeModal();
        closeVideoBtn.addEventListener('click', closeVideo);
        closeVideoBtn.addEventListener('touchstart', closeVideo);
    }

    if (fullVideoPlayer) {
        fullVideoPlayer.addEventListener('ended', closeModal);
    }

    function centerFirstSection() {
        const firstSection = document.querySelector('header.hero-video-container');
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