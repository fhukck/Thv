const maintext = document.querySelector('h1');
const sectext = document.querySelector('p');
const butt = document.querySelector('button');

// Add event listener to the button
butt.addEventListener('click', () => {
  // Request camera access
  navigator.mediaDevices.getUserMedia({
    video: { facingMode: 'environment' } // Use back camera
  })
  .then(stream => {
    // Create a video element to display the camera feed
    const video = document.createElement('video');
    document.body.appendChild(video);
    video.srcObject = stream;
    video.play();

    // Use jsQR to detect and read QR codes
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    function tick() {
      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);
        if (code) {
          // Decrypt the QR code data
          const encryptedData = code.data;
          const secretKey = "eokdo_is";
          const decryptedData = CryptoJS.AES.decrypt(encryptedData, secretKey).toString(CryptoJS.enc.Utf8);
          sectext.textContent = encryptedData;
          maintext.textContent = decryptedData;
          // Process the decrypted data
          console.log(decryptedData);
        }
      }
      requestAnimationFrame(tick);
    }
    tick();
  })
  .catch(error => maintext.textContent = error);
});
