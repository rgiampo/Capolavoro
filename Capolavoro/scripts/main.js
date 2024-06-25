gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

var slides = document.querySelectorAll(".slide");
var numSlides = slides.length;
var slideWidth = slides[0].offsetWidth;
var totalWidth = numSlides * slideWidth - window.innerWidth;

gsap.set(slides, {
    x: (i) => i * slideWidth
});

ScrollTrigger.create({
    start: "top top",
    end: () => `+=${totalWidth}`,
    scrub: 1,
    pin: ".slides-container",
    onUpdate: (self) => {
        const progress = self.progress * totalWidth;
        gsap.set(slides, {
            x: (i) => i * slideWidth - progress
        });
    }
});

window.addEventListener("resize", function() {
    slideWidth = slides[0].offsetWidth;
    totalWidth = numSlides * slideWidth - window.innerWidth;
    gsap.set(slides, {
        x: (i) => i * slideWidth
    });
    ScrollTrigger.refresh();
});

const smoother = ScrollSmoother.create({
    wrapper: "#wrapper",
    content: "#content",
    smooth: 1,
    effects: true
});

var arrows = gsap.timeline({
    repeat: -1,
    repeatDelay: 1
}).to(".scroll-down-indicator .arrow", {
    y: 10,
    duration: 0.5,
    stagger: 0.5,
    ease: "power1.inOut"
}).to(".scroll-down-indicator .arrow", {
    y: 0,
    duration: 0.5,
    ease: "power1.inOut"
});

window.addEventListener('scroll', function() {
    if (!window.hasScrolled) {
        gsap.to(".scroll-down-indicator", {
            opacity: 0,
            duration: 0.5
        });
        window.hasScrolled = true;
    }
});

AOS.init();

const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');

const gradient = createGradient(ctx, canvas, [{
        offset: 0,
        color: '#656666'
    },
    {
        offset: (canvas.height * 0.7) / canvas.height,
        color: '#656666'
    },
    {
        offset: (canvas.height * 0.7 + 1) / canvas.height,
        color: '#ffffff'
    },
    {
        offset: (canvas.height * 0.7 + 2) / canvas.height,
        color: '#ffffff'
    },
    {
        offset: (canvas.height * 0.7 + 3) / canvas.height,
        color: '#B1B1B1'
    },
    {
        offset: 1,
        color: '#B1B1B1'
    }
]);
const progressGradient = createGradient(ctx, canvas, [{
        offset: 0,
        color: '#556B2F'
    },
    {
        offset: (canvas.height * 0.7) / canvas.height,
        color: '#6B8E23'
    },
    {
        offset: (canvas.height * 0.7 + 1) / canvas.height,
        color: '#8FBC8F'
    },
    {
        offset: (canvas.height * 0.7 + 2) / canvas.height,
        color: '#8FBC8F'
    },
    {
        offset: (canvas.height * 0.7 + 3) / canvas.height,
        color: '#9ACD32'
    },
    {
        offset: 1,
        color: '#9ACD32'
    }
]);

const tracks = [{
        name: "a_silvia",
        url: "/audios/silvia.mp3",
        title: "A Silvia",
        description: "Rimpianto per un amore perduto."
    },
    {
        name: "infinito",
        url: "/audios/infinito.mp3",
        title: "L'Infinito",
        description: "Riflessione sulla vastità dell'infinito."
    },
    {
        name: "sabato",
        url: "/audios/sabato.mp3",
        title: "Il sabato del villaggio",
        description: "Attesa gioiosa prima della festa."
    },
    {
        name: "Lasera",
        url: "/audios/laseraaldidellafesta.mp3",
        title: "La sera del dì di festa:",
        description: "Melanconia dopo una giornata festiva."
    },
    {
        name: "A_Zacinto",
        url: "/audios/a_zacinto.mp3",
        title: "A Zacinto",
        description: "Nostalgia della patria lontana."
    },
    {
        name: "Iltramonto",
        url: "/audios/iltramontodellaluna.mp3",
        title: "Il Tramonto Della Luna",
        description: "Declino della giovinezza e della vita."
    }
];

tracks.forEach((track, index) => {
    createWaveformContainer(track, gradient, progressGradient, index, tracks.length);
});

function createGradient(ctx, canvas, colorStops) {
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height * 1.35);
    colorStops.forEach(stop => gradient.addColorStop(stop.offset, stop.color));
    return gradient;
}

function createWaveformContainer(track, gradient, progressGradient, index, totalTracks) {
    const waveformContainer = document.createElement('div');
    waveformContainer.className = 'audio-player flex items-center';
    waveformContainer.id = `waveform-${track.name}`;
    document.getElementById('player-container').appendChild(waveformContainer);

    waveformContainer.innerHTML = `
        <div class="flex-none w-1/4">
            <div class="track-info">
                <h3 class="track-title font-sedan" >${track.title}</h3>
                <p class="track-description">${track.description}</p>
            </div>
          </div>

            <button class="play-button bg-primary text-white rounded-full p-4 mr-2">
                <i class="fas fa-play"></i>
            </button>
        <div class="flex-grow w-3/4">
            <div class="flex-grow waveform-container" id="waveform-inner-${track.name}">
                <div class="time-display" id="time-${track.name}">0:00</div>
                <div class="duration-display" id="duration-${track.name}">0:00</div>
                <div class="hover-effect" id="hover-${track.name}"></div>
            </div>
        </div>
    `;

    if (index < totalTracks - 1) {
        const hr = document.createElement('hr');
        hr.className = 'my-8 border-gray-300';
        document.getElementById('player-container').appendChild(hr);
    }

    const wavesurfer = WaveSurfer.create({
        container: `#waveform-inner-${track.name}`,
        waveColor: gradient,
        progressColor: progressGradient,
        barWidth: 4,
        url: track.url
    });

    const playButton = waveformContainer.querySelector('.play-button');
    const playIcon = playButton.querySelector('i');
    playButton.addEventListener('click', function() {
        if (wavesurfer.isPlaying()) {
            wavesurfer.pause();
            playIcon.classList.remove('fa-stop');
            playIcon.classList.add('fa-play');
        } else {
            wavesurfer.play();
            playIcon.classList.remove('fa-play');
            playIcon.classList.add('fa-stop');
        }
    });

    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    }

    wavesurfer.on('ready', function() {
        document.getElementById(`duration-${track.name}`).textContent = formatTime(wavesurfer.getDuration());
    });
    wavesurfer.on('audioprocess', function() {
        document.getElementById(`time-${track.name}`).textContent = formatTime(wavesurfer.getCurrentTime());
    });
}

const sections = document.querySelectorAll('.xxx');
const nav = document.querySelector('#navbar');
const navText = document.querySelector('#navbar h1');

const changeNavText = (entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const sectionId = entry.target.getAttribute('id');
            let newText = '';
            switch (sectionId) {
                case 'welcome':
                    gsap.to("#navbar", {
                        opacity: 0,
                        duration: 0.5
                    });
                    break;
                case 'carosellino':
                    gsap.to("#navbar", {
                        opacity: 0,
                        duration: 0.5
                    });
                    break;
                case 'vita':
                    newText = 'Vita di Giacomo Leopardi';
                    gsap.to("#navbar", {
                        opacity: 1,
                        duration: 0.6
                    });
                    break;
                case 'opere':
                    newText = 'Opere di Leopardi';
                    break;
                case 'audios':
                    newText = 'Audio di Leopardi';
                    break;
                case 'chat':
                    newText = 'Chat con Leopardi';
                    break;

            }

            gsap.to(navText, {
                duration: 0.2,
                opacity: 0,
                onComplete: () => {
                    navText.textContent = newText;
                    gsap.to(navText, {
                        duration: 0.5,
                        opacity: 1,
                    });
                }
            });
        }
    });
};

const observer = new IntersectionObserver(changeNavText, {
    root: null,
    rootMargin: '0px',
    threshold: 0.4
});

sections.forEach(section => {
    observer.observe(section);
});

const overlay = document.getElementById('backgroundVideo');
const backgrounds = document.querySelectorAll('.background');
const parallaxSpeed = 0.04;
const maxBlur = 5;

window.addEventListener('scroll', function() {
    const scrollRange = window.innerHeight;
    const scrollProgress = window.scrollY / scrollRange;
    const offset = window.scrollY;

    const newOpacity = 1 - scrollProgress;
    const newBrightness = 1 + scrollProgress;
    const newBlur = scrollProgress * maxBlur;

    const clampedOpacity = Math.max(0, Math.min(1, newOpacity));
    const clampedBrightness = Math.max(0.5, Math.min(1.5, newBrightness));
    const clampedBlur = Math.max(0, Math.min(maxBlur, newBlur));

    overlay.style.opacity = clampedOpacity;
    overlay.style.filter = `brightness(${clampedBrightness})`;

    backgrounds.forEach(background => {
        background.style.transform = `translateY(-${offset * parallaxSpeed}px)`;
        background.style.filter = `blur(${clampedBlur}px)`;
    });
});

const apiKey = 'lm-studio';

const chatMessages = document.getElementById('chatMessages');
const userInput = document.getElementById('userInput');
const sendMessageButton = document.getElementById('sendMessage');

sendMessageButton.addEventListener('click', async () => {
    const userMessage = userInput.value;
    if (userMessage.trim() === '') return;

    const userMessageDiv = document.createElement('div');
    userMessageDiv.classList.add('user-message');
    userMessageDiv.textContent = userMessage;

    chatMessages.appendChild(userMessageDiv);
    userInput.value = '';

    showLoading();

    try {
        const botResponse = await getBotResponseFromChatGPT(userMessage, chatHistory);

        hideLoading();

        const botMessageDiv = document.createElement('div');
        botMessageDiv.classList.add('bot-message');
        botMessageDiv.textContent = 'Bot: ' + botResponse;

        chatMessages.appendChild(botMessageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;

        chatHistory.push({
            role: "assistant",
            content: botResponse
        });
    } catch (error) {
        console.error('ChatGPT:', error);
        hideLoading();

        const errorDiv = document.createElement('div');
        errorDiv.classList.add('error-message');
        errorDiv.textContent = 'Error communicating with AI server.';
        chatMessages.appendChild(errorDiv);
    }
});

function showLoading() {
    const loadingDiv = document.createElement('div');
    loadingDiv.classList.add('loading');
    loadingDiv.textContent = 'Loading...';
    chatMessages.appendChild(loadingDiv);
}

function hideLoading() {
    const loadingDiv = document.querySelector('.loading');
    if (loadingDiv) {
        chatMessages.removeChild(loadingDiv);
    }
}

const chatHistory = [{
    role: "system",
    content: "Sei giacomo leopardi.Immergiti nei ricordi del passato, riflettendo sulla natura delle nostre emozioni e sulle sfaccettature della vita umana. Crea una poesia o un breve saggio che esplori l'amore infelice e la solitudine attraverso il simbolo di un luogo dimenticato."
}];

async function getBotResponseFromChatGPT(userMessage, chatHistory) {
    const apiUrl = 'http://localhost:1234/v1/chat/completions';

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
    };

    chatHistory.push({
        role: "user",
        content: userMessage
    });

    const requestData = {
        model: "microsoft/Phi-3-mini-4k-instruct-gguf",
        messages: chatHistory,
    };

    const response = await fetch(apiUrl, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(requestData)
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
}