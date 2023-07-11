const canvas = document.getElementById("jsCanvas");
const ctx = canvas.getContext("2d");
const clearButton = document.getElementById('clearButton');
const guessButton = document.getElementById('guessButton');

canvas.width = 500;
canvas.height = 500;

ctx.fillStyle = "white";
ctx.fillRect(0, 0, canvas.width, canvas.height);
ctx.strokeStyle = "black";
ctx.lineWidth = 20;

let painting = false;

function startPainting() {
    painting=true;
}
function stopPainting(event) {
    painting=false;
}

function onMouseMove(event) {
    const x = event.offsetX;
    const y = event.offsetY;
    if(!painting) {
        ctx.beginPath();
        ctx.moveTo(x, y);
    }
    else {
        ctx.lineTo(x, y);
        ctx.stroke();
    }
}

if (canvas) {
    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mousedown", startPainting);
    canvas.addEventListener("mouseup", stopPainting);
    canvas.addEventListener("mouseleave", stopPainting);
}

clearButton.addEventListener('click', () => {
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    document.getElementById("result").textContent = "";
})

$(function(){
    $('#guessButton').on('click', function(){
        var base64Image = canvas.toDataURL("image/png");
        var jsonObject = {
            "image": base64Image
        };

        fetch('http://192.168.224.48:5000/predict', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(jsonObject)
        })
            .then(response => response.json())
            .then(data => {
                // 예측 결과 데이터 사용
                console.log(data.prediction);
                // 추가적인 작업 수행
                document.getElementById("result").innerHTML = "예측값 : " + data.prediction + "<br />" + data.per + "% 확률로 예측";
            })
            .catch(error => {
                // 오류 처리
                console.error('Error:', error);
            });
    });
});