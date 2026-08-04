const connection = new signalR.HubConnectionBuilder()
    .withUrl("/moodHub")
    .build();

// SignalR bağlantısını başlat
connection.start().catch(function (err) {
    return console.error(err.toString());
});

// Diğer cihazlardan (veya kendi cihazından tetiklenen) gelen veriyi al
connection.on("ReceiveMoodUpdate", function (userName, sinir, stres, mutluluk) {
    if (userName === "Gülşah") {
        document.getElementById("sinirRange").value = sinir;
        document.getElementById("stresRange").value = stres;
        document.getElementById("mutlulukRange").value = mutluluk;
        updateUIVisuals();
    }
});

// Kaydırıcı değiştiğinde sunucuya veri gönder
window.sendMoodUpdate = function() {
    updateUIVisuals();
    
    let sinir = document.getElementById("sinirRange").value;
    let stres = document.getElementById("stresRange").value;
    let mutluluk = document.getElementById("mutlulukRange").value;

    connection.invoke("UpdateMood", "Gülşah", parseInt(sinir), parseInt(stres), parseInt(mutluluk))
              .catch(function (err) {
                  console.error(err.toString());
              });
}

// Değer etiketlerini, ışın kılıcı dolgularını ve Ahtapot algoritmasını güncelle
function updateUIVisuals() {
    let sinirRange = document.getElementById("sinirRange");
    let stresRange = document.getElementById("stresRange");
    let mutlulukRange = document.getElementById("mutlulukRange");
    
    let sinir = parseInt(sinirRange.value);
    let stres = parseInt(stresRange.value);
    let mutluluk = parseInt(mutlulukRange.value);

    // Değer etiketlerini güncelle
    document.getElementById("sinirVal").innerText = '%' + sinir;
    document.getElementById("stresVal").innerText = '%' + stres;
    document.getElementById("mutlulukVal").innerText = '%' + mutluluk;

    // Slider dolgu (fill) oranlarını CSS değişkenine ata
    sinirRange.style.setProperty('--val', sinir + '%');
    stresRange.style.setProperty('--val', stres + '%');
    mutlulukRange.style.setProperty('--val', mutluluk + '%');

    // === DUYGU ALGORİTMASI ===
    let selectedId = "img-zen"; // Varsayılan: Dengeli / Zen

    if (sinir >= 70) {
        selectedId = "img-angry"; // Sith Ahtapot
    } 
    else if (stres >= 70) {
        selectedId = "img-stressed"; // Yorgun/Stresli Ahtapot
    }
    else if (mutluluk >= 70 && sinir < 40 && stres < 40) {
        selectedId = "img-jedi"; // Süper Mutlu Jedi Ahtapot
    }
    else if (mutluluk >= 40 && sinir < 50 && stres < 50) {
        selectedId = "img-happy"; // Normal Mutlu (Pembe) Ahtapot
    }
    else {
        selectedId = "img-zen"; // Karışık veya Dengeli Durum
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

// Sayfa yüklendiğinde ilk görsel güncellemeleri yap
window.onload = function() {
    updateUIVisuals();
};
