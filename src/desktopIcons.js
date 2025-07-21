const icons = [
  {
    name: "My Computer",
    img: "public/icons/my-computer.png", // PLACEHOLDER: Need my-computer.png icon
    action: () => createWindow("My Computer", generateMyComputerContent(), 500, 400)
  },
  {
    name: "Recycle Bin",
    img: "public/icons/recycle-bin.png",
    action: () => createWindow("Recycle Bin", generateRecycleBinContent(), 400, 300)
  },
  {
    name: "Network",
    img: "public/icons/network.png",
    action: () => createWindow("Network Connections", generateNetworkContent(), 450, 350)
  },
  {
    name: "Internet Explorer",
    img: "public/icons/internet-explorer.png", // PLACEHOLDER: Need internet-explorer.png icon
    action: () => createWindow("Internet Explorer", generateBrowserContent(), 600, 500)
  },
  {
    name: "Notepad",
    img: "public/icons/notepad.png", // PLACEHOLDER: Need notepad.png icon
    action: () => createWindow("Notepad", generateNotepadContent(), 500, 400)
  }
];

// Window creation function
function createWindow(title, content, width = 400, height = 300) {
  const desktop = document.getElementById('desktop');
  const windowId = 'window-' + Date.now();
  
  // Calculate random position (but keep it on screen)
  const maxLeft = window.innerWidth - width - 50;
  const maxTop = window.innerHeight - height - 100; // Account for taskbar
  const left = Math.max(50, Math.floor(Math.random() * maxLeft));
  const top = Math.max(50, Math.floor(Math.random() * maxTop));
  
  const windowDiv = document.createElement('div');
  windowDiv.className = 'window draggable';
  windowDiv.id = windowId;
  windowDiv.style.cssText = `top:${top}px;left:${left}px;width:${width}px;height:${height}px;`;
  
  windowDiv.innerHTML = `
    <div class="title-bar">
      <span class="title">${title}</span>
      <span class="window-buttons">
        <button>_</button><button>[]</button><button>X</button>
      </span>
    </div>
    <div class="window-content">${content}</div>
  `;
  
  desktop.appendChild(windowDiv);
  
  // Activate the window (make it draggable, add button functionality)
  if (window.activateWindow) {
    window.activateWindow(windowDiv);
  }
  
  return windowDiv;
}

// Content generators for different window types
function generateMyComputerContent() {
  return `
    <table style="width:100%;">
      <tr>
        <td style="padding:15px;">
          <img src="public/icons/hard-drive.png" style="width:48px;height:48px;" alt="Hard Drive">
          <br><strong>Local Disk (C:)</strong>
          <br><small>50.2 GB free of 100 GB</small>
        </td>
        <td style="padding:15px;">
          <img src="public/icons/cd-rom.png" style="width:48px;height:48px;" alt="CD Drive">
          <br><strong>CD Drive (D:)</strong>
          <br><small>No disc inserted</small>
        </td>
      </tr>
      <tr>
        <td style="padding:15px;">
          <img src="public/icons/floppy-disk.png" style="width:48px;height:48px;" alt="Floppy">
          <br><strong>3½ Floppy (A:)</strong>
          <br><small>Ready</small>
        </td>
        <td style="padding:15px;">
          <img src="public/icons/control-panel.png" style="width:48px;height:48px;" alt="Control Panel">
          <br><strong>Control Panel</strong>
          <br><small>System settings</small>
        </td>
      </tr>
    </table>
  `;
}

function generateRecycleBinContent() {
  return `
    <div style="text-align:center;padding:50px 20px;">
      <img src="public/icons/recycle-bin-empty.png" style="width:64px;height:64px;margin-bottom:15px;" alt="Empty">
      <h3 style="margin:10px 0;color:#666;">Recycle Bin is empty</h3>
      <p style="color:#888;font-size:12px;">When you delete files or folders, they are moved to the Recycle Bin.</p>
      <button style="margin-top:15px;padding:5px 15px;">Empty Recycle Bin</button>
    </div>
  `;
}

function generateNetworkContent() {
  return `
    <div style="padding:20px;">
      <h3 style="margin-top:0;color:#000080;">Network Connections</h3>
      <div style="border:1px solid #ccc;background:#f9f9f9;padding:10px;margin:10px 0;">
        <img src="public/icons/ethernet.png" style="width:32px;height:32px;float:left;margin-right:10px;" alt="Ethernet">
        <strong>Local Area Connection</strong><br>
        <span style="color:green;">Connected</span><br>
        <small>192.168.1.100</small>
      </div>
      <div style="border:1px solid #ccc;background:#f9f9f9;padding:10px;margin:10px 0;">
        <img src="public/icons/wifi.png" style="width:32px;height:32px;float:left;margin-right:10px;" alt="WiFi">
        <strong>Wireless Network Connection</strong><br>
        <span style="color:#999;">Disconnected</span><br>
        <small>No networks available</small>
      </div>
    </div>
  `;
}

function generateBrowserContent() {
  return `
    <div style="display:flex;flex-direction:column;height:100%;">
      <div style="background:#e6e6e6;padding:5px;border-bottom:1px solid #ccc;">
        <div style="display:flex;gap:5px;margin-bottom:5px;">
          <button style="padding:2px 8px;font-size:11px;">Back</button>
          <button style="padding:2px 8px;font-size:11px;">Forward</button>
          <button style="padding:2px 8px;font-size:11px;">Stop</button>
          <button style="padding:2px 8px;font-size:11px;">Refresh</button>
          <button style="padding:2px 8px;font-size:11px;">Home</button>
        </div>
        <div style="display:flex;align-items:center;gap:5px;">
          <span style="font-size:11px;">Address:</span>
          <input type="text" value="about:blank" style="flex:1;padding:2px;font-size:11px;" readonly>
          <button style="padding:2px 8px;font-size:11px;">Go</button>
        </div>
      </div>
      <div style="flex:1;background:#fff;padding:20px;overflow:auto;">
        <h1 style="color:#000080;font-family:Tahoma;">Welcome to Internet Explorer</h1>
        <p>This is a retro simulation of Internet Explorer. In the real world, this would display web pages!</p>
        <hr>
        <h3>Quick Links:</h3>
        <ul>
          <li><a href="#" onclick="alert('Navigating to search...')">Search the Web</a></li>
          <li><a href="#" onclick="alert('Opening favorites...')">Favorites</a></li>
          <li><a href="#" onclick="alert('Checking mail...')">Hotmail</a></li>
        </ul>
      </div>
    </div>
  `;
}

function generateNotepadContent() {
  return `
    <div style="display:flex;flex-direction:column;height:100%;">
      <div style="background:#e6e6e6;padding:2px;border-bottom:1px solid #ccc;font-size:11px;">
        <span style="padding:2px 8px;">File</span>
        <span style="padding:2px 8px;">Edit</span>
        <span style="padding:2px 8px;">Format</span>
        <span style="padding:2px 8px;">View</span>
        <span style="padding:2px 8px;">Help</span>
      </div>
      <textarea style="flex:1;border:none;outline:none;font-family:Courier New,monospace;font-size:12px;padding:5px;resize:none;" placeholder="Type your text here...">Welcome to Notepad!

This is a retro Windows XP simulation.
You can type here just like in the real Notepad.

Some nostalgic memories:
- Saving files with .txt extension
- The simple interface
- Copy and paste functionality
- Find and replace

Enjoy this blast from the past!</textarea>
    </div>
  `;
}

function createDesktopIcon(icon, idx) {
  const div = document.createElement('div');
  div.className = 'desktop-icon';
  div.style.top = (30 + idx * 90) + 'px';
  div.style.left = '30px';
  div.style.position = 'absolute';
  div.style.width = '70px';
  div.style.textAlign = 'center';
  div.style.cursor = 'pointer';
  div.innerHTML = `
    <img src="${icon.img}" style="width:48px;height:48px;display:block;margin:auto;">
    <div style="font-size:13px;color:#fff;text-shadow:1px 1px 2px #000;font-family:Tahoma,sans-serif;">${icon.name}</div>
  `;
  div.addEventListener('dblclick', icon.action);

  // Improved drag logic: only attach listeners during icon drag, and use start coordinates
  div.addEventListener('mousedown', function(e) {
    if (e.button !== 0) return;
    e.stopPropagation();
    const startX = e.clientX;
    const startY = e.clientY;
    const origLeft = parseInt(div.style.left, 10);
    const origTop = parseInt(div.style.top, 10);
    div.style.zIndex = 9999;
    document.body.style.userSelect = 'none';

    function onMouseMove(ev) {
      div.style.left = (origLeft + (ev.clientX - startX)) + 'px';
      div.style.top = (origTop + (ev.clientY - startY)) + 'px';
    }
    function onMouseUp() {
      div.style.zIndex = '';
      document.body.style.userSelect = '';
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    }
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });

  return div;
}
document.addEventListener('DOMContentLoaded', function() {
  const container = document.getElementById('desktop-icons');
  if (!container) return;
  icons.forEach((icon, idx) => {
    container.appendChild(createDesktopIcon(icon, idx));
  });
});