// メニューデータ
const MENU_DATA = {
  "おすすめ": [
    { id: 1, name: "かわ",       price: 350, img: "🍢", desc: "炭火でじっくり焼いた皮串" },
    { id: 2, name: "レバー",     price: 350, img: "🍢", desc: "とろけるレバー串" },
    { id: 3, name: "ももたれ",   price: 320, img: "🍢", desc: "ジューシーなもも肉（たれ）" },
    { id: 4, name: "つくね",     price: 380, img: "🍢", desc: "特製つくね串" },
  ],
  "スピードメニュー": [
    { id: 5, name: "枝豆",         price: 280, img: "🫘", desc: "冷たい枝豆" },
    { id: 6, name: "キャベツ浅漬け", price: 250, img: "🥬", desc: "さっぱり浅漬け" },
    { id: 7, name: "冷奴",          price: 280, img: "🫙", desc: "国産大豆冷奴" },
  ],
  "焼鳥（たれ）": [
    { id: 8,  name: "ももたれ",    price: 320, img: "🍢", desc: "もも肉（たれ）" },
    { id: 9,  name: "かわたれ",    price: 350, img: "🍢", desc: "かわ（たれ）" },
    { id: 10, name: "ねぎまたれ",  price: 330, img: "🍢", desc: "ねぎま（たれ）" },
    { id: 11, name: "つくねたれ",  price: 380, img: "🍢", desc: "つくね（たれ）" },
  ],
  "焼鳥（塩）": [
    { id: 12, name: "もも塩",    price: 320, img: "🍢", desc: "もも肉（塩）" },
    { id: 13, name: "かわ塩",    price: 350, img: "🍢", desc: "かわ（塩）" },
    { id: 14, name: "ねぎま塩",  price: 330, img: "🍢", desc: "ねぎま（塩）" },
    { id: 15, name: "砂肝",      price: 330, img: "🍢", desc: "砂肝（塩）" },
  ],
  "一品": [
    { id: 16, name: "鶏の唐揚げ",       price: 550, img: "🍗", desc: "サクサクジューシーな唐揚げ" },
    { id: 17, name: "フライドポテト",    price: 350, img: "🍟", desc: "カリカリポテト" },
    { id: 18, name: "だし巻き",          price: 420, img: "🍳", desc: "ふわふわだし巻き卵" },
    { id: 19, name: "タコのから揚げ",    price: 480, img: "🐙", desc: "カリッとタコ唐揚げ" },
    { id: 20, name: "ポテトサラダ",      price: 380, img: "🥗", desc: "自家製ポテトサラダ" },
    { id: 21, name: "キャベツの塩だれ",  price: 280, img: "🥬", desc: "塩だれキャベツ" },
    { id: 22, name: "きゅうりの一本漬け", price: 280, img: "🥒", desc: "シャキシャキ一本漬け" },
  ],
  "デザート": [
    { id: 23, name: "バニラアイス",  price: 280, img: "🍨", desc: "濃厚バニラ" },
    { id: 24, name: "抹茶アイス",    price: 300, img: "🍵", desc: "宇治抹茶アイス" },
  ],
  "シメ": [
    { id: 25, name: "焼きおにぎり", price: 280, img: "🍙", desc: "香ばしい焼きおにぎり" },
    { id: 26, name: "お茶漬け",     price: 350, img: "🍵", desc: "さっぱりお茶漬け" },
  ],
  "ソフトドリンク": [
    { id: 27, name: "ウーロン茶",    price: 250, img: "🫖", desc: "" },
    { id: 28, name: "コーラ",        price: 250, img: "🥤", desc: "" },
    { id: 29, name: "オレンジジュース", price: 280, img: "🍊", desc: "" },
  ],
  "アルコール": [
    { id: 30, name: "生ビール",    price: 480, img: "🍺", desc: "キンキン生ビール" },
    { id: 31, name: "ハイボール",  price: 380, img: "🥃", desc: "スッキリハイボール" },
    { id: 32, name: "チューハイ",  price: 350, img: "🍹", desc: "各種チューハイ" },
    { id: 33, name: "日本酒",      price: 480, img: "🍶", desc: "地酒一合" },
  ],
  "その他": [
    { id: 34, name: "お通し",  price: 300, img: "🍽️", desc: "本日のお通し" },
  ],
  "サービス品": [
    { id: 35, name: "お水",    price: 0, img: "💧", desc: "無料" },
    { id: 36, name: "おしぼり", price: 0, img: "🧻", desc: "無料" },
  ],
  "飲み放題": [
    { id: 37, name: "飲み放題（90分）", price: 1500, img: "🍻", desc: "全アルコール対象" },
  ],
};

const CATEGORIES = Object.keys(MENU_DATA);
