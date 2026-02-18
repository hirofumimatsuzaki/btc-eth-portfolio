# 資産チェッカー (暗号資産 + 円資産)

ページを開くと、保存済みの保有数量に対して現在価格を取得し、円換算の評価額を表示するシンプルなWebアプリです。
`minitask` とは別アプリとして、この `btc-eth-portfolio` ディレクトリ単体で公開できます。

## 使い方

1. `btc-eth-portfolio/index.html` をブラウザで開く
2. BTC/ETH/USDT/USDC の保有数量、投資信託(円)、預金(円)を入力
3. `数量を保存` を押す
4. 以後はページを開くだけで最新価格を取得して評価額を表示

## 計算ルール

- BTC/ETH: CoinGecko の円価格を使用
- USDT/USDC: CoinGecko のUSD価格を取得し、当日のUSD/JPY（Frankfurter API）で円換算
- 投資信託/預金: 円で手入力した値をそのまま合算
- 保有数量はブラウザの`localStorage`に保存
- 円換算したBTC/ETH/USDT/USDC/投資信託/預金の内訳を円グラフで表示
- SVGファイルを読み込んでプレビュー表示（保存後は次回起動時に再表示）
- 5分ごとに自動更新（`価格を更新`ボタンでも手動更新可能）
- `manifest.webmanifest` と `sw.js` を含むPWA対応（ホーム画面追加・オフライン時のシェル表示）


