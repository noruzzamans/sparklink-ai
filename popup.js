document.addEventListener('DOMContentLoaded', () => {
    const apiKeyInput = document.getElementById('apiKey');
    const saveBtn = document.getElementById('saveBtn');
    const status = document.getElementById('status');
  
    // Load saved key
    chrome.storage.sync.get(['geminiApiKey'], (result) => {
      if (result.geminiApiKey) {
        apiKeyInput.value = result.geminiApiKey;
      }
    });
  
    saveBtn.addEventListener('click', () => {
      const key = apiKeyInput.value.trim();
      if (key) {
        chrome.storage.sync.set({ geminiApiKey: key }, () => {
          status.textContent = 'API Key saved successfully! ✨';
          status.style.color = 'green';
          setTimeout(() => {
            status.textContent = '';
          }, 2000);
        });
      } else {
        status.textContent = 'Please enter a valid key.';
        status.style.color = 'red';
      }
    });
  });
