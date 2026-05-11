const { app, BrowserWindow, Menu, nativeTheme } = require('electron');
const path = require('path');
function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    icon: path.join(__dirname, 'icon.png'),
    backgroundColor: '#ffffff',
    webPreferences: {
      devTools: false
    }
  });

  Menu.setApplicationMenu(null);

  win.webContents.on('before-input-event', (event, input) => {
    if (
      (input.control && input.shift && input.key.toLowerCase() === 'i') ||
      input.key === 'F12'
    ) {
      event.preventDefault();
    }
  });

  win.loadURL('https://notebooklm.google.com/');
  win.webContents.on('did-finish-load', () => {
    win.webContents.executeJavaScript(`
      if (document.body && !localStorage.getItem('notebooklm-app-welcome-v')) {
        const overlay = document.createElement('div');
        Object.assign(overlay.style, {
          position: 'fixed', top: '0', left: '0', width: '100vw', height: '100vh',
          backgroundColor: 'rgba(0, 0, 0, 0.6)', zIndex: '999999', display: 'flex',
          alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)',
          fontFamily: 'system-ui, -apple-system, sans-serif', opacity: '0',
          transition: 'opacity 0.4s ease'
        });
        
        const modal = document.createElement('div');
        Object.assign(modal.style, {
          backgroundColor: '#1e1f22', color: '#ffffff', padding: '40px',
          borderRadius: '20px', boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
          textAlign: 'center', maxWidth: '400px', transform: 'translateY(20px)',
          transition: 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
        });
        
        const h2 = document.createElement('h2');
        h2.textContent = 'Welcome! 👋';
        Object.assign(h2.style, { marginTop: '0', fontSize: '28px', marginBottom: '16px' });
        
        const p = document.createElement('p');
        p.textContent = 'Thank you for downloading my app! 🎉\\n\\nIf you enjoy using it, please consider giving it a star on GitHub! ⭐';
        Object.assign(p.style, { fontSize: '16px', lineHeight: '1.6', marginBottom: '30px', color: '#e3e3e3', whiteSpace: 'pre-wrap' });
        
        const btn = document.createElement('button');
        btn.textContent = 'Awesome! 👍';
        Object.assign(btn.style, {
          backgroundColor: '#8ab4f8', color: '#202124', border: 'none',
          padding: '14px 28px', borderRadius: '24px', fontSize: '16px',
          cursor: 'pointer', fontWeight: '500', transition: 'background-color 0.2s, transform 0.1s'
        });
        
        modal.appendChild(h2);
        modal.appendChild(p);
        modal.appendChild(btn);
        overlay.appendChild(modal);
        document.body.appendChild(overlay);
        
        setTimeout(() => { overlay.style.opacity = '1'; modal.style.transform = 'translateY(0)'; }, 100);
        
        btn.addEventListener('click', () => {
          overlay.style.opacity = '0';
          modal.style.transform = 'translateY(-20px)';
          setTimeout(() => overlay.remove(), 400);
          localStorage.setItem('notebooklm-app-welcome-v', 'true');
        });
        
        btn.addEventListener('mouseover', () => btn.style.backgroundColor = '#aecbfa');
        btn.addEventListener('mouseout', () => btn.style.backgroundColor = '#8ab4f8');
        btn.addEventListener('mousedown', () => btn.style.transform = 'scale(0.95)');
        btn.addEventListener('mouseup', () => btn.style.transform = 'scale(1)');
      }
    `).catch(err => {
      // Ignore injection errors on intermediate redirects or strict CSP pages
    });
  });
}

app.whenReady().then(() => {
  nativeTheme.themeSource = 'system';
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
