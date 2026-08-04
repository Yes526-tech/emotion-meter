const connection = new signalR.HubConnectionBuilder()
    .withUrl("/moodHub")
    .build();

connection.start().catch(function (err) {
    return console.error(err.toString());
});

// Diğer cihazlardan gelen veriyi al
connection.on("ReceiveMoodUpdate", function (userName, stres, mutluluk) {
    if (userName === "Gülşah") {
        document.getElementById("stresRange").value = stres;
        document.getElementById("mutlulukRange").value = mutluluk;
        updateUIVisuals();
    }
});

// Kaydırıcı değiştiğinde sunucuya veri gönder
window.sendMoodUpdate = function() {
    updateUIVisuals();
    
    let stres = document.getElementById("stresRange").value;
    let mutluluk = document.getElementById("mutlulukRange").value;

    connection.invoke("UpdateMood", "Gülşah", parseInt(stres), parseInt(mutluluk))
              .catch(function (err) {
                  console.error(err.toString());
              });
}

// Değer etiketlerini, ışın kılıcı dolgularını ve Ahtapot algoritmasını güncelle
function updateUIVisuals() {
    let stresRange = document.getElementById("stresRange");
    let mutlulukRange = document.getElementById("mutlulukRange");
    
    let stres = parseInt(stresRange.value);
    let mutluluk = parseInt(mutlulukRange.value);

    // Değer etiketlerini güncelle
    document.getElementById("stresVal").innerText = '%' + stres;
    document.getElementById("mutlulukVal").innerText = '%' + mutluluk;

    // Slider dolgu (fill) oranlarını CSS değişkenine ata
    stresRange.style.setProperty('--val', stres + '%');
    mutlulukRange.style.setProperty('--val', mutluluk + '%');

    // === DİNAMİK IŞIN KILICI RENGİ (SİNİR -> MUTLULUK) ===
    // 0 = Kırmızı, 50 = Mor, 100 = Yeşil
    let bladeColor = "";
    let bladeGlow = "";
    if (mutluluk < 40) {
        bladeColor = "#ff0000"; // Sith Kırmızısı
        bladeGlow = "rgba(255, 0, 0, 0.8)";
    } else if (mutluluk <= 60) {
        bladeColor = "#b366ff"; // Denge Moru
        bladeGlow = "rgba(179, 102, 255, 0.8)";
    } else {
        bladeColor = "#00ff00"; // Jedi Yeşili
        bladeGlow = "rgba(0, 255, 0, 0.8)";
    }
    
    // Mutluluk barının rengini ez (saber-purple class'ını dinamikleştir)
    mutlulukRange.parentElement.style.setProperty('--blade-color', bladeColor);
    mutlulukRange.parentElement.style.setProperty('--blade-glow', bladeGlow);


    // === DUYGU ALGORİTMASI ===
    let selectedId = "img-zen"; // Varsayılan

    if (stres > 70) {
        selectedId = "img-stressed"; // Yorgun/Stresli
    } else {
        if (mutluluk <= 10) {
            selectedId = "img-furious"; // Patlamaya Hazır (0-10)
        } else if (mutluluk > 10 && mutluluk <= 40) {
            selectedId = "img-angry"; // Sinirli (11-40)
        } else if (mutluluk > 40 && mutluluk <= 60) {
            selectedId = "img-zen"; // Dengeli (41-60)
        } else if (mutluluk > 60 && mutluluk < 90) {
            selectedId = "img-happy"; // Mutlu (61-89)
        } else if (mutluluk >= 90) {
            selectedId = "img-ecstatic"; // Aşırı Mutlu, Kalpli (90-100)
        }
    }

    // Aktif resmi değiştir
    document.querySelectorAll('.octopus-img').forEach(img => {
        if (img.id === selectedId) {
            img.classList.add('active-img');
        } else {
            img.classList.remove('active-img');
        }
    });
}

window.onload = function() {
    updateUIVisuals();
};
