const connection = new signalR.HubConnectionBuilder()
    .withUrl("/moodHub")
    .build();

// SignalR bağlantısını başlat
connection.start().catch(function (err) {
    return console.error(err.toString());
});

// Diğer kullanıcıdan gelen veriyi al
connection.on("ReceiveMoodUpdate", function (userName, sinir, stres, mutluluk) {
    if (userName === "Gülşah") {
        document.getElementById("gulsahSinirRange").value = sinir;
        document.getElementById("gulsahStresRange").value = stres;
        document.getElementById("gulsahMutlulukRange").value = mutluluk;
        updateUIVisuals("Gülşah");
    } else if (userName === "Yunus Emre") {
        document.getElementById("yunusSinirRange").value = sinir;
        document.getElementById("yunusStresRange").value = stres;
        document.getElementById("yunusMutlulukRange").value = mutluluk;
        updateUIVisuals("Yunus Emre");
    }
});

// Kaydırıcı değiştiğinde sunucuya veri gönder
function sendMoodUpdate(userName) {
    updateUIVisuals(userName);
    
    let sinir, stres, mutluluk;
    if (userName === "Gülşah") {
        sinir = document.getElementById("gulsahSinirRange").value;
        stres = document.getElementById("gulsahStresRange").value;
        mutluluk = document.getElementById("gulsahMutlulukRange").value;
    } else {
        sinir = document.getElementById("yunusSinirRange").value;
        stres = document.getElementById("yunusStresRange").value;
        mutluluk = document.getElementById("yunusMutlulukRange").value;
    }

    connection.invoke("UpdateMood", userName, parseInt(sinir), parseInt(stres), parseInt(mutluluk))
              .catch(function (err) {
                  console.error(err.toString());
              });
}

// Değer etiketlerini ve Ahtapot emojisini/kılıcını güncelle
function updateUIVisuals(userName) {
    let sinir, stres, mutluluk, octopusBox, prefix;
    
    if (userName === "Gülşah") {
        prefix = "gulsah";
    } else {
        prefix = "yunus";
    }

    sinir = document.getElementById(prefix + "SinirRange").value;
    stres = document.getElementById(prefix + "StresRange").value;
    mutluluk = document.getElementById(prefix + "MutlulukRange").value;
    octopusBox = document.getElementById(prefix + "Octopus");

    // Değer etiketlerini güncelle
    document.getElementById(prefix + "SinirVal").innerText = '%' + sinir;
    document.getElementById(prefix + "StresVal").innerText = '%' + stres;
    document.getElementById(prefix + "MutlulukVal").innerText = '%' + mutluluk;

    // Sinir %50'yi geçerse veya Stres %70'i geçerse kızgın ahtapot ve kırmızı kılıç
    if (parseInt(sinir) > 50 || parseInt(stres) > 70) {
        octopusBox.innerHTML = '🐙🧨';
        octopusBox.className = 'octopus-container saber-glow-red';
    } 
    // Mutluluk yüksekse mor/mavi kılıç ve mutlu ahtapot
    else {
        if(userName === "Gülşah") {
            octopusBox.innerHTML = '🐙💜';
            octopusBox.className = 'octopus-container saber-glow-purple';
        } else {
            octopusBox.innerHTML = '🐙💙';
            octopusBox.className = 'octopus-container saber-glow-purple'; // Yunus Emre için de mor yapabiliriz veya mavi kılıç
        }
    }
}

// Sayfa yüklendiğinde ilk görsel güncellemeleri yap
window.onload = function() {
    updateUIVisuals("Gülşah");
    updateUIVisuals("Yunus Emre");
};
