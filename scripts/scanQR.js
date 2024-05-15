// Main Function
function scanQR() {
    OpenCamera();
    scanIMG();
} 

// Get Video Stream
function OpenCamera() {
    navigator.mediaDevices.getUserMedia({
        video:
        {
            width: 300,
            height: 200,
            facingMode: "environment"
        }
    }).then((stream) => {
        const video = document.getElementById("video");
        video.srcObject = stream;
        video.onloadedmetadata = () => { video.play(); };
    }).catch((error) => {
        console.log("Error", error);
    });
}

// Scan Video Stream
function scanIMG() {
    var video = document.getElementById("video");
    var canvas = document.createElement("canvas");
    var ctx = canvas.getContext("2d");
    var icon = document.getElementById("sense");

    video.addEventListener("loadedmetadata", function () {
        // Scale+Draw Canvas Image From Video
        canvas.height = video.videoHeight;
        canvas.width = video.videoWidth;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Pass+Decode Image Data
        var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        var code = jsQR(imageData.data, imageData.width, imageData.height, { inversionAttempts: "dontInvert" });

        // Valid QR
        if (code) {
            document.getElementById("FormID").value = code.data;
            icon.classList.toggle("fa-eye");
        }

        // Invalid QR
        else {
            document.getElementById("FormID").value = "=== QR INVALID ===";
            icon.classList.toggle("fa-eye-slash");
        }
    }, false);

    // Export Base64 QR Image URL
    //const imgURL = canvas.toDataURL("image/png").replace(/^data:image\/(png|jpg);base64,/, "");
}