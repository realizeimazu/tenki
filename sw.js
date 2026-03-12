// Service Worker for 天気まとめ PWA
const CACHE_NAME = 'tenki-v1';

// インストール時：キャッシュは最小限（外部リソースはキャッシュしない）
self.addEventListener('install', e => {
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(clients.claim());
});

// フェッチ：天気API・PeerJSはネットワーク優先、それ以外はキャッシュ優先
self.addEventListener('fetch', e => {
  // 外部APIは常にネットワーク
  if (e.request.url.includes('googleapis') ||
      e.request.url.includes('openweathermap') ||
      e.request.url.includes('jma.go.jp') ||
      e.request.url.includes('peerjs') ||
      e.request.url.includes('peerserver') ||
      e.request.url.includes('unpkg.com') ||
      e.request.url.includes('cdnjs')) {
    return; // デフォルトのネットワーク fetch
  }
});

// メインスレッドからのバッジ更新メッセージを受け取る
self.addEventListener('message', e => {
  if (e.data && e.data.type === 'UPDATE_BADGE') {
    const count = e.data.count || 0;
    if ('setAppBadge' in navigator) {
      if (count > 0) {
        navigator.setAppBadge(count).catch(() => {});
      } else {
        navigator.clearAppBadge().catch(() => {});
      }
    }
  }
});
