"use strict";
const Alexa = require('alexa-sdk');
var request = require('sync-request');

// Lambda関数のメイン処理
exports.handler = function(event, context, callback) {
    var alexa = Alexa.handler(event, context, callback); // Alexa SDKのインスタンス生成
    alexa.appId = process.env.APP_ID; // スキルのApplication Idを設定
    alexa.registerHandlers(handlers); // ハンドラの登録
    alexa.execute();                  // インスタンスの実行
};

// 対話モデル
// ギアパワー
const gearpower = {
    inksavermain:"が付きやすいブランドはジモン、付きにくいブランドはバトロイカです。メインウェポンの消費インク量が少なくなります。", 
    inksaversub:"が付きやすいブランドはホッコリー、付きにくいブランドはフォーリマです。サブウェポンの消費インク量が少なくなります。", 
    inkrecoveryup:"が付きやすいブランドはアロメ、付きにくいブランドはホッコリーです。インクタンク回復速度がアップします。", 
    runspeedup:"が付きやすいブランドはロッケンベルグ、付きにくいブランドはジモンです。ヒト状態の移動速度がアップします。", 
    swimspeedup:"が付きやすいブランドはクラーゲス、付きにくいブランドはロッケンベルグです。イカダッシュ時の移動速度がアップします。", 
    spechargeup:"が付きやすいブランドはヤコ、付きにくいブランドはエゾッコです。スペシャルゲージの増加量がアップします。", 
    spesaver:"が付きやすいブランドはエゾッコ、付きにくいブランドはホタックスとアナアキです。プレイヤーがやられた時のスペシャルゲージの減少量が少なくなります。", 
    spepowerup:"が付きやすいブランドはフォーリマ、付きにくいブランドはヤコです。スペシャルウェポンの性能がアップします。", 
    quickrespawn:"が付きやすいブランドはホタックス、付きにくいブランドはアイロニックです。相手を一人も倒せないまま連続でやられた時、復活時間が短くなります。", 
    quicksuperjump:"が付きやすいブランドはアイロニック、付きにくいブランドはアロメです。スーパージャンプの時間が短くなります。", 
    subpowerup:"が付きやすいブランドはエンペリー、付きにくいブランドはタタキケンサキです。サブウェポンの性能がアップします。", 
    inkresistup:"が付きやすいブランドはバトロイカ、付きにくいブランドはエンペリーです。相手のインクをふんだ時のダメージや移動速度の減少が少なくなります。", 
    bombdefup:"が付きやすいブランドはシグレニ、付きにくいブランドはクラーゲスです。サブウェポンやスペシャルウェポンの爆発で受けるダメージを軽減します。", 
    coldblooded:"が付きやすいブランドはアナアキとタタキケンサキ、付きにくいブランドはシグレニです。相手のポイントセンサーなど位置を発見してくる攻撃の効果時間を短くします。", 
    openinggambit:"は対戦開始から30カウントの間ヒト状態とイカダッシュ時の速度がかなりアップします。", 
    lastditcheffort:"は対戦終了の30カウント前からインク効率とインク回復速度がかなりアップします。", 
    tenacity:"は自チームの人数が相手チームより少ない場合、少しずつスペシャルゲージが増えます。", 
    comeback:"はプレイヤーがやられて復帰後、しばらくの間、一部の能力がかなりアップします。", 
    ninjasquid:"は地面をイカダッシュした時にインクが飛び散らなくなるが、移動速度が少しダウンします。", 
    haunt:"は復活したとき、直前に自分を倒した相手の位置が遠くから見えるようになります。", 
    thermalink:"はメインウェポンの弾を直接当てた相手が、しばらくの間、遠くから見えるようになります。", 
    respawnpunisher:"は自プレイヤーと倒した相手のスペシャル減少量と復活時間が増えます。", 
    abilitydoubler:"はこのギアについている追加ギアパワーを1つで2コ分の効果にします。", 
    stealthjump:"はスーパージャンプの着地点を示すマーカーが、はなれた場所から見えなくなります。", 
    objectshredder:"はプレイヤー以外の物体に対して攻撃したときのダメージを増やします。", 
    droproller:"はスーパージャンプ着地時に前方にスティックをたおしておくと着地と同時に前転します。", 
    bukichi:"はギアパワーではありません。カンブリアームズの店主です。"
}

// そのほかの応答
const MSG_NOLIST = "はギアパワーリストに存在しません。違う名称でもう一度調べたいギアパワーを教えてください。"
const MSG_CONTINUE = "続けてどうぞ聞いてください。"
const MSG_FINISH = "分かりました、スプラトゥーン頑張ってください。"
const UNLISTED = "はギアパワーではありません。";
const UNHANDLED = "ハンドリングされていません。";
const UNHANDLED2 = "ハンドリングされていません2。";
const CANCELED = "必要な時はまた呼び出してください。";

function httpGet(url){
  var response = request(
    'GET', url, {
      headers: {
        'user-agent': 'SplatoonStageInfo/1.0 (Amazon Alexa Skill; twitter @ikatune)',
      },
    }
    );
    return response.getBody();
}

var handlers = {
    // インテントに紐付かないリクエスト
    'LaunchRequest': function () {
    this.emit('AMAZON.HelpIntent'); // AMAZON.HelpIntentの呼び出し
    },
    // スキルの使い方を尋ねるインテント
    'AMAZON.HelpIntent': function () {
        this.emit(':ask', '調べたいバトルルール、またはギアパワーを言ってください。');
    },
    // 対話モデルで定義した、バトルルール、またはギアパワーを説明するインテント
    'GearpowerIntent': function () {
        var gearpowerpath = this.event.request.intent.slots.GearPower;
        if (gearpowerpath && gearpowerpath.resolutions && gearpowerpath.resolutions.resolutionsPerAuthority) {
            var outputSpeak = UNLISTED; // 初期値代入
            var repromptSpeech = MSG_CONTINUE; // 8秒以上放置後の再メッセージ
            if (gearpowerpath.resolutions["resolutionsPerAuthority"][0]["status"]["code"] == 'ER_SUCCESS_MATCH') {
                if(gearpowerpath.resolutions.resolutionsPerAuthority[0].values.length == 1) {
                    var gear = gearpowerpath.resolutions["resolutionsPerAuthority"][0]["values"][0]["value"]["name"]; // スロットGearPowerを参照
                    switch (gear){
                        case "ナワバリ":
                            var returnCode_now;
                            var getUrl = 'https://spla2.yuu26.com/regular/now';
                            returnCode_now = httpGet(getUrl);
                            var parsedValue1 = JSON.parse(returnCode_now);
                            console.log('maps:', '現在のナワバリのステージは' + parsedValue1['result'][0]['maps'][0] + 'と' + parsedValue1['result'][0]['maps'][1] + 'です。');

                            var returnCode_next;
                            var getUrl = 'https://spla2.yuu26.com/regular/next';
                            returnCode_next = httpGet(getUrl);
                            var parsedValue2 = JSON.parse(returnCode_next);
                            console.log('maps:', '次のナワバリのステージは' + parsedValue2['result'][0]['maps'][0] + 'と' + parsedValue2['result'][0]['maps'][1] + 'です。');

                            this.emit(':ask', '現在のナワバリのステージは' + parsedValue1['result'][0]['maps'][0] + 'と' + parsedValue1['result'][0]['maps'][1] + 'です。' 
                            + '次のナワバリのステージは' + parsedValue2['result'][0]['maps'][0] + 'と' + parsedValue2['result'][0]['maps'][1] + 'です。'); // レスポンスの生成
                            break;
                        case "ガチマッチ":
                            var returnCode_now;
                            var getUrl = 'https://spla2.yuu26.com/gachi/now';
                            returnCode_now = httpGet(getUrl);
                            var parsedValue1 = JSON.parse(returnCode_now);
                            console.log('maps:', '現在のガチマッチは' + parsedValue1['result'][0]['rule'] + 'です。ステージは' + parsedValue1['result'][0]['maps'][0] + 'と' + parsedValue1['result'][0]['maps'][1] + 'です。');

                            var returnCode_next;
                            var getUrl = 'https://spla2.yuu26.com/gachi/next';
                            returnCode_next = httpGet(getUrl);
                            var parsedValue2 = JSON.parse(returnCode_next);
                            console.log('maps:', '次のガチマッチは' + parsedValue2['result'][0]['rule'] + 'です。ステージは' + parsedValue2['result'][0]['maps'][0] + 'と' + parsedValue2['result'][0]['maps'][1] + 'です。');

                            this.emit(':ask', '現在のガチマッチは' + parsedValue1['result'][0]['rule'] + 'です。ステージは' + parsedValue1['result'][0]['maps'][0] + 'と' + parsedValue1['result'][0]['maps'][1]  + 'です。次のガチマッチは' + parsedValue2['result'][0]['rule'] + 'です。ステージは' + parsedValue2['result'][0]['maps'][0] + 'と' + parsedValue2['result'][0]['maps'][1] + 'です。'); // レスポンスの生成
                            break;
                        case "リーグマッチ":
                            var returnCode_now;
                            var getUrl = 'https://spla2.yuu26.com/league/now';
                            returnCode_now = httpGet(getUrl);
                            var parsedValue1 = JSON.parse(returnCode_now);
                            console.log('maps:', '現在のリーグマッチは' + parsedValue1['result'][0]['rule'] + 'です。ステージは' + parsedValue1['result'][0]['maps'][0] + 'と' + parsedValue1['result'][0]['maps'][1] + 'です。');

                            var returnCode_next;
                            var getUrl = 'https://spla2.yuu26.com/league/next';
                            returnCode_next = httpGet(getUrl);
                            var parsedValue2 = JSON.parse(returnCode_next);
                            console.log('maps:', '次のリーグマッチは' + parsedValue2['result'][0]['rule'] + 'です。ステージは' + parsedValue2['result'][0]['maps'][0] + 'と' + parsedValue2['result'][0]['maps'][1] + 'です。');

                            this.emit(':ask', '現在のリーグマッチは' + parsedValue1['result'][0]['rule'] + 'です。ステージは' + parsedValue1['result'][0]['maps'][0] + 'と' + parsedValue1['result'][0]['maps'][1]  + 'です。次のガチマッチは' + parsedValue2['result'][0]['rule'] + 'です。ステージは' + parsedValue2['result'][0]['maps'][0] + 'と' + parsedValue2['result'][0]['maps'][1] + 'です。'); // レスポンスの生成
                            break;
                        case "サーモンラン":

                            var returnCode;
                            var getUrl = 'https://spla2.yuu26.com/coop/schedule';
                            returnCode = httpGet(getUrl);
                            var parsedValue = JSON.parse(returnCode);
                            var wNames = ['日曜日', '月曜日', '火曜日', '水曜日', '木曜日', '金曜日', '土曜日'];
                            
                            var start0 = new Date(parsedValue['result'][0]['start_utc']);
                            var m0 = start0.getMonth() + 1;
                            var d0 = start0.getDate();
                            var h0 = start0.getHours();
                            var w0 = start0.getDay();
                            var starttime0 = m0 + '月' + d0 + '日' + wNames[w0] + h0 + '時から'

                            var start1 = new Date(parsedValue['result'][1]['start_utc']);
                            var m1 = start1.getMonth() + 1;
                            var d1 = start1.getDate();
                            var h1 = start1.getHours();
                            var w1 = start1.getDay();
                            var starttime1 = m1 + '月' + d1 + '日' + wNames[w1] + h1  + '時から'

                            for (var i = 0; i < 2; i++) {
                                for (var i = 0; t < 4; i++) {
                                    eval("var weapon[" + i + "][" + t + "] = parsedValue['result'][" + i + "]['weapons'][" + t + "['name']");
                                    if(weapon[i][t] = "?")
                                        weapon[i][t] = "クエスチョン"；
                                    }
                                }
                             
                            this.emit(':ask', '直近のサーモンランは' + starttime0 +  parsedValue['result'][0]['stage']['name'] + 'です。ブキは' + parsedValue['result'][0]['weapons'][0]['name'] + '、' + parsedValue['result'][0]['weapons'][1]['name'] + '、' + parsedValue['result'][0]['weapons'][2]['name'] + '、' + parsedValue['result'][0]['weapons'][3]['name'] + 'です。次のサーモンランは' + starttime1 +  parsedValue['result'][1]['stage']['name'] + 'です。ブキは' + parsedValue['result'][1]['weapons'][0]['name'] + '、' + parsedValue['result'][1]['weapons'][1]['name'] + '、' + parsedValue['result'][1]['weapons'][2]['name'] + '、' + parsedValue['result'][1]['weapons'][3]['name'] + 'です。'); // レスポンスの生成
                            break;
                        case "インク効率アップメイン":
                            outputSpeak = gear + gearpower.inksavermain;
                            break;
                        case "インク効率アップサブ":
                            outputSpeak = gear + gearpower.inksaversub;
                            break;
                        case "インク回復力アップ":
                            outputSpeak = gear + gearpower.inkrecoveryup;
                            break;
                        case "ヒト移動速度アップ":
                            outputSpeak = gear + gearpower.runspeedup;
                            break;
                        case "イカダッシュ速度アップ":
                            outputSpeak = gear + gearpower.swimspeedup;
                            break;
                        case "スペシャル増加量アップ":
                            outputSpeak = gear + gearpower.spechargeup;
                            break;
                        case "スペシャル減少量ダウン":
                            outputSpeak = gear + gearpower.spesaver;
                            break;
                        case "スペシャル性能アップ":
                            outputSpeak = gear + gearpower.spepowerup;
                            break;
                        case "復活時間短縮":
                            outputSpeak = gear + gearpower.quickrespawn;
                            break;
                        case "スーパージャンプ時間短縮":
                            outputSpeak = gear + gearpower.quicksuperjump;
                            break;
                        case "サブ性能アップ":
                            outputSpeak = gear + gearpower.subpowerup;
                            break;
                        case "相手インク影響軽減":
                            outputSpeak = gear + gearpower.inkresistup;
                            break;
                        case "爆風ダメージ軽減":
                            outputSpeak = gear + gearpower.bombdefup;
                            break;
                        case "マーキング時間短縮":
                            outputSpeak = gear + gearpower.coldblooded;
                            break;
                        case "スタートダッシュ":
                            outputSpeak = gear + gearpower.openinggambit;
                            break;
                        case "ラストスパート":
                            outputSpeak = gear + gearpower.lastditcheffort;
                            break;
                        case "逆境強化":
                            outputSpeak = gear + gearpower.tenacity;
                            break;
                        case "カムバック":
                            outputSpeak = gear + gearpower.comeback;
                            break;
                        case "イカニンジャ":
                            outputSpeak = gear + gearpower.ninjasquid;
                            break;
                        case "リベンジ":
                            outputSpeak = gear + gearpower.haunt;
                            break;
                        case "サーマルインク":
                            outputSpeak = gear + gearpower.thermalink;
                            break;
                        case "復活ペナルティアップ":
                            outputSpeak = gear + gearpower.respawnpunisher;
                            break;
                        case "追加ギアパワー倍化":
                            outputSpeak = gear + gearpower.abilitydoubler;
                            break;
                        case "ステルスジャンプ":
                            outputSpeak = gear + gearpower.stealthjump;
                            break;
                        case "対物攻撃力アップ":
                            outputSpeak = gear + gearpower.objectshredder;
                            break;
                        case "受け身術":
                            outputSpeak = gear + gearpower.droproller;
                            break;
                        case "ブキチ":
                            outputSpeak = gear + gearpower.bukichi;
                            break;
                        default:
                            outputSpeak = gear + UNLISTED;
                            break;
                    }
                    setTimeout(() => {
                        this.emit(':ask', outputSpeak, repromptSpeech); // レスポンスの生成
                        console.log(outputSpeak);
                    }, 1000)
                }
                else {
                    var count = gearpowerpath.resolutions.resolutionsPerAuthority[0].values.length
                    var gears = gearpowerpath.resolutions["resolutionsPerAuthority"][0]["values"][0]["value"]["name"]
                    for (var i = 1; i < count; i++) {
                        gears = gears + "と" + gearpowerpath.resolutions["resolutionsPerAuthority"][0]["values"][i]["value"]["name"]
                    }
                    outputSpeak = "候補に" + gears + "があります。もう一度お願いします。";
                    this.emit(':ask', outputSpeak, repromptSpeech); // レスポンスの生成
                    console.log(outputSpeak);
                }
            }
            else {
                var err_gear = gearpowerpath.value; // スロットGearPowerを参照
                outputSpeak = err_gear + MSG_NOLIST;
                this.emit(':ask', outputSpeak, repromptSpeech); // レスポンスの生成
                console.log(outputSpeak);
            }
        } // gearpowerpath &&.. の判定
    },
    //どのインテントにも属さない発話の場合
    'Unhandled': function() {
        var  outputSpeak = UNHANDLED2;
        this.emit(':ask', outputSpeak);
        console.log(outputSpeak);
    },
    // キャンセルといった場合
    'AMAZON.CancelIntent': function () {
        var  reprompt = CANCELED
        this.emit(':tell', reprompt);
        console.log(reprompt);
    },
    // ストップといった場合
    'AMAZON.StopIntent': function () {
        var  reprompt = CANCELED
        this.emit(':tell', reprompt);
        console.log(reprompt);
    },
    'SessionEndedRequest': function() {
        this.emit(':tell', '終了します。');
    }
};
