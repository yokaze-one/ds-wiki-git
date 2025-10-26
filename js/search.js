// static/js/search.js

// Fuse.jsを読み込む (CDNから)
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('search-input');
    const searchResults = document.getElementById('search-results');
    // Wikiメニューのヘッダーとリストも取得
    const wikiMenuHeader = document.getElementById('wiki-menu-header');
    const wikiMenu = document.getElementById('wiki-menu');
    
    let fuse;

    // 検索インデックス (JSON) を読み込む
    fetch('/index.json')
        .then(response => {
            if (!response.ok) {
                console.error('Failed to load index.json:', response.statusText);
                return []; 
            }
            return response.json();
        })
        .then(data => {
            console.log('JSON data loaded successfully:', data.length, 'items');
            
            // Fuse.jsの設定
            const options = {
                keys: ['title', 'content'], 
                includeScore: true,
                threshold: 0.3 // マッチの厳しさ
            };
            fuse = new Fuse(data, options);
        });

    // 入力イベントリスナー
    searchInput.addEventListener('input', function() {
        const query = searchInput.value.trim();
        searchResults.innerHTML = ''; // 結果をクリア

        // 検索結果の表示/非表示を切り替える
        if (query.length > 0) {
            searchResults.style.display = 'block';
            wikiMenuHeader.style.display = 'none'; // 通常メニューを非表示
            wikiMenu.style.display = 'none';
        } else {
            searchResults.style.display = 'none';
            wikiMenuHeader.style.display = 'block'; // 通常メニューを再表示
            wikiMenu.style.display = 'block';
        }

        if (query.length === 0 || !fuse) {
            return;
        }

        const results = fuse.search(query).slice(0, 10); 

        if (results.length > 0) {
            results.forEach(result => {
                const item = document.createElement('li');
                const link = document.createElement('a');
                link.href = result.item.permalink;
                link.textContent = result.item.title;
                item.appendChild(link);
                searchResults.appendChild(item);
            });
        } else {
            searchResults.innerHTML = '<li>検索結果が見つかりませんでした。</li>';
        }
    });
});