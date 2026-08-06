const connection = new signalR.HubConnectionBuilder()
    .withUrl("/moodHub")
    .build();

connection.start().catch(err => console.error(err.toString()));

let currentAngle = 0; // Default straight up (Happy)
let isDragging = false;
let aiDebounceTimer = null;

// Angles map to CSS rotation where Top is 0, Left is -90, Right is 90
const segments = [
    { name: 'furious', label: "I'M NOT GOOD", min: -90, max: -60, mutluluk: 0, stres: 100 },
    { name: 'angry', label: "Kızgın", min: -60, max: -30, mutluluk: 20, stres: 80 },
    { name: 'worried', label: "Endişeli", min: -30, max: 0, mutluluk: 40, stres: 60 },
    { name: 'happy', label: "Mutlu", min: 0, max: 30, mutluluk: 60, stres: 40 },
    { name: 'cheerful', label: "Neşeli", min: 30, max: 60, mutluluk: 80, stres: 20 },
    { name: 'ecstatic', label: "Harika", min: 60, max: 90, mutluluk: 100, stres: 0 }
];

function initGauge() {
    const gaugeWrapper = document.querySelector('.gauge-wrapper');
    if (!gaugeWrapper) return;
    
    gaugeWrapper.addEventListener('mousedown', startDrag);
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', endDrag);
    
    gaugeWrapper.addEventListener('touchstart', startDrag);
    document.addEventListener('touchmove', drag, {passive: false});
    document.addEventListener('touchend', endDrag);
    
    setNeedleAngle(0); // Default to middle (Happy)
}

function startDrag(e) {
    isDragging = true;
    drag(e);
}

function endDrag() {
    if (!isDragging) return;
    isDragging = false;
    
    const segment = segments.find(s => currentAngle >= s.min && currentAngle <= s.max) || segments[0];
    
    connection.invoke("UpdateMood", "Gülşah", segment.stres, segment.mutluluk)
              .catch(err => console.error(err.toString()));
              
    checkAiTrigger(segment.name);
}

function drag(e) {
    if (!isDragging) return;
    e.preventDefault(); 
    
    const gaugeWrapper = document.querySelector('.gauge-wrapper');
    const rect = gaugeWrapper.getBoundingClientRect();
    
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.bottom; // Origin is at bottom center
    
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    
    const dx = clientX - centerX;
    const dy = clientY - centerY;
    
    let angle = Math.atan2(dy, dx) * 180 / Math.PI;
    angle += 90; 
    
    if (angle < -90) angle = -90;
    if (angle > 90) angle = 90;
    if (dy > 0) {
        if (dx < 0) angle = -90;
        else angle = 90;
    }
    
    setNeedleAngle(angle);
}

function setNeedleAngle(angle) {
    currentAngle = angle;
    document.getElementById('gaugeNeedle').style.transform = `translateX(-50%) rotate(${angle}deg)`;
    
    const segment = segments.find(s => angle >= s.min && angle <= s.max) || segments[0];
    const statusText = document.getElementById('gaugeStatusText');
    statusText.innerText = segment.label;
    
    const colors = ["#ff2a2a", "#ff7700", "#ffcc00", "#aaff00", "#22cc22", "#008800"];
    const idx = segments.indexOf(segment);
    statusText.style.color = colors[idx] || "#ff2a2a";
}

connection.on("ReceiveMoodUpdate", function (userName, stres, mutluluk) {
    if (userName === "Gülşah") {
        let segment = segments.find(s => s.stres === stres && s.mutluluk === mutluluk);
        if (segment) {
            let targetAngle = (segment.min + segment.max) / 2;
            setNeedleAngle(targetAngle);
            checkAiTrigger(segment.name);
        }
    }
});

function checkAiTrigger(moodName) {
    const aiBox = document.getElementById('aiMessageBox');
    const aiText = document.getElementById('aiMessageText');
    
    if (moodName === 'furious') {
        aiBox.style.display = 'flex';
        aiText.innerText = "Emre yazıyor... 💌";
        
        clearTimeout(aiDebounceTimer);
        aiDebounceTimer = setTimeout(() => {
            fetch('/Home/GetHappyMessage')
                .then(r => r.json())
                .then(data => {
                    aiText.innerText = data.message;
                })
                .catch(() => {
                    aiText.innerText = "Bir sorun oluştu ama sen gülümsemeyi unutma! 😊";
                });
        }, 800);
    } else {
        aiBox.style.display = 'none';
    }
}

window.onload = function() {
    initGauge();
};
