"use strict";
const Alexa = require('alexa-sdk');
var request = require('sync-request');

// Lambda�֐��̃��C������
exports.handler = function(event, context, callback) {
    var alexa = Alexa.handler(event, context, callback); // Alexa SDK�̃C���X�^���X����
    alexa.appId = process.env.APP_ID; // �X�L����Application Id��ݒ�
    alexa.registerHandlers(handlers); // �n���h���̓o�^
    alexa.execute();                  // �C���X�^���X�̎��s
};

// �Θb���f��
// �M�A�p���[
const gearpower = {
    inksavermain:"���t���₷���u�����h�̓W�����A�t���ɂ����u�����h�̓o�g���C�J�ł��B���C���E�F�|���̏���C���N�ʂ����Ȃ��Ȃ�܂��B", 
    inksaversub:"���t���₷���u�����h�̓z�b�R���[�A�t���ɂ����u�����h�̓t�H�[���}�ł��B�T�u�E�F�|���̏���C���N�ʂ����Ȃ��Ȃ�܂��B", 
    inkrecoveryup:"���t���₷���u�����h�̓A�����A�t���ɂ����u�����h�̓z�b�R���[�ł��B�C���N�^���N�񕜑��x���A�b�v���܂��B", 
    runspeedup:"���t���₷���u�����h�̓��b�P���x���O�A�t���ɂ����u�����h�̓W�����ł��B�q�g��Ԃ̈ړ����x���A�b�v���܂��B", 
    swimspeedup:"���t���₷���u�����h�̓N���[�Q�X�A�t���ɂ����u�����h�̓��b�P���x���O�ł��B�C�J�_�b�V�����̈ړ����x���A�b�v���܂��B", 
    spechargeup:"���t���₷���u�����h�̓��R�A�t���ɂ����u�����h�̓G�]�b�R�ł��B�X�y�V�����Q�[�W�̑����ʂ��A�b�v���܂��B", 
    spesaver:"���t���₷���u�����h�̓G�]�b�R�A�t���ɂ����u�����h�̓z�^�b�N�X�ƃA�i�A�L�ł��B�v���C���[�����ꂽ���̃X�y�V�����Q�[�W�̌����ʂ����Ȃ��Ȃ�܂��B", 
    spepowerup:"���t���₷���u�����h�̓t�H�[���}�A�t���ɂ����u�����h�̓��R�ł��B�X�y�V�����E�F�|���̐��\���A�b�v���܂��B", 
    quickrespawn:"���t���₷���u�����h�̓z�^�b�N�X�A�t���ɂ����u�����h�̓A�C���j�b�N�ł��B�������l���|���Ȃ��܂ܘA���ł��ꂽ���A�������Ԃ��Z���Ȃ�܂��B", 
    quicksuperjump:"���t���₷���u�����h�̓A�C���j�b�N�A�t���ɂ����u�����h�̓A�����ł��B�X�[�p�[�W�����v�̎��Ԃ��Z���Ȃ�܂��B", 
    subpowerup:"���t���₷���u�����h�̓G���y���[�A�t���ɂ����u�����h�̓^�^�L�P���T�L�ł��B�T�u�E�F�|���̐��\���A�b�v���܂��B", 
    inkresistup:"���t���₷���u�����h�̓o�g���C�J�A�t���ɂ����u�����h�̓G���y���[�ł��B����̃C���N���ӂ񂾎��̃_���[�W��ړ����x�̌��������Ȃ��Ȃ�܂��B", 
    bombdefup:"���t���₷���u�����h�̓V�O���j�A�t���ɂ����u�����h�̓N���[�Q�X�ł��B�T�u�E�F�|����X�y�V�����E�F�|���̔����Ŏ󂯂�_���[�W���y�����܂��B", 
    coldblooded:"���t���₷���u�����h�̓A�i�A�L�ƃ^�^�L�P���T�L�A�t���ɂ����u�����h�̓V�O���j�ł��B����̃|�C���g�Z���T�[�Ȃǈʒu�𔭌����Ă���U���̌��ʎ��Ԃ�Z�����܂��B", 
    openinggambit:"�͑ΐ�J�n����30�J�E���g�̊ԃq�g��ԂƃC�J�_�b�V�����̑��x�����Ȃ�A�b�v���܂��B", 
    lastditcheffort:"�͑ΐ�I����30�J�E���g�O����C���N�����ƃC���N�񕜑��x�����Ȃ�A�b�v���܂��B", 
    tenacity:"�͎��`�[���̐l��������`�[����菭�Ȃ��ꍇ�A�������X�y�V�����Q�[�W�������܂��B", 
    comeback:"�̓v���C���[������ĕ��A��A���΂炭�̊ԁA�ꕔ�̔\�͂����Ȃ�A�b�v���܂��B", 
    ninjasquid:"�͒n�ʂ��C�J�_�b�V���������ɃC���N����юU��Ȃ��Ȃ邪�A�ړ����x�������_�E�����܂��B", 
    haunt:"�͕��������Ƃ��A���O�Ɏ�����|��������̈ʒu���������猩����悤�ɂȂ�܂��B", 
    thermalink:"�̓��C���E�F�|���̒e�𒼐ړ��Ă����肪�A���΂炭�̊ԁA�������猩����悤�ɂȂ�܂��B", 
    respawnpunisher:"�͎��v���C���[�Ɠ|��������̃X�y�V���������ʂƕ������Ԃ������܂��B", 
    abilitydoubler:"�͂��̃M�A�ɂ��Ă���ǉ��M�A�p���[��1��2�R���̌��ʂɂ��܂��B", 
    stealthjump:"�̓X�[�p�[�W�����v�̒��n�_�������}�[�J�[���A�͂Ȃꂽ�ꏊ���猩���Ȃ��Ȃ�܂��B", 
    objectshredder:"�̓v���C���[�ȊO�̕��̂ɑ΂��čU�������Ƃ��̃_���[�W�𑝂₵�܂��B", 
    droproller:"�̓X�[�p�[�W�����v���n���ɑO���ɃX�e�B�b�N���������Ă����ƒ��n�Ɠ����ɑO�]���܂��B", 
    bukichi:"�̓M�A�p���[�ł͂���܂���B�J���u���A�[���Y�̓X��ł��B"
}

// ���̂ق��̉���
const MSG_NOLIST = "�̓M�A�p���[���X�g�ɑ��݂��܂���B�Ⴄ���̂ł�����x���ׂ����M�A�p���[�������Ă��������B"
const MSG_CONTINUE = "�����Ăǂ��������Ă��������B"
const MSG_FINISH = "������܂����A�X�v���g�D�[���撣���Ă��������B"
const UNLISTED = "�̓M�A�p���[�ł͂���܂���B";
const UNHANDLED = "�n���h�����O����Ă��܂���B";
const UNHANDLED2 = "�n���h�����O����Ă��܂���2�B";
const CANCELED = "�K�v�Ȏ��͂܂��Ăяo���Ă��������B";

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
    // �C���e���g�ɕR�t���Ȃ����N�G�X�g
    'LaunchRequest': function () {
    this.emit('AMAZON.HelpIntent'); // AMAZON.HelpIntent�̌Ăяo��
    },
    // �X�L���̎g������q�˂�C���e���g
    'AMAZON.HelpIntent': function () {
        this.emit(':ask', '���ׂ����o�g�����[���A�܂��̓M�A�p���[�������Ă��������B');
    },
    // �Θb���f���Œ�`�����A�o�g�����[���A�܂��̓M�A�p���[���������C���e���g
    'GearpowerIntent': function () {
        var gearpowerpath = this.event.request.intent.slots.GearPower;
        if (gearpowerpath && gearpowerpath.resolutions && gearpowerpath.resolutions.resolutionsPerAuthority) {
            var outputSpeak = UNLISTED; // �����l���
            var repromptSpeech = MSG_CONTINUE; // 8�b�ȏ���u��̍ă��b�Z�[�W
            if (gearpowerpath.resolutions["resolutionsPerAuthority"][0]["status"]["code"] == 'ER_SUCCESS_MATCH') {
                if(gearpowerpath.resolutions.resolutionsPerAuthority[0].values.length == 1) {
                    var gear = gearpowerpath.resolutions["resolutionsPerAuthority"][0]["values"][0]["value"]["name"]; // �X���b�gGearPower���Q��
                    switch (gear){
                        case "�i���o��":
                            var returnCode_now;
                            var getUrl = 'https://spla2.yuu26.com/regular/now';
                            returnCode_now = httpGet(getUrl);
                            var parsedValue1 = JSON.parse(returnCode_now);
                            console.log('maps:', '���݂̃i���o���̃X�e�[�W��' + parsedValue1['result'][0]['maps'][0] + '��' + parsedValue1['result'][0]['maps'][1] + '�ł��B');

                            var returnCode_next;
                            var getUrl = 'https://spla2.yuu26.com/regular/next';
                            returnCode_next = httpGet(getUrl);
                            var parsedValue2 = JSON.parse(returnCode_next);
                            console.log('maps:', '���̃i���o���̃X�e�[�W��' + parsedValue2['result'][0]['maps'][0] + '��' + parsedValue2['result'][0]['maps'][1] + '�ł��B');

                            this.emit(':ask', '���݂̃i���o���̃X�e�[�W��' + parsedValue1['result'][0]['maps'][0] + '��' + parsedValue1['result'][0]['maps'][1] + '�ł��B' 
                            + '���̃i���o���̃X�e�[�W��' + parsedValue2['result'][0]['maps'][0] + '��' + parsedValue2['result'][0]['maps'][1] + '�ł��B'); // ���X�|���X�̐���
                            break;
                        case "�K�`�}�b�`":
                            var returnCode_now;
                            var getUrl = 'https://spla2.yuu26.com/gachi/now';
                            returnCode_now = httpGet(getUrl);
                            var parsedValue1 = JSON.parse(returnCode_now);
                            console.log('maps:', '���݂̃K�`�}�b�`��' + parsedValue1['result'][0]['rule'] + '�ł��B�X�e�[�W��' + parsedValue1['result'][0]['maps'][0] + '��' + parsedValue1['result'][0]['maps'][1] + '�ł��B');

                            var returnCode_next;
                            var getUrl = 'https://spla2.yuu26.com/gachi/next';
                            returnCode_next = httpGet(getUrl);
                            var parsedValue2 = JSON.parse(returnCode_next);
                            console.log('maps:', '���̃K�`�}�b�`��' + parsedValue2['result'][0]['rule'] + '�ł��B�X�e�[�W��' + parsedValue2['result'][0]['maps'][0] + '��' + parsedValue2['result'][0]['maps'][1] + '�ł��B');

                            this.emit(':ask', '���݂̃K�`�}�b�`��' + parsedValue1['result'][0]['rule'] + '�ł��B�X�e�[�W��' + parsedValue1['result'][0]['maps'][0] + '��' + parsedValue1['result'][0]['maps'][1]  + '�ł��B���̃K�`�}�b�`��' + parsedValue2['result'][0]['rule'] + '�ł��B�X�e�[�W��' + parsedValue2['result'][0]['maps'][0] + '��' + parsedValue2['result'][0]['maps'][1] + '�ł��B'); // ���X�|���X�̐���
                            break;
                        case "���[�O�}�b�`":
                            var returnCode_now;
                            var getUrl = 'https://spla2.yuu26.com/league/now';
                            returnCode_now = httpGet(getUrl);
                            var parsedValue1 = JSON.parse(returnCode_now);
                            console.log('maps:', '���݂̃��[�O�}�b�`��' + parsedValue1['result'][0]['rule'] + '�ł��B�X�e�[�W��' + parsedValue1['result'][0]['maps'][0] + '��' + parsedValue1['result'][0]['maps'][1] + '�ł��B');

                            var returnCode_next;
                            var getUrl = 'https://spla2.yuu26.com/league/next';
                            returnCode_next = httpGet(getUrl);
                            var parsedValue2 = JSON.parse(returnCode_next);
                            console.log('maps:', '���̃��[�O�}�b�`��' + parsedValue2['result'][0]['rule'] + '�ł��B�X�e�[�W��' + parsedValue2['result'][0]['maps'][0] + '��' + parsedValue2['result'][0]['maps'][1] + '�ł��B');

                            this.emit(':ask', '���݂̃��[�O�}�b�`��' + parsedValue1['result'][0]['rule'] + '�ł��B�X�e�[�W��' + parsedValue1['result'][0]['maps'][0] + '��' + parsedValue1['result'][0]['maps'][1]  + '�ł��B���̃K�`�}�b�`��' + parsedValue2['result'][0]['rule'] + '�ł��B�X�e�[�W��' + parsedValue2['result'][0]['maps'][0] + '��' + parsedValue2['result'][0]['maps'][1] + '�ł��B'); // ���X�|���X�̐���
                            break;
                        case "�T�[��������":

                            var returnCode;
                            var getUrl = 'https://spla2.yuu26.com/coop/schedule';
                            returnCode = httpGet(getUrl);
                            var parsedValue = JSON.parse(returnCode);
                            var wNames = ['���j��', '���j��', '�Ηj��', '���j��', '�ؗj��', '���j��', '�y�j��'];
                            
                            var start0 = new Date(parsedValue['result'][0]['start_utc']);
                            var m0 = start0.getMonth() + 1;
                            var d0 = start0.getDate();
                            var h0 = start0.getHours();
                            var w0 = start0.getDay();
                            var starttime0 = m0 + '��' + d0 + '��' + wNames[w0] + h0 + '������'

                            var start1 = new Date(parsedValue['result'][1]['start_utc']);
                            var m1 = start1.getMonth() + 1;
                            var d1 = start1.getDate();
                            var h1 = start1.getHours();
                            var w1 = start1.getDay();
                            var starttime1 = m1 + '��' + d1 + '��' + wNames[w1] + h1  + '������'

                            for (var i = 0; i < 2; i++) {
                                for (var i = 0; t < 4; i++) {
                                    eval("var weapon[" + i + "][" + t + "] = parsedValue['result'][" + i + "]['weapons'][" + t + "['name']");
                                    if(weapon[i][t] = "?")
                                        weapon[i][t] = "�N�G�X�`����"�G
                                    }
                                }
                             
                            this.emit(':ask', '���߂̃T�[����������' + starttime0 +  parsedValue['result'][0]['stage']['name'] + '�ł��B�u�L��' + parsedValue['result'][0]['weapons'][0]['name'] + '�A' + parsedValue['result'][0]['weapons'][1]['name'] + '�A' + parsedValue['result'][0]['weapons'][2]['name'] + '�A' + parsedValue['result'][0]['weapons'][3]['name'] + '�ł��B���̃T�[����������' + starttime1 +  parsedValue['result'][1]['stage']['name'] + '�ł��B�u�L��' + parsedValue['result'][1]['weapons'][0]['name'] + '�A' + parsedValue['result'][1]['weapons'][1]['name'] + '�A' + parsedValue['result'][1]['weapons'][2]['name'] + '�A' + parsedValue['result'][1]['weapons'][3]['name'] + '�ł��B'); // ���X�|���X�̐���
                            break;
                        case "�C���N�����A�b�v���C��":
                            outputSpeak = gear + gearpower.inksavermain;
                            break;
                        case "�C���N�����A�b�v�T�u":
                            outputSpeak = gear + gearpower.inksaversub;
                            break;
                        case "�C���N�񕜗̓A�b�v":
                            outputSpeak = gear + gearpower.inkrecoveryup;
                            break;
                        case "�q�g�ړ����x�A�b�v":
                            outputSpeak = gear + gearpower.runspeedup;
                            break;
                        case "�C�J�_�b�V�����x�A�b�v":
                            outputSpeak = gear + gearpower.swimspeedup;
                            break;
                        case "�X�y�V���������ʃA�b�v":
                            outputSpeak = gear + gearpower.spechargeup;
                            break;
                        case "�X�y�V���������ʃ_�E��":
                            outputSpeak = gear + gearpower.spesaver;
                            break;
                        case "�X�y�V�������\�A�b�v":
                            outputSpeak = gear + gearpower.spepowerup;
                            break;
                        case "�������ԒZ�k":
                            outputSpeak = gear + gearpower.quickrespawn;
                            break;
                        case "�X�[�p�[�W�����v���ԒZ�k":
                            outputSpeak = gear + gearpower.quicksuperjump;
                            break;
                        case "�T�u���\�A�b�v":
                            outputSpeak = gear + gearpower.subpowerup;
                            break;
                        case "����C���N�e���y��":
                            outputSpeak = gear + gearpower.inkresistup;
                            break;
                        case "�����_���[�W�y��":
                            outputSpeak = gear + gearpower.bombdefup;
                            break;
                        case "�}�[�L���O���ԒZ�k":
                            outputSpeak = gear + gearpower.coldblooded;
                            break;
                        case "�X�^�[�g�_�b�V��":
                            outputSpeak = gear + gearpower.openinggambit;
                            break;
                        case "���X�g�X�p�[�g":
                            outputSpeak = gear + gearpower.lastditcheffort;
                            break;
                        case "�t������":
                            outputSpeak = gear + gearpower.tenacity;
                            break;
                        case "�J���o�b�N":
                            outputSpeak = gear + gearpower.comeback;
                            break;
                        case "�C�J�j���W��":
                            outputSpeak = gear + gearpower.ninjasquid;
                            break;
                        case "���x���W":
                            outputSpeak = gear + gearpower.haunt;
                            break;
                        case "�T�[�}���C���N":
                            outputSpeak = gear + gearpower.thermalink;
                            break;
                        case "�����y�i���e�B�A�b�v":
                            outputSpeak = gear + gearpower.respawnpunisher;
                            break;
                        case "�ǉ��M�A�p���[�{��":
                            outputSpeak = gear + gearpower.abilitydoubler;
                            break;
                        case "�X�e���X�W�����v":
                            outputSpeak = gear + gearpower.stealthjump;
                            break;
                        case "�Ε��U���̓A�b�v":
                            outputSpeak = gear + gearpower.objectshredder;
                            break;
                        case "�󂯐g�p":
                            outputSpeak = gear + gearpower.droproller;
                            break;
                        case "�u�L�`":
                            outputSpeak = gear + gearpower.bukichi;
                            break;
                        default:
                            outputSpeak = gear + UNLISTED;
                            break;
                    }
                    setTimeout(() => {
                        this.emit(':ask', outputSpeak, repromptSpeech); // ���X�|���X�̐���
                        console.log(outputSpeak);
                    }, 1000)
                }
                else {
                    var count = gearpowerpath.resolutions.resolutionsPerAuthority[0].values.length
                    var gears = gearpowerpath.resolutions["resolutionsPerAuthority"][0]["values"][0]["value"]["name"]
                    for (var i = 1; i < count; i++) {
                        gears = gears + "��" + gearpowerpath.resolutions["resolutionsPerAuthority"][0]["values"][i]["value"]["name"]
                    }
                    outputSpeak = "����" + gears + "������܂��B������x���肢���܂��B";
                    this.emit(':ask', outputSpeak, repromptSpeech); // ���X�|���X�̐���
                    console.log(outputSpeak);
                }
            }
            else {
                var err_gear = gearpowerpath.value; // �X���b�gGearPower���Q��
                outputSpeak = err_gear + MSG_NOLIST;
                this.emit(':ask', outputSpeak, repromptSpeech); // ���X�|���X�̐���
                console.log(outputSpeak);
            }
        } // gearpowerpath &&.. �̔���
    },
    //�ǂ̃C���e���g�ɂ������Ȃ����b�̏ꍇ
    'Unhandled': function() {
        var  outputSpeak = UNHANDLED2;
        this.emit(':ask', outputSpeak);
        console.log(outputSpeak);
    },
    // �L�����Z���Ƃ������ꍇ
    'AMAZON.CancelIntent': function () {
        var  reprompt = CANCELED
        this.emit(':tell', reprompt);
        console.log(reprompt);
    },
    // �X�g�b�v�Ƃ������ꍇ
    'AMAZON.StopIntent': function () {
        var  reprompt = CANCELED
        this.emit(':tell', reprompt);
        console.log(reprompt);
    },
    'SessionEndedRequest': function() {
        this.emit(':tell', '�I�����܂��B');
    }
};
