
function optenerNumero(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

//const colors = ["#0f99dd", "#35bbdd", "#68dca7", "#e3f46c", "#fcfd61", "#fecf4f", "#fea43d", "#fa4815", "#fa4815"];
const colors = ['#00FF90', '#00FF6C', '#00FF48', '#00FF24', '#00FF00', '#24FF00', '#48FF00', '#6CFF00', '#90FF00', '#B4FF00', '#D8FF00', '#FFFF00', '#FFD800', '#FFB400', '#FF9000', '#FF6C00', '#FF4800', '#FF2400', '#FF0000'];

function obtenerColor(v) {
    var z = v / 255
    if (z < 0) { z = 0 } else if (z > 1) { z = 1 } else if (isNaN(z)) { z = 0 }
    return colors[Math.floor((colors.length - 1) * z)]
}
const url_base = "https://dl.dropboxusercontent.com"
const music_url = [
    {
        url:url_base+"/scl/fi/qknhtkk1kxv56scs3pppz/y2mate.com-MARQUINHA-DE-FITA-SLOWED-REVERB-TIKTOK-VIRAL.mp3?rlkey=9jqutub4ttdtl9es6q80txtdj&st=npo82xoy"
    },
    {
        url:url_base+"/scl/fi/8m6p6xqzywhzn85uayit0/y2mate.com-HISTED-TXVSTERPLAYA-MASHA-ULTRAFUNK-Brazilian-Funk-Phonk-Tik-Tok-Remix-Viral-2024.mp3?rlkey=ccdna6x8cqo7tocfirzc34ina&st=vqzjmvv3"
    },
    {
        autor: "Desconocido",
        nombre: "I DONT WANT",
        url: url_base + "/scl/fi/78xrq0kiwxqa8ditjovqw/I-DON-T-WANT-TO-SET-THE-WORLD-ON-FIRE-THE-INK-SPOTS-SUBTITULADA.mp3?rlkey=dx2mueyy3ek6mhgkvtaz1j6a9&st=thhj7k66",
    },
    {
        autor: "Piero",
        nombre: "Mi Viejo",
        url: url_base + "/scl/fi/76r417vmg0w554jyydr5x/Piero-Mi-Viejo-Letra-Lyrics-_-Es-un-buen-tipo-mi-viejo.mp3?rlkey=zig4w1cm704b3yfnu6sr2vlpi&st=vn2suac2",
    },
    {
        autor: "Rio Romeo",
        nombre: "Nothings New",
        url: url_base + "/scl/fi/1mvoen1mfu1z5dw5cyo5p/Nothing-s-New-Rio-Romeo-Slowed-down.mp3?rlkey=be5e6zcfmaas6f026klxd3e7q&st=0162711q"
    },
    {
        autor: "Desconocido",
        nombre: "Pollito",
        url: url_base + "/scl/fi/6jjtoocmpip9roeoso47q/El-Pollito-Amarillito-Funk.mp3?rlkey=indv5altibfsxd796g2n12g9v&st=dspmgiqs"
    }
]



const audio = document.getElementById('audio');

const audioSource = document.getElementById('audioSource');
audioSource.src = music_url[0].url;
audio.load(); 

document.addEventListener('DOMContentLoaded', function () {

    let index_music = 0;
    const canvas = document.getElementById('canvas');
    const cCava = { x: 0, y: canvas.height / 2 }
    const ctx = canvas.getContext('2d');
    //botones de adelante atras pausar
    const boton_adelante = document.getElementById("adelante");
    const boton_atras = document.getElementById("atras");
    const pause_play = document.getElementById("pause_play");;



    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const analyser = audioContext.createAnalyser();
    const source = audioContext.createMediaElementSource(audio);
    source.connect(analyser);
    analyser.connect(audioContext.destination);
    analyser.fftSize = 128;//32, 64, 128, 256, 512, 1024, 2048 

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    function draw() {
        document.getElementById("info-music").style.padding =  dataArray[parseInt(bufferLength/2)]==0  ? "15px" : ((20*dataArray[parseInt(bufferLength/2)])/255 + "px");
        requestAnimationFrame(draw);

        analyser.getByteFrequencyData(dataArray);

        // Fondo transparente
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const barWidth = (canvas.width / bufferLength) * 1;
        let barHeight;
        let x = 0;
        for (let i = 0; i < bufferLength; i++) {
            //barHeight = dataArray[optenerNumero(16,48)] / 255 * (canvas.height*0.4); // Escalar la altura de la barra
            barHeight = dataArray[i] / 255 * (canvas.height * 0.4); // Escalar la altura de la barra

            // Color blanco brillante
            ctx.fillStyle = 'rgb(255, 255, 255)'; 
            //cd ctx.fillStyle = obtenerColor(dataArray[i])
            //barras de abajo hacia arriba
            //ctx.fillRect(x, cCava.y - barHeight+20, ancBarra, barHeight);
            ctx.fillRect(x, cCava.y - barHeight, barWidth, barHeight);

            //minicuadr0s
            ctx.fillRect(x, cCava.y - barHeight, barWidth, 2); //importante 

            //barras de arriba hacia abajo
            ctx.fillRect(x, cCava.y, barWidth, barHeight);


            x += barWidth + 1;
        }
    }
    audio.addEventListener('play', () => {
        audioContext.resume().then(() => {
            draw();
        });
    });
    boton_adelante.addEventListener('click', function () {
        index_music = (index_music + 1) % music_url.length;
        cambiarAudio();
    });
    boton_atras.addEventListener('click', function () {
        index_music = (index_music - 1 + music_url.length) % music_url.length;
        cambiarAudio();

    });
    let estaPausado = true;
    pause_play.addEventListener('click', function () {
        if(estaPausado){
            audio.play();
            estaPausado =false;
            document.getElementById("img_play_pause").src = "img/pause.png";
        }else if(!estaPausado){
            audio.pause();
            estaPausado=true;
            document.getElementById("img_play_pause").src = "img/play.png";

        }

    });
    function cambiarAudio() {
        console.log("index_music:", index_music)
        audioSource.src = music_url[index_music].url;
        audio.load();
        audio.play();
    }
}); 