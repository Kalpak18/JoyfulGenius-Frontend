let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;

  // Create a small Chrome-like popup
  const promptDiv = document.createElement('div');
  promptDiv.innerHTML = `
    <div style="
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: white;
      padding: 8px 12px;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.15);
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 14px;
      font-family: sans-serif;
      z-index: 10000;
    ">
      <span>Install Joyful Genius?</span>
      <button id="install-btn" style="
        background: #4f46e5;
        color: white;
        border: none;
        padding: 5px 10px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 13px;
      ">Install</button>
    </div>
  `;

  document.body.appendChild(promptDiv);

  const installBtn = document.getElementById('install-btn');
  installBtn.addEventListener('click', async () => {
    promptDiv.remove();
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        console.log('User accepted install');
      }
      deferredPrompt = null;
    }
  });
});
