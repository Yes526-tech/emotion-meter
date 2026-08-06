const connection = new signalR.HubConnectionBuilder()
    .withUrl("/moodHub")
    .build();

connection.start().catch(function (err) {
    return console.error(err.toString());
});

// Map emotions to specific octopus images and filters
const moodMap = {
    // Red Quadrant (Angry/Furious base)
    'furious': { image: 'furious_jedi_octopus_1786010714248.png', filterClass: 'filter-intense-red' },
    'nervous': { image: 'furious_jedi_octopus_1786010714248.png', filterClass: 'filter-mild-red' },
    'worried': { image: 'angry_jedi_octopus_1786010740799.png', filterClass: 'filter-mild-red' },
    'angry':   { image: 'angry_jedi_octopus_1786010740799.png', filterClass: 'filter-intense-red' },
    
    // Yellow Quadrant (Cheerful/Ecstatic base)
    'cheerful':{ image: 'cheerful_jedi_octopus_1786010818921.png', filterClass: 'filter-mild-yellow' },
    'ecstatic':{ image: 'cheerful_jedi_octopus_1786010818921.png', filterClass: 'filter-intense-yellow' },
    'happy':   { image: 'cheerful_jedi_octopus_1786010818921.png', filterClass: 'filter-mild-yellow' },
    'excited': { image: 'cheerful_jedi_octopus_1786010818921.png', filterClass: 'filter-intense-yellow' },

    // Blue Quadrant (Using jedi_octopus but applying blue filters)
    'lonely':  { image: 'jedi_octopus.png', filterClass: 'filter-intense-blue' },
    'sad':     { image: 'jedi_octopus.png', filterClass: 'filter-mild-blue' },
    'hopeless':{ image: 'jedi_octopus.png', filterClass: 'filter-intense-blue' },
    'disappointed':{ image: 'jedi_octopus.png', filterClass: 'filter-mild-blue' },

    // Green Quadrant (Using jedi_octopus base)
    'ease':    { image: 'jedi_octopus.png', filterClass: 'filter-mild-green' },
    'content': { image: 'jedi_octopus.png', filterClass: 'filter-mild-green' },
    'calm':    { image: 'jedi_octopus.png', filterClass: 'filter-intense-green' },
    'serene':  { image: 'jedi_octopus.png', filterClass: 'filter-intense-green' },
};

let currentEmotion = 'calm';

window.selectMood = function(emotion, mutluluk, stres) {
    currentEmotion = emotion;
    updateUI(emotion);
    
    connection.invoke("UpdateMood", "Gülşah", parseInt(stres), parseInt(mutluluk))
              .catch(function (err) {
                  console.error(err.toString());
              });
};

connection.on("ReceiveMoodUpdate", function (userName, stres, mutluluk) {
    if (userName === "Gülşah") {
        let emotion = determineEmotionFromValues(mutluluk, stres);
        updateUI(emotion);
    }
});

function determineEmotionFromValues(mutluluk, stres) {
    if(stres > 50) {
        if(mutluluk > 50) {
            if(stres == 100 && mutluluk == 100) return 'ecstatic';
            if(stres == 100) return 'cheerful';
            if(mutluluk == 100) return 'excited';
            return 'happy';
        } else {
            if(stres == 100 && mutluluk == 0) return 'furious';
            if(stres == 100) return 'nervous';
            if(mutluluk == 0) return 'worried';
            return 'angry';
        }
    } else {
        if(mutluluk > 50) {
            if(stres == 0 && mutluluk == 100) return 'serene';
            if(stres == 0) return 'calm';
            if(mutluluk == 100) return 'content';
            return 'ease';
        } else {
            if(stres == 0 && mutluluk == 0) return 'hopeless';
            if(stres == 0) return 'disappointed';
            if(mutluluk == 0) return 'lonely';
            return 'sad';
        }
    }
}

function updateUI(emotion) {
    let mainImg = document.getElementById("main-octopus");
    if (!mainImg) return;
    
    const config = moodMap[emotion] || moodMap['calm'];
    
    mainImg.src = "/images/" + config.image;
    mainImg.className = "octopus-img active-img " + config.filterClass;
    
    document.querySelectorAll('.mood-btn').forEach(btn => btn.classList.remove('active-btn'));
    let activeBtn = Array.from(document.querySelectorAll('.mood-btn')).find(btn => btn.getAttribute('onclick').includes("'" + emotion + "'"));
    if(activeBtn) activeBtn.classList.add('active-btn');
}

window.onload = function() {
    updateUI(currentEmotion);
};
