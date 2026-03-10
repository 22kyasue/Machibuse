-- ============================================
-- 建物基礎情報の充実化 & 備考の追加
-- ============================================

-- ステップ7の建物（a1系）
UPDATE mansions SET
  structure = 'RC造（鉄筋コンクリート）',
  management_company = '三井不動産レジデンシャルサービス',
  pet_allowed = true,
  parking_available = true,
  second_nearest_station = '乃木坂駅',
  second_walking_minutes = 8,
  memo = '2LDK（70㎡台）の掲載が比較的多い。南向き高層階は坪単価2.5万前後。コンシェルジュ24時間常駐。フィットネスジム・ゲストルーム完備。赤坂檜町公園隣接で緑豊か。管理費は高めだがサービスレベルが高い。'
WHERE id = 'a1000000-0000-0000-0000-000000000001';

UPDATE mansions SET
  structure = 'SRC造（鉄骨鉄筋コンクリート）',
  management_company = '住友不動産建物サービス',
  pet_allowed = true,
  parking_available = true,
  second_nearest_station = '表参道駅',
  second_walking_minutes = 12,
  memo = 'KENCORP・住友不動産経由の掲載が多い。高層階スカイラウンジからの夜景は圧巻。1LDK〜3LDKまで幅広いプラン。外国人駐在員の入居率高め。渋谷再開発の恩恵で利便性向上中。ペットは小型犬1匹まで。'
WHERE id = 'a1000000-0000-0000-0000-000000000002';

UPDATE mansions SET
  structure = 'RC造（鉄筋コンクリート）',
  management_company = '三井不動産レジデンシャルサービス',
  pet_allowed = true,
  parking_available = true,
  second_nearest_station = '麻布十番駅',
  second_walking_minutes = 10,
  memo = '全48戸の小規模・低層マンション。閑静な南麻布の住宅街に位置。募集は年に1〜2回と極めて稀少。広尾駅徒歩3分で生活利便性も高い。有栖川宮記念公園至近。各住戸90㎡超のゆとりある設計。内廊下・24時間有人管理。'
WHERE id = 'a1000000-0000-0000-0000-000000000003';

UPDATE mansions SET
  structure = 'RC造（鉄筋コンクリート）',
  management_company = '三菱地所コミュニティ',
  pet_allowed = true,
  parking_available = true,
  second_nearest_station = '広尾駅',
  second_walking_minutes = 10,
  memo = '南青山7丁目の閑静な低層レジデンス。全86戸。天井高2.6m以上の開放的な設計。内装グレードが高くキッチンはドイツ製。敷地内に緑豊かな中庭あり。ペットは2匹まで可（大型犬可）。根津美術館至近。'
WHERE id = 'a1000000-0000-0000-0000-000000000004';

UPDATE mansions SET
  structure = 'RC造（鉄筋コンクリート）',
  management_company = '住友不動産建物サービス',
  pet_allowed = false,
  parking_available = true,
  second_nearest_station = '目黒駅',
  second_walking_minutes = 12,
  memo = '白金台3丁目の低層マンション。プラチナ通り至近。100㎡超の広めの3LDKタイプが中心。落ち着いた住環境で教育施設も充実。自然教育園隣接。駐車場は機械式で月額5万円程度。'
WHERE id = 'a1000000-0000-0000-0000-000000000005';

UPDATE mansions SET
  structure = 'RC造（鉄筋コンクリート）',
  management_company = '東京建物アメニティサポート',
  pet_allowed = true,
  parking_available = true,
  second_nearest_station = '不動前駅',
  second_walking_minutes = 10,
  memo = '目黒駅直結のツインタワー（サウスレジデンス）。駅改札から雨に濡れずにアクセス可能。1LDK〜3LDKまで多彩なプラン。低層階でも30万前後、高層階3LDKは50万超。共用施設にフィットネス・パーティールーム・ゲストルームあり。管理体制充実。'
WHERE id = 'a1000000-0000-0000-0000-000000000006';

UPDATE mansions SET
  structure = 'RC造（鉄筋コンクリート）',
  management_company = '三菱地所コミュニティ',
  pet_allowed = true,
  parking_available = true,
  second_nearest_station = '西新宿五丁目駅',
  second_walking_minutes = 6,
  memo = '地上60階建て・全954戸の超高層タワー。新宿エリア最大級。免震構造採用。45階以上のプレミアムフロアは眺望抜群（富士山・都庁ビュー）。1LDK〜4LDKまで幅広く対応。敷地内にスーパー・クリニック・保育園あり。管理費は面積比でリーズナブル。'
WHERE id = 'a1000000-0000-0000-0000-000000000007';

-- ステップ8の建物（a2系）
UPDATE mansions SET
  structure = 'SRC造（鉄骨鉄筋コンクリート）',
  management_company = '森ビル',
  pet_allowed = true,
  parking_available = true,
  second_nearest_station = '麻布十番駅',
  second_walking_minutes = 5,
  memo = '六本木ヒルズ内の超高級レジデンス。24時間コンシェルジュ・スパ・フィットネス・ビューラウンジ完備。ホテルライクなサービスが特徴。高層階プレミアムフロアは月額100万超。外国人エグゼクティブの入居率が非常に高い。セキュリティは3重構造。'
WHERE id = 'a2000000-0000-0000-0000-000000000001';

UPDATE mansions SET
  structure = 'SRC造（鉄骨鉄筋コンクリート）',
  management_company = '三井不動産レジデンシャルサービス',
  pet_allowed = true,
  parking_available = true,
  second_nearest_station = '赤坂駅',
  second_walking_minutes = 7,
  memo = '東京ミッドタウン直結。ザ・リッツ・カールトン東京と同敷地。高層階はミッドタウンガーデン・檜町公園のパークビュー。買い物・飲食の利便性は都内最高クラス。管理費にはミッドタウン共用部の維持費含む。3LDK以上は稀少。'
WHERE id = 'a2000000-0000-0000-0000-000000000002';

UPDATE mansions SET
  structure = 'RC造（鉄筋コンクリート）',
  management_company = '住友不動産建物サービス',
  pet_allowed = true,
  parking_available = true,
  second_nearest_station = '天王洲アイル駅',
  second_walking_minutes = 15,
  memo = '3棟構成（キャピタル・アクア・ロイヤル）の超大規模マンション。全2,090戸。プール・スパ・ゲストルーム・パーティールーム完備。品川駅利用可だがバス便推奨。管理費は面積比で割安。湾岸エリアならではの開放的な眺望。'
WHERE id = 'a2000000-0000-0000-0000-000000000003';

UPDATE mansions SET
  structure = 'RC造（鉄筋コンクリート）',
  management_company = '三井不動産レジデンシャルサービス',
  pet_allowed = true,
  parking_available = true,
  second_nearest_station = '芝浦ふ頭駅',
  second_walking_minutes = 8,
  memo = '運河沿いのウォーターフロント立地。レインボーブリッジの眺望が魅力。キッズルーム・パーティールーム充実でファミリー向け。田町駅からはやや距離があるがバス便あり。敷地内にスーパー・クリニックあり。'
WHERE id = 'a2000000-0000-0000-0000-000000000004';

UPDATE mansions SET
  structure = 'RC造（鉄筋コンクリート）',
  management_company = '野村不動産パートナーズ',
  pet_allowed = true,
  parking_available = true,
  second_nearest_station = '豊洲駅',
  second_walking_minutes = 12,
  memo = '湾岸エリアの大規模タワー。52階建てでスカイラウンジからの眺望は東京湾一望。ペット可（大型犬含む）。キャナルコート地区は公園・商業施設が充実。りんかい線辰巳駅が最寄りだが豊洲駅も利用可。'
WHERE id = 'a2000000-0000-0000-0000-000000000005';

UPDATE mansions SET
  structure = 'RC造（鉄筋コンクリート）',
  management_company = '三菱地所コミュニティ',
  pet_allowed = true,
  parking_available = true,
  second_nearest_station = '月島駅',
  second_walking_minutes = 15,
  memo = '晴海エリアの2棟構成タワー（クロノ・ティアロ）。ティアロレジデンスは後発棟で設備がやや新しい。スカイラウンジ・フィットネス完備。勝どき駅から徒歩12分はやや遠いが、BRT（バス高速輸送）開通で利便性改善。'
WHERE id = 'a2000000-0000-0000-0000-000000000006';

UPDATE mansions SET
  structure = 'RC造（鉄筋コンクリート）',
  management_company = '三井不動産レジデンシャルサービス',
  pet_allowed = true,
  parking_available = true,
  second_nearest_station = '向河原駅',
  second_walking_minutes = 8,
  memo = '武蔵小杉のランドマークタワー。53階建て・全884戸。駅徒歩4分の好立地。低層階に商業施設（グランツリー武蔵小杉等）。3LDKファミリータイプが中心。管理費は面積比でリーズナブル。小杉エリアの中では比較的新しい。'
WHERE id = 'a2000000-0000-0000-0000-000000000007';

UPDATE mansions SET
  structure = 'SRC造（鉄骨鉄筋コンクリート）',
  management_company = '鹿島建物総合管理',
  pet_allowed = true,
  parking_available = true,
  second_nearest_station = '月島駅',
  second_walking_minutes = 10,
  memo = '勝どき駅直結のタワーマンション。53階建て・全712戸。駅直結の利便性は湾岸エリアNo.1。低層階に商業施設（スーパー・クリニック・保育園）。1LDK〜3LDKまで多彩。勝どき駅の大江戸線で都心アクセス良好。'
WHERE id = 'a2000000-0000-0000-0000-000000000008';

UPDATE mansions SET
  structure = 'RC造（鉄筋コンクリート）',
  management_company = 'クレアスコミュニティー',
  pet_allowed = false,
  parking_available = true,
  second_nearest_station = '都庁前駅',
  second_walking_minutes = 5,
  memo = '西新宿のビジネスエリアに立地。シングル〜DINKS向けの1K・1LDK・2LDKが中心。新宿駅徒歩圏で通勤利便性が高い。コンシェルジュサービスあり。ペット不可。新宿中央公園至近で休日の散歩に便利。'
WHERE id = 'a2000000-0000-0000-0000-000000000009';

UPDATE mansions SET
  structure = 'RC造（鉄筋コンクリート）',
  management_company = '三井不動産レジデンシャルサービス',
  pet_allowed = true,
  parking_available = true,
  second_nearest_station = '日本大通り駅',
  second_walking_minutes = 8,
  memo = '横浜エリア最大級・58階建て全1,176戸。馬車道駅直結。みなとみらいの絶景ビュー（ランドマークタワー・ベイブリッジ・大観覧車）。商業施設・文化施設併設。横浜駅まで電車3分。管理費は面積比でリーズナブル。'
WHERE id = 'a2000000-0000-0000-0000-000000000010';

UPDATE mansions SET
  structure = 'RC造（鉄筋コンクリート）',
  management_company = '三井不動産レジデンシャルサービス',
  pet_allowed = true,
  parking_available = true,
  second_nearest_station = '神泉駅',
  second_walking_minutes = 5,
  memo = '渋谷再開発エリアのタワーマンション。希少な「渋谷」アドレス。コンシェルジュ・スカイラウンジ完備。2020年竣工の比較的新しい物件。渋谷駅周辺の再開発で今後も資産価値維持が期待される。2LDK以上のファミリータイプは特に人気。'
WHERE id = 'a2000000-0000-0000-0000-000000000011';

UPDATE mansions SET
  structure = 'SRC造（鉄骨鉄筋コンクリート）',
  management_company = '森ビル',
  pet_allowed = true,
  parking_available = true,
  second_nearest_station = '神谷町駅',
  second_walking_minutes = 5,
  memo = '虎ノ門ヒルズ直結の最新タワーレジデンス。54階建て。森ビルのフラッグシップ物件。ホテルライクサービス（ハウスキーピング等オプション）。最新のセキュリティシステム。東京タワービューの住戸は特に人気。外資系エグゼクティブの入居多数。'
WHERE id = 'a2000000-0000-0000-0000-000000000012';

UPDATE mansions SET
  structure = 'RC造（鉄筋コンクリート）',
  management_company = '東急コミュニティー',
  pet_allowed = true,
  parking_available = true,
  second_nearest_station = '新豊洲駅',
  second_walking_minutes = 8,
  memo = '豊洲エリアの大規模タワー。48階建て・全1,152戸。ファミリー層に人気でキッズルーム・プレイロット完備。ららぽーと豊洲至近で買い物便利。豊洲市場・チームラボプラネッツ等の観光施設も近い。ペットは小型犬・猫まで。'
WHERE id = 'a2000000-0000-0000-0000-000000000013';

UPDATE mansions SET
  structure = 'RC造（鉄筋コンクリート）',
  management_company = '三菱地所コミュニティ',
  pet_allowed = true,
  parking_available = true,
  second_nearest_station = '芝公園駅',
  second_walking_minutes = 7,
  memo = '三田エリアのタワーマンション。42階建て・全302戸。東京タワーを正面に望む住戸は特に人気が高い。コンシェルジュ24時間常駐。三田駅・田町駅の2駅利用可。芝公園至近で緑も豊か。1LDK〜3LDKの構成。'
WHERE id = 'a2000000-0000-0000-0000-000000000014';

UPDATE mansions SET
  structure = 'RC造（鉄筋コンクリート）',
  management_company = '三井不動産レジデンシャルサービス',
  pet_allowed = true,
  parking_available = true,
  second_nearest_station = '月島駅',
  second_walking_minutes = 15,
  memo = '晴海エリアの大規模タワー。48階建て・全1,076戸。HARUMI FLAGに隣接し、今後の街の発展が期待される。レインボーブリッジビューの高層階は人気。パーティールーム・ゲストルーム完備。BRT開通で交通利便性も改善。'
WHERE id = 'a2000000-0000-0000-0000-000000000015';

-- ステップ9の建物（a3系）のうちmemoがないものを更新
UPDATE mansions SET
  structure = 'RC造（鉄筋コンクリート）',
  management_company = '三井不動産レジデンシャルサービス',
  pet_allowed = true,
  parking_available = true,
  second_nearest_station = '白金高輪駅',
  second_walking_minutes = 10
WHERE id = 'a3000000-0000-0000-0000-000000000001' AND structure IS NULL;

UPDATE mansions SET
  structure = 'SRC造（鉄骨鉄筋コンクリート）',
  management_company = 'KENCORP',
  pet_allowed = true,
  parking_available = true,
  second_nearest_station = '溜池山王駅',
  second_walking_minutes = 6
WHERE id = 'a3000000-0000-0000-0000-000000000002' AND structure IS NULL;

UPDATE mansions SET
  structure = 'SRC造（鉄骨鉄筋コンクリート）',
  management_company = '森ビル',
  pet_allowed = true,
  parking_available = true,
  second_nearest_station = '乃木坂駅',
  second_walking_minutes = 8
WHERE id = 'a3000000-0000-0000-0000-000000000003' AND structure IS NULL;

UPDATE mansions SET
  structure = 'SRC造（鉄骨鉄筋コンクリート）',
  management_company = '森ビル',
  pet_allowed = true,
  parking_available = true,
  second_nearest_station = '神谷町駅',
  second_walking_minutes = 5
WHERE id = 'a3000000-0000-0000-0000-000000000004' AND structure IS NULL;

UPDATE mansions SET
  structure = 'RC造（鉄筋コンクリート）',
  management_company = '住友不動産建物サービス',
  pet_allowed = false,
  parking_available = true,
  second_nearest_station = '田町駅',
  second_walking_minutes = 8
WHERE id = 'a3000000-0000-0000-0000-000000000005' AND structure IS NULL;

UPDATE mansions SET
  structure = 'RC造（鉄筋コンクリート）',
  management_company = '東急コミュニティー',
  pet_allowed = true,
  parking_available = false,
  second_nearest_station = '外苑前駅',
  second_walking_minutes = 10
WHERE id = 'a3000000-0000-0000-0000-000000000006' AND structure IS NULL;

UPDATE mansions SET
  structure = 'RC造（鉄筋コンクリート）',
  management_company = '三菱地所コミュニティ',
  pet_allowed = false,
  parking_available = true,
  second_nearest_station = '赤坂駅',
  second_walking_minutes = 5
WHERE id = 'a3000000-0000-0000-0000-000000000007' AND structure IS NULL;

UPDATE mansions SET
  structure = 'RC造（鉄筋コンクリート）',
  management_company = '三井不動産レジデンシャルサービス',
  pet_allowed = true,
  parking_available = true,
  second_nearest_station = '恵比寿駅',
  second_walking_minutes = 12
WHERE id = 'a3000000-0000-0000-0000-000000000008' AND structure IS NULL;

UPDATE mansions SET
  structure = 'RC造（鉄筋コンクリート）',
  management_company = '三井不動産レジデンシャルサービス',
  pet_allowed = true,
  parking_available = true,
  second_nearest_station = '神泉駅',
  second_walking_minutes = 5
WHERE id = 'a3000000-0000-0000-0000-000000000009' AND structure IS NULL;

UPDATE mansions SET
  structure = 'SRC造（鉄骨鉄筋コンクリート）',
  management_company = '東急ファシリティサービス',
  pet_allowed = false,
  parking_available = true,
  second_nearest_station = '神泉駅',
  second_walking_minutes = 8
WHERE id = 'a3000000-0000-0000-0000-000000000010' AND structure IS NULL;

UPDATE mansions SET
  structure = 'RC造（鉄筋コンクリート）',
  management_company = '三菱地所コミュニティ',
  pet_allowed = true,
  parking_available = false,
  second_nearest_station = '恵比寿駅',
  second_walking_minutes = 10
WHERE id = 'a3000000-0000-0000-0000-000000000011' AND structure IS NULL;

UPDATE mansions SET
  structure = 'RC造（鉄筋コンクリート）',
  management_company = '三菱地所コミュニティ',
  pet_allowed = false,
  parking_available = true,
  second_nearest_station = '永田町駅',
  second_walking_minutes = 5
WHERE id = 'a3000000-0000-0000-0000-000000000012' AND structure IS NULL;

UPDATE mansions SET
  structure = 'RC造（鉄筋コンクリート）',
  management_company = '三井不動産レジデンシャルサービス',
  pet_allowed = false,
  parking_available = true,
  second_nearest_station = '麹町駅',
  second_walking_minutes = 8
WHERE id = 'a3000000-0000-0000-0000-000000000013' AND structure IS NULL;

UPDATE mansions SET
  structure = 'RC造（鉄筋コンクリート）',
  management_company = NULL,
  pet_allowed = false,
  parking_available = true,
  second_nearest_station = '永田町駅',
  second_walking_minutes = 7
WHERE id = 'a3000000-0000-0000-0000-000000000014' AND structure IS NULL;

UPDATE mansions SET
  structure = 'RC造（鉄筋コンクリート）',
  management_company = '三菱地所コミュニティ',
  pet_allowed = true,
  parking_available = true,
  second_nearest_station = '新宿三丁目駅',
  second_walking_minutes = 6
WHERE id = 'a3000000-0000-0000-0000-000000000015' AND structure IS NULL;

UPDATE mansions SET
  structure = 'RC造（鉄筋コンクリート）',
  management_company = '住友不動産建物サービス',
  pet_allowed = true,
  parking_available = true,
  second_nearest_station = '西早稲田駅',
  second_walking_minutes = 8
WHERE id = 'a3000000-0000-0000-0000-000000000016' AND structure IS NULL;

UPDATE mansions SET
  structure = 'RC造（鉄筋コンクリート）',
  management_company = 'クレアスコミュニティー',
  pet_allowed = false,
  parking_available = true,
  second_nearest_station = '都庁前駅',
  second_walking_minutes = 5
WHERE id = 'a3000000-0000-0000-0000-000000000017' AND structure IS NULL;

UPDATE mansions SET
  structure = 'RC造（鉄筋コンクリート）',
  management_company = '三井不動産レジデンシャルサービス',
  pet_allowed = true,
  parking_available = true,
  second_nearest_station = '五反田駅',
  second_walking_minutes = 10
WHERE id = 'a3000000-0000-0000-0000-000000000018' AND structure IS NULL;

UPDATE mansions SET
  structure = 'RC造（鉄筋コンクリート）',
  management_company = '住友不動産建物サービス',
  pet_allowed = true,
  parking_available = true,
  second_nearest_station = '天王洲アイル駅',
  second_walking_minutes = 15
WHERE id = 'a3000000-0000-0000-0000-000000000019' AND structure IS NULL;

UPDATE mansions SET
  structure = 'RC造（鉄筋コンクリート）',
  management_company = '東京建物アメニティサポート',
  pet_allowed = true,
  parking_available = true,
  second_nearest_station = '不動前駅',
  second_walking_minutes = 12
WHERE id = 'a3000000-0000-0000-0000-000000000020' AND structure IS NULL;

UPDATE mansions SET
  structure = 'RC造（鉄筋コンクリート）',
  management_company = '三井不動産レジデンシャルサービス',
  pet_allowed = true,
  parking_available = true,
  second_nearest_station = '不動前駅',
  second_walking_minutes = 10
WHERE id = 'a3000000-0000-0000-0000-000000000021' AND structure IS NULL;

UPDATE mansions SET
  structure = 'RC造（鉄筋コンクリート）',
  management_company = '三井不動産レジデンシャルサービス',
  pet_allowed = true,
  parking_available = true,
  second_nearest_station = '後楽園駅',
  second_walking_minutes = 3
WHERE id = 'a3000000-0000-0000-0000-000000000022' AND structure IS NULL;

UPDATE mansions SET
  structure = 'RC造（鉄筋コンクリート）',
  management_company = '東京建物アメニティサポート',
  pet_allowed = true,
  parking_available = true,
  second_nearest_station = '根津駅',
  second_walking_minutes = 8
WHERE id = 'a3000000-0000-0000-0000-000000000023' AND structure IS NULL;

-- ============================================
-- 不足している間取りタイプの追加
-- 各マンションに1K/1LDK/2LDK/3LDKを網羅
-- ============================================

-- パークマンション南麻布: 1LDK追加（既存は2LDK, 3LDK）
INSERT INTO units (id, mansion_id, floor_range, size_sqm, layout_type, direction, last_rent, memo) VALUES
  ('b4000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000003', '1-3F', 65.20, '1LDK', '東', 420000, '低層階ガーデンビュー。専用庭付きの住戸あり')
ON CONFLICT (id) DO NOTHING;

-- グランドヒルズ白金台: 1LDK, 2LDK追加（既存は3LDKのみ）
INSERT INTO units (id, mansion_id, floor_range, size_sqm, layout_type, direction, last_rent, memo) VALUES
  ('b4000000-0000-0000-0000-000000000002', 'a1000000-0000-0000-0000-000000000005', '1-3F', 55.80, '1LDK', '東', 380000, 'コンパクトタイプ。DINKS向け'),
  ('b4000000-0000-0000-0000-000000000003', 'a1000000-0000-0000-0000-000000000005', '3-5F', 78.50, '2LDK', '南', 520000, '中層階。プラチナ通りビュー')
ON CONFLICT (id) DO NOTHING;

-- ザ・パークハウス グラン 南青山: 3LDK追加（既存は1LDK, 2LDK）
INSERT INTO units (id, mansion_id, floor_range, size_sqm, layout_type, direction, last_rent, memo) VALUES
  ('b4000000-0000-0000-0000-000000000004', 'a1000000-0000-0000-0000-000000000004', '5-7F', 105.30, '3LDK', '南西', 720000, '最上階付近。ルーフバルコニー付き住戸あり')
ON CONFLICT (id) DO NOTHING;

-- パークコート赤坂檜町: 1K追加（既存は1LDK x2, 2LDK, 3LDK）
INSERT INTO units (id, mansion_id, floor_range, size_sqm, layout_type, direction, last_rent, memo) VALUES
  ('b4000000-0000-0000-0000-000000000005', 'a1000000-0000-0000-0000-000000000001', '3-10F', 32.50, '1K', '北', 200000, 'スタジオタイプ。単身赴任者向け')
ON CONFLICT (id) DO NOTHING;

-- ラ・トゥール渋谷: 3LDK追加（既存は1K, 2LDK x2）
INSERT INTO units (id, mansion_id, floor_range, size_sqm, layout_type, direction, last_rent, memo) VALUES
  ('b4000000-0000-0000-0000-000000000006', 'a1000000-0000-0000-0000-000000000002', '25-36F', 105.80, '3LDK', '南', 780000, '高層階。天井高2.7mの開放的な設計')
ON CONFLICT (id) DO NOTHING;

-- ブリリアタワーズ目黒: 1K追加（既存は1LDK, 2LDK, 3LDK）
INSERT INTO units (id, mansion_id, floor_range, size_sqm, layout_type, direction, last_rent, memo) VALUES
  ('b4000000-0000-0000-0000-000000000007', 'a1000000-0000-0000-0000-000000000006', '3-10F', 28.50, '1K', '北', 160000, 'コンパクトスタジオ。駅直結の利便性重視型')
ON CONFLICT (id) DO NOTHING;

-- ザ・パークハウス西新宿タワー60: 1K追加（既存は1LDK, 2LDK, 3LDK）
INSERT INTO units (id, mansion_id, floor_range, size_sqm, layout_type, direction, last_rent, memo) VALUES
  ('b4000000-0000-0000-0000-000000000008', 'a1000000-0000-0000-0000-000000000007', '5-15F', 30.20, '1K', '東', 155000, 'スタジオタイプ。新宿駅徒歩圏の利便性')
ON CONFLICT (id) DO NOTHING;

-- 新規ユニットの募集データ
INSERT INTO listings (id, unit_id, status, current_rent, management_fee, floor, source_site, source_url, detected_at, ended_at, interior_features, building_features) VALUES
  ('c4000000-0000-0000-0000-000000000001', 'b4000000-0000-0000-0000-000000000001', 'active', 430000, 18000, 2, 'SUUMO', 'https://suumo.jp/chintai/bc_e00001', '2026-03-08 10:00:00+09', NULL,
    ARRAY['システムキッチン', 'ウォークインクローゼット', '浴室乾燥機', '独立洗面台', '温水洗浄便座'],
    ARRAY['オートロック', 'モニター付きインターホン', '宅配ボックス', '24時間有人管理', '内廊下']),
  ('c4000000-0000-0000-0000-000000000002', 'b4000000-0000-0000-0000-000000000003', 'active', 535000, 22000, 4, 'LIFULL HOME''S', 'https://homes.co.jp/chintai/e00001', '2026-03-06 14:00:00+09', NULL,
    ARRAY['システムキッチン', '食洗機', 'ウォークインクローゼット', '浴室乾燥機', '床暖房'],
    ARRAY['オートロック', 'モニター付きインターホン', '防犯カメラ', '宅配ボックス', 'ペット可']),
  ('c4000000-0000-0000-0000-000000000003', 'b4000000-0000-0000-0000-000000000004', 'active', 740000, 28000, 6, 'SUUMO', 'https://suumo.jp/chintai/bc_e00002', '2026-03-07 09:00:00+09', NULL,
    ARRAY['システムキッチン', '食洗機', 'カウンターキッチン', 'ウォークインクローゼット', '浴室乾燥機', '床暖房', 'ルーフバルコニー'],
    ARRAY['オートロック', 'モニター付きインターホン', '防犯カメラ', '宅配ボックス', 'ペット可（大型犬可）']),
  ('c4000000-0000-0000-0000-000000000004', 'b4000000-0000-0000-0000-000000000005', 'past', 205000, 12000, 7, 'CHINTAI', 'https://www.chintai.net/e00001', '2025-11-10 10:00:00+09', '2025-12-20 00:00:00+09',
    ARRAY['IHコンロ', '独立洗面台', '浴室乾燥機', '温水洗浄便座'],
    ARRAY['オートロック', 'モニター付きインターホン', '宅配ボックス', 'フィットネスジム']),
  ('c4000000-0000-0000-0000-000000000005', 'b4000000-0000-0000-0000-000000000006', 'active', 790000, 30000, 30, 'KENCORP', 'https://kencorp.com/e00001', '2026-03-09 08:00:00+09', NULL,
    ARRAY['システムキッチン', '食洗機', 'ディスポーザー', 'ウォークインクローゼット', '浴室乾燥機', '床暖房', 'ミストサウナ'],
    ARRAY['オートロック', 'モニター付きインターホン', '防犯カメラ', 'コンシェルジュ24時間', 'スカイラウンジ', 'ペット可']),
  ('c4000000-0000-0000-0000-000000000006', 'b4000000-0000-0000-0000-000000000007', 'active', 165000, 10000, 5, 'at home', 'https://athome.co.jp/chintai/e00001', '2026-03-05 11:00:00+09', NULL,
    ARRAY['IHコンロ', '独立洗面台', '温水洗浄便座'],
    ARRAY['オートロック', '宅配ボックス', '駅直結']),
  ('c4000000-0000-0000-0000-000000000007', 'b4000000-0000-0000-0000-000000000008', 'active', 158000, 8000, 10, 'SUUMO', 'https://suumo.jp/chintai/bc_e00003', '2026-03-04 10:00:00+09', NULL,
    ARRAY['IHコンロ', '独立洗面台', '浴室乾燥機'],
    ARRAY['オートロック', 'モニター付きインターホン', '宅配ボックス', 'フィットネスジム'])
ON CONFLICT (id) DO NOTHING;
