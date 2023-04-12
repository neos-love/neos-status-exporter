# neos-status-exporter
NeosVRのユーザー数、セッション数などのメトリクスを収集して、
PrometheusにエクスポートするNode.jsベースのアプリケーションです。

## 使い方
### Dockerを使う方法
Dockerイメージをpullして、実行します。
```
docker pull ghcr.io/neos-love/neos-status-exporter:latest
docker run -p 3000:3000 ghcr.io/neos-love/neos-status-exporter:latest
```

### Node.jsを使う方法
Node.jsをインストールして、実行します。
```
git clone https://github.com/neos-love/neos-status-exporter.git
cd neos-status-exporter
npm install
npm start
```

## Prometheus設定
Prometheusの設定ファイルに以下のように記述します。
```
scrape_configs:
  - job_name: 'neos-status-exporter'
    static_configs:
      - targets: ['localhost:3000']
```

## メトリクス一覧
- `neos_capture_timestamp` 収集された時間
- `neos_registered_users` オンラインの登録ユーザ数
- `neos_instances` オンラインのインスタンス数
- `neos_online_users{device="vr"}` オンラインのVRユーザ数
- `neos_online_users{device="screen"}` オンラインのデスクトップユーザ数
- `neos_online_users{device="headless"}` オンラインのヘッドレスユーザ数
- `neos_online_users{device="mobile"}` オンラインのモバイルユーザ数
- `neos_public_sessions` オンラインのパブリックセッション数
- `neos_active_public_sessions` オンラインのアクティブなパブリックセッション数
- `neos_public_world_users` オンラインのパブリックワールドのユーザ数