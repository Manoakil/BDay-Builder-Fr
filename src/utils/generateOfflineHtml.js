export const generateOfflineHtml = (birthdayName, wishes = [], videoWishes = [], timeline = [], vault = null, vaultUnlocked = false) => {
  // Sort timeline by date
  const sortedTimeline = [...timeline].sort((a, b) => new Date(a.entry_date) - new Date(b.entry_date));

  // Date formatter
  const formatMemoryDate = (dateStr, tags = []) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    let precision = 'day';
    if (tags && tags.length) {
      const precisionTag = tags.find(t => typeof t === 'string' && t.startsWith('precision:'));
      if (precisionTag) precision = precisionTag.split(':')[1];
    } else {
      const parts = dateStr.split('-');
      if (parts.length === 1) precision = 'year';
      if (parts.length === 2) precision = 'month';
    }
    if (precision === 'year') return date.getFullYear().toString();
    if (precision === 'month') return new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(date);
    return new Intl.DateTimeFormat('en-US', { day: 'numeric', month: 'long', year: 'numeric' }).format(date);
  };

  const dyn = vault?.dynamic_data || {};
  const confessionTitle = dyn.confession_title || vault?.unlock_message || "A Little Secret";
  const confessionBody = dyn.confession_body || "";
  const letterTitle = dyn.letter_title || "";
  const letterBody = dyn.letter_body || "";
  const thingsILove = dyn.things_i_love || [];
  const memories = dyn.memories || [];

  const css = `
    :root {
      --bg: #1a1016;
      --text: #fdfaf6;
      --accent: #ff4d8d;
      --card-bg: #2b1d24;
      --gold: #ffd166;
    }
    body {
      margin: 0;
      padding: 0;
      background-color: var(--bg);
      color: var(--text);
      font-family: 'Poppins', sans-serif;
      overflow-x: hidden;
    }
    .container {
      max-width: 900px;
      margin: 0 auto;
      padding: 60px 20px;
    }
    .header {
      text-align: center;
      margin-bottom: 80px;
    }
    .header h1 {
      font-family: 'Cormorant Garamond', serif;
      font-size: 4rem;
      color: var(--accent);
      margin: 0;
    }
    .header p {
      font-family: 'Great Vibes', cursive;
      font-size: 2rem;
      color: var(--gold);
      margin: -10px 0 0 0;
    }
    
    .section-title {
      font-family: 'Cormorant Garamond', serif;
      font-size: 2.5rem;
      text-align: center;
      margin: 60px 0 40px;
      border-bottom: 1px solid rgba(255, 77, 141, 0.3);
      padding-bottom: 15px;
    }

    /* Beautiful Wishes (Letter style) */
    .wishes-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 30px;
    }
    .wish-card {
      background: linear-gradient(rgba(120,80,60,.035) 1px, transparent 1px);
      background-size: 100% 31px;
      background-color: #fbf0dd;
      border-radius: 4px;
      padding: 40px 30px;
      box-shadow: 0 15px 35px rgba(0,0,0,0.3), inset 0 0 0 1px rgba(150,100,60,.08);
      color: #5e4030;
    }
    .wish-card img {
      width: 100%;
      height: 200px;
      object-fit: cover;
      border-radius: 4px;
      margin-bottom: 20px;
    }
    .wish-message {
      font-family: 'Caveat', cursive;
      font-size: 1.5rem;
      line-height: 1.5;
      white-space: pre-wrap;
      color: #594541;
      margin-bottom: 20px;
    }
    .wish-author {
      font-family: 'Caveat', cursive;
      font-size: 1.8rem;
      font-weight: 600;
      color: #ff4d8d;
      text-align: right;
    }

    /* Video Wishes */
    .video-card {
      background: var(--card-bg);
      border-radius: 12px;
      padding: 25px;
      border: 1px solid rgba(255,255,255,0.05);
      text-align: center;
    }
    .video-card video {
      width: 100%;
      border-radius: 8px;
      margin-bottom: 15px;
      background: #000;
    }

    /* Timeline */
    .timeline {
      position: relative;
      padding: 20px 0;
    }
    .timeline::before {
      content: '';
      position: absolute;
      left: 20px;
      top: 0;
      bottom: 0;
      width: 2px;
      background: rgba(255, 77, 141, 0.3);
    }
    .timeline-item {
      position: relative;
      padding-left: 60px;
      margin-bottom: 40px;
    }
    .timeline-item::before {
      content: '✦';
      position: absolute;
      left: 8px;
      top: 2px;
      width: 26px;
      height: 26px;
      border-radius: 50%;
      background: #fff8fb;
      color: #ff4d8d;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      box-shadow: 0 0 0 3px #fff8fb;
    }
    .timeline-date {
      font-weight: 600;
      color: #ff4d8d;
      margin-bottom: 5px;
      display: block;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      font-size: 0.8rem;
    }
    .timeline-title {
      font-family: 'Cormorant Garamond', serif;
      font-size: 1.8rem;
      margin: 0 0 10px 0;
      color: #ffd166;
    }
    .timeline-desc {
      color: #e0d0d5;
      line-height: 1.6;
    }
    .timeline-img {
      max-width: 100%;
      border-radius: 12px;
      margin-top: 15px;
      border: 1px solid rgba(255,255,255,0.1);
    }

    /* Vault / Secret Confession */
    .vault-section {
      margin-top: 80px;
      background: linear-gradient(145deg, #2b111a, #1a0a10);
      border: 1px solid #ff4d8d;
      padding: 50px;
      border-radius: 20px;
      text-align: center;
    }
    .vault-section h2 {
      color: #ff4d8d;
      font-family: 'Cormorant Garamond', serif;
      font-size: 3rem;
      margin-top: 0;
      margin-bottom: 20px;
    }
    .vault-message {
      font-size: 1.2rem;
      line-height: 1.8;
      font-style: italic;
      color: #e0d0d5;
      margin-bottom: 30px;
      white-space: pre-wrap;
    }
    .vault-letter {
      background: #fbf0dd;
      padding: 40px;
      border-radius: 4px;
      color: #5e4030;
      text-align: left;
      margin-top: 40px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.4);
    }
    .vault-letter h3 {
      font-family: 'Caveat', cursive;
      font-size: 2.5rem;
      color: #ff0000;
      margin-top: 0;
    }
    .vault-letter p {
      font-family: 'Caveat', cursive;
      font-size: 1.5rem;
      white-space: pre-wrap;
    }
    .things-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 15px;
      margin-top: 30px;
    }
    .thing-card {
      background: rgba(255,77,141,0.1);
      border: 1px solid rgba(255,77,141,0.3);
      padding: 15px;
      border-radius: 8px;
      font-size: 1.1rem;
    }

    .footer {
      text-align: center;
      margin-top: 100px;
      padding: 40px 0;
      color: #666;
      font-size: 0.9rem;
    }
  `;

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${birthdayName}'s Celebration</title>
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=Great+Vibes&family=Poppins:wght@300;400;600&family=Caveat:wght@400;600;700&display=swap" rel="stylesheet">
  <style>${css}</style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Happy Birthday</h1>
      <p>${birthdayName}</p>
    </div>

    ${wishes.length > 0 ? `
      <h2 class="section-title">Wishes from the Heart</h2>
      <div class="wishes-grid">
        ${wishes.map(wish => `
          <div class="wish-card">
            ${wish.media_url ? `<img src="${wish.media_url}" alt="Attachment">` : ''}
            <div class="wish-message">${wish.content}</div>
            <div class="wish-author">— ${wish.wisher_name || 'Someone special'}</div>
          </div>
        `).join('')}
      </div>
    ` : ''}

    ${videoWishes.length > 0 ? `
      <h2 class="section-title">Video Memories</h2>
      <div class="wishes-grid">
        ${videoWishes.map(video => `
          <div class="video-card">
            <video src="${video.media_url}" controls preload="metadata"></video>
            <div class="wish-author" style="text-align: center; color: #ffd166;">— ${video.wisher_name || 'Someone special'}</div>
            ${video.content ? `<div class="wish-message" style="margin-top: 15px; color: #e0d0d5;">${video.content}</div>` : ''}
          </div>
        `).join('')}
      </div>
    ` : ''}

    ${sortedTimeline.length > 0 ? `
      <h2 class="section-title">Memory Lane</h2>
      <div class="timeline">
        ${sortedTimeline.map(entry => `
          <div class="timeline-item">
            <span class="timeline-date">${formatMemoryDate(entry.entry_date, entry.tags)}</span>
            <h3 class="timeline-title">${entry.title}</h3>
            ${entry.description ? `<div class="timeline-desc">${entry.description}</div>` : ''}
            ${entry.media_url ? `<img src="${entry.media_url}" class="timeline-img" alt="Memory">` : ''}
          </div>
        `).join('')}
      </div>
    ` : ''}

    ${(vault && vaultUnlocked && (vault.unlock_message || confessionBody || letterBody)) ? `
      <div class="vault-section">
        <h2>${confessionTitle}</h2>
        
        ${confessionBody ? `<div class="vault-message">${confessionBody}</div>` : ''}
        ${!confessionBody && vault.unlock_message ? `<div class="vault-message">${vault.unlock_message}</div>` : ''}
        
        ${vault.unlock_media_url ? `<img src="${vault.unlock_media_url}" class="timeline-img" alt="Vault Secret">` : ''}
        
        ${thingsILove.length > 0 ? `
          <h3 style="color:#ffd166; font-family:'Cormorant Garamond',serif; font-size:2rem; margin-top:40px;">Things I Love About You</h3>
          <div class="things-grid">
            ${thingsILove.map(thing => `<div class="thing-card">${thing}</div>`).join('')}
          </div>
        ` : ''}
        
        ${letterBody ? `
          <div class="vault-letter">
            <h3>${letterTitle || 'To my dear,'}</h3>
            <p>${letterBody}</p>
          </div>
        ` : ''}
      </div>
    ` : ''}

    <div class="footer">
      Generated on ${new Date().toLocaleDateString()} • Made with ♡ by Birthday Builder
    </div>
  </div>
</body>
</html>
  `;

  // Trigger download
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${birthdayName}_Celebration.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
