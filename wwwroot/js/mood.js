const connection = new signalR.HubConnectionBuilder()
    .withUrl("/moodHub")
    .build();

// SignalR bağlantısını başlat
connection.start().catch(function (err) {
    return console.error(err.toString());
});

let currentUser = "Gülşah"; // Varsayılan panel

// Kullanıcı değiştirme
window.switchUser = function(userName) {
    currentUser = userName;
    
    // UI değiştirme
    if(userName === "Gülşah") {
        document.getElementById('panel-gulsah').style.display = 'flex';
        document.getElementById('panel-yunus').style.display = 'none';
        document.getElementById('mainTitle').innerText = "GÜLŞAH'IN DUYGU METRESİ";
        
        document.getElementById('btn-gulsah').classList.add('active');
        document.getElementById('btn-yunus').classList.remove('active');
    } else {
        document.getElementById('panel-gulsah').style.display = 'none';
        document.getElementById('panel-yunus').style.display = 'flex';
        document.getElementById('mainTitle').innerText = "YUNUS EMRE'NİN DUYGU METRESİ";
        
        document.getElementById('btn-yunus').classList.add('active');
        document.getElementById('btn-gulsah').classList.remove('active');
    }

    updateUIVisuals(userName);
}

// Diğer kullanıcıdan gelen veriyi al
connection.on("ReceiveMoodUpdate", function (userName, sinir, stres, mutluluk) {
    let prefix = userName === "Gülşah" ? "gulsah" : "yunus";
    
    document.getElementById(prefix + "SinirRange").value = sinir;
    document.getElementById(prefix + "StresRange").value = stres;
    document.getElementById(prefix + "MutlulukRange").value = mutluluk;
    
    // Sadece şu an o kişinin paneline bakıyorsak görseli döndür
    if (userName === currentUser) {
        updateUIVisuals(userName);
    }
});

// Kaydırıcı değiştiğinde sunucuya veri gönder
window.sendMoodUpdate = function(userName) {
    updateUIVisuals(userName);
    
    let prefix = userName === "Gülşah" ? "gulsah" : "yunus";
    let sinir = document.getElementById(prefix + "SinirRange").value;
    let stres = document.getElementById(prefix + "StresRange").value;
    let mutluluk = document.getElementById(prefix + "MutlulukRange").value;

    connection.invoke("UpdateMood", userName, parseInt(sinir), parseInt(stres), parseInt(mutluluk))
              .catch(function (err) {
                  console.error(err.toString());
              });
}

// Değer etiketlerini ve animasyonları güncelle
function updateUIVisuals(userName) {
    let prefix = userName === "Gülşah" ? "gulsah" : "yunus";
    
    let sinirRange = document.getElementById(prefix + "SinirRange");
    let stresRange = document.getElementById(prefix + "StresRange");
    let mutlulukRange = document.getElementById(prefix + "MutlulukRange");
    
    let sinir = sinirRange.value;
    let stres = stresRange.value;
    let mutluluk = mutlulukRange.value;

    // Değer etiketlerini güncelle
    document.getElementById(prefix + "SinirVal").innerText = '%' + sinir;
    document.getElementById(prefix + "StresVal").innerText = '%' + stres;
    document.getElementById(prefix + "MutlulukVal").innerText = '%' + mutluluk;

    // Slider dolgu (fill) oranlarını CSS değişkenine ata
    sinirRange.style.setProperty('--val', sinir + '%');
    stresRange.style.setProperty('--val', stres + '%');
    mutlulukRange.style.setProperty('--val', mutluluk + '%');

    // Ahtapot çevirme (Flip) Animasyonu (Sinir 50'den büyükse kızgın ahtapot döner)
    let visualArea = document.getElementById("visualArea");
    if (parseInt(sinir) > 50 || parseInt(stres) > 70) {
        visualArea.classList.add("is-angry");
    } else {
        visualArea.classList.remove("is-angry");
    }
}

// Sayfa yüklendiğinde ilk görsel güncellemeleri yap
window.onload = function() {
    updateUIVisuals("Gülşah");
    updateUIVisuals("Yunus Emre");
    switchUser("Gülşah");
};
