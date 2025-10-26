// static/js/search.js

// Fuse.jsを読み込む (CDNから)
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('search-input');
    // 検索結果を表示するコンテナのIDを確認してください (ここではsidebar-menuの下の要素を想定)
    const searchResults = document.getElementById('search-results'); 
    
    // Wikiメニューのヘッダーとリストも取得
    const wikiMenuHeader = document.getElementById('wiki-menu-header');
    
    // 従来のメニューコンテンツ（ULタグなどを含む親要素を想定）
    // あなたのHTML構造に合わせてIDまたはクラスを修正してください
    const sidebarContentBody = document.querySelector('.sidebar-content-body'); 
    
    let fuse;

    // 検索インデックス (JSON) を読み込む
    // 【重要修正】GitHub Pagesのサブディレクトリに対応するため、パスにリポジトリ名を含めます
    fetch('/ds-wiki-git/index.json') // ★★★ この行が修正されています ★★★
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
        
        // searchResultsの要素がHTMLに存在するか確認
        if (!searchResults) {
             console.error('Error: Element with ID "search-results" not found.');
             return;
        }

        searchResults.innerHTML = ''; // 結果をクリア

        // 検索結果の表示/非表示を切り替える
        if (query.length > 0) {
            searchResults.style.display = 'block';
            if (wikiMenuHeader) wikiMenuHeader.style.display = 'none'; // 通常メニューを非表示
            if (sidebarContentBody) sidebarContentBody.style.display = 'none'; 
        } else {
            searchResults.style.display = 'none';
            if (wikiMenuHeader) wikiMenuHeader.style.display = 'block'; // 通常メニューを再表示
            if (sidebarContentBody) sidebarContentBody.style.display = 'block'; 
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