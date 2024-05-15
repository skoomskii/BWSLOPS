// Import Modules
const querystring = require('querystring');
const https = require('https');

// API Request Body
var Body = querystring.stringify({
    "frame_name": "bottom-frame",
    "frame_text": "ASS",
    "frame_icon_name": "url",
    "qr_code_text": document.getElementById('FormID'),
    "image_format": "PNG",
    "qr_code_logo": "scan-me-square"
});

// HTTPS Request Options
var options = {
    host: 'api.qr-code-generator.com',
    port: 443,
    path: '/v1/create?access-token=jYKy9qRmak2OcvcDQNNkXRUtDxNJIF2jIrNFvTiKyZmqNbCqTyYukjJ64UfvC0tg',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': Body.length
    }
};

// Call QR Code Generator
var callAPI = async () => {
    // Data Container
    let data = '';
    var req = https.request(options, function (res) {
        // Set Encoding
        res.setEncoding('utf8');

        // Capture Response Stream
        res.on('data', (chunk) => {
            data += chunk;
        });

        // Response Stream Captured
        res.on('end', () => {
            console.log(data);
        });
    });

    // Log Errors
    req.on('error', (error) => {
        console.log(error);
    });

    // Terminate Request
    req.end();
}; callAPI();

// Main Function
//async function genQR() {

//};

// Export Base64 QR Image URL
//const imgURL = canvas.toDataURL("image/png").replace(/^data:image\/(png|jpg);base64,/, "");