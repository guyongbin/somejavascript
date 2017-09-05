/**************************/
/** イベント，コマンド等 **/
/**************************/
var EVENT_GET_KESAIINPUT_INIT = "KeisaiInputInit";
var EVENT_GET_KESAIINPUT_KAIIN = "KeisaiInputKaiin";
var EVENT_GET_KESAIINPUT_KEISAIF = "KeisaiInputKeisaiF";

var sqlflg = "";
var pmotoGamen = "";//1:掲載一覧（営業用）　2:掲載修正一覧（管理用）
var pstrTanto="";
var pstrMode=""; //1:入力　２：修正　３：参照
var Chusi_Flg = "";//中止フラグ
var Chusi_Flg_Save = "0";//中止フラグ	保存中止フラグ 商品登録后保存　
var Chusi_Flg_Save1 = "0";//中止フラグ  保存中止フラグ上一状况　毎回押で保存　
var Chusi_Flg_Save2 = "0";//中止フラグ  初期状况
var Drop_Flg = "";//取消フラグ
var isOnLoad = false;
var aryShohinlistOne = new Array();
var SeikyuKbn = '1';       //請求先表示フラグ
var pkeisai_kbn;
var pArea;
var phyoji;
var ptokushu;
var phyoji_Save;
var ptokushu_Save;//特集的原状况保存
var pKesaiKbn_Save;//掲載区分的原状况保存「商品」用
var pKesaiKbn2_Save;//掲載区分的原状况保存「現場」用
var pKeisai_kaiin1Save;//掲載会社１的原状况保存
var pKeisaikikanFSave;//掲載期間的原状况保存
var pKeisaikikanFSave1;//掲載期間的変更保存
var pKeisaikikanESave;
var pkeisai_no;
var pchusi_flg="0";
var arySeiri = new Array();
var qryKeisaiInput="";
var strEigyoDate="";
var strArea="";
var strKaCd = "";
var qryKaiinSeikList ="";
var qryKaiinSeikView="";
var bShohinFromDb = true;   //商品選択画面の制御用、Trueの場合、DBからデータを取得、Falseの場合、arySeiriから設定
var AreaCd = "";   //カレンダー選択画面用
var dateKbn = "";   //カレンダー選択画面用
var genba_Flg="0";   //新規／検索登録or最新現場情報取得押下否
var rdSintikuOne = "建築条件付土地";
var rdSintikuTwo = "新築戸建";

/********************/
/** 画面初期化処理 **/
/********************/
function doInit(){

	var GetDataKey = new Object();
	var Condition = new Object();
	var objTmp = new Object();
	var strHtml="";
	
	pkeisai_no=hidKeisaiNo.value;
	pstrMode=hidMode.value;
	pmotoGamen=hidList_kbn.value;
	pstrTanto=hidLoginTanto.value;
	
	Condition.pstrKeiSaiNo=pkeisai_no;
    GetDataKey.Condition = Condition;
    var ResultXml = postXmlHttp(EVENT_GET_KESAIINPUT_INIT,GetDataKey,"");
	var ViewResult= ResultXml.ViewResult;
	var ListResult= ResultXml.ListResult;
	//営業日;
	strEigyoDate = ViewResult.EIGYODATE;
	strArea=ViewResult.AREA;
	//該当データの課コードを取得
	strKaCd =ViewResult.KACD;
	obj("Eeigyobi").innerText =  FormatDate(strEigyoDate,"YY/MM/DD") + GetWeekDay(strEigyoDate,"1");
	
	
	qryKeisaiInput = ViewResult.KEISAIINPUTINIT;

	if (qryKeisaiInput == null){
		return;
	}
	
	qryKeisaiInput = ToArray(qryKeisaiInput.Row);
	
	//掲載ステータス
	hidKeisaiStat.value=qryKeisaiInput[0].KEISAI_STS;
	
	//申込会社NO.
	if (qryKeisaiInput[0].KAIIN_NO!=null){
		txtkaiin_no.value=qryKeisaiInput[0].KAIIN_NO;
	}
	//申込会社名
	if (qryKeisaiInput[0].KAIIN_NAME!=null){
		obj("kaiin_name").innerText =  qryKeisaiInput[0].KAIIN_NAME;
	}
	//申込会社TEL
	if (qryKeisaiInput[0].KAIIN_TEL!=null){
		obj("tel_kaiin").innerText =  qryKeisaiInput[0].KAIIN_TEL;
	}
	//申込会社FAX
	if (qryKeisaiInput[0].KAIIN_FAX!=null){
		obj("fax_kaiin").innerText =  qryKeisaiInput[0].KAIIN_FAX;
	}
	//掲載会社１NO.
	if (qryKeisaiInput[0].KEISAI_KAIIN1_NO!=null){
		keisai_kaiin1_no.value=qryKeisaiInput[0].KEISAI_KAIIN1_NO;
	}
	pKeisai_kaiin1Save = qryKeisaiInput[0].KEISAI_KAIIN1_NO;
	//掲載会社2NO.
	if (qryKeisaiInput[0].KEISAI_KAIIN2_NO!=null){
		keisai_kaiin2_no.value=qryKeisaiInput[0].KEISAI_KAIIN2_NO;
	}
	//掲載会社3NO.
	if (qryKeisaiInput[0].KEISAI_KAIIN3_NO!=null){
		keisai_kaiin3_no.value=qryKeisaiInput[0].KEISAI_KAIIN3_NO;
	}
	
	//掲載会社１
	if (qryKeisaiInput[0].KEISAI_KAIIN_NAME1!=null){
		obj("keisai_kaiin1_name").innerText =  qryKeisaiInput[0].KEISAI_KAIIN_NAME1;
	}
	if (qryKeisaiInput[0].KEISAI_KAIIN_TEL1!=null){
		obj("keisai_kaiin1_tel").innerText =  qryKeisaiInput[0].KEISAI_KAIIN_TEL1;
	}
	if (qryKeisaiInput[0].KEISAI_KAIIN_FAX1!=null){
		obj("keisai_kaiin1_fax").innerText =  qryKeisaiInput[0].KEISAI_KAIIN_FAX1;
	}
	
	//掲載会社２
	if (qryKeisaiInput[0].KEISAI_KAIIN_NAME2!=null){
		obj("keisai_kaiin2_name").innerText =  qryKeisaiInput[0].KEISAI_KAIIN_NAME2;
	}
	if (qryKeisaiInput[0].KEISAI_KAIIN_TEL2!=null){
		obj("keisai_kaiin2_tel").innerText =  qryKeisaiInput[0].KEISAI_KAIIN_TEL2;
	}
	if (qryKeisaiInput[0].KEISAI_KAIIN_FAX2!=null){
		obj("keisai_kaiin2_fax").innerText =  qryKeisaiInput[0].KEISAI_KAIIN_FAX2;
	}
	
	//掲載会社３
	if (qryKeisaiInput[0].KEISAI_KAIIN_NAME3!=null){
		obj("keisai_kaiin3_name").innerText =  qryKeisaiInput[0].KEISAI_KAIIN_NAME3;
	}
	if (qryKeisaiInput[0].KEISAI_KAIIN_TEL3!=null){
		obj("keisai_kaiin3_tel").innerText =  qryKeisaiInput[0].KEISAI_KAIIN_TEL3;
	}
	if (qryKeisaiInput[0].KEISAI_KAIIN_FAX3!=null){
		obj("keisai_kaiin3_fax").innerText =  qryKeisaiInput[0].KEISAI_KAIIN_FAX3;
	}
	
	//掲載番号
	obj("KeisaiNo").innerText =  Condition.pstrKeiSaiNo;
	
	//申込書再発行日 2012.08.01 特急対応 R.Katsumata
	//obj("MouSaihakkoBi").innerText =  getDateFormat(Trim(qryKeisaiInput[0].STS_UPDATE_02));
	
	//現場番号
	if (qryKeisaiInput[0].GENBA_NO!=null){
		obj("GenbaNo").innerText=qryKeisaiInput[0].GENBA_NO;
	}

	//掲載区分「基本掲載」
	if (Trim(qryKeisaiInput[0].KEISAI_KBN)=="1"){
		rdKihon.checked =true;
	}
	//掲載区分「オプションのみ」
	if (Trim(qryKeisaiInput[0].KEISAI_KBN)=="2"){
		rdOption.checked =true;
	}
	//掲載区分「その他」
	if (Trim(qryKeisaiInput[0].KEISAI_KBN)=="3"){
		rdSonota.checked =true;
	}
	pKesaiKbn_Save = qryKeisaiInput[0].KEISAI_KBN;
	pKesaiKbn2_Save = qryKeisaiInput[0].KEISAI_KBN;
		
	//作業区分「新規」
	if (Trim(qryKeisaiInput[0].SAGYO_KBN)=="1"){
		rdSinki.checked =true;
	}
	//作業区分「期間延長」
	if (Trim(qryKeisaiInput[0].SAGYO_KBN)=="2"){
		rdEnchyo.checked =true;
	}
	//作業区分「再掲載」
	if (Trim(qryKeisaiInput[0].SAGYO_KBN)=="3"){
		rdZaiKeisai.checked =true;
	}
		
	
	//登録日
	obj("Torokubi").innerText =  getDateFormat(Trim(qryKeisaiInput[0].JUCHU_TOROKU));
	
	//入稿日
	obj("Nyukobi").innerText =  getDateFormat(Trim(qryKeisaiInput[0].JUCHU));
	
	//計上日
	kejyobi.value=getDateFormat(Trim(qryKeisaiInput[0].URIAGE));
	obj("hidkejyobi").innerText=getDateFormat(Trim(qryKeisaiInput[0].URIAGE));
	
	//掲載期間
	keisaikikanF.value=getDateFormat(Trim(qryKeisaiInput[0].KIKAN_FROM));
	keisaikikanE.value=getDateFormat(Trim(qryKeisaiInput[0].KIKAN_TO));
	//2012.12.11 蔡吉
	pKeisaikikanFSave=getDateFormat(Trim(qryKeisaiInput[0].KIKAN_FROM));
	pKeisaikikanFSave1=getDateFormat(Trim(qryKeisaiInput[0].KIKAN_FROM));
	pKeisaikikanESave=getDateFormat(Trim(qryKeisaiInput[0].KIKAN_TO));
	
	//種別
	//2012.12.11 蔡吉↓
	//20120316nakamura↓ラジオボタン位置・データ入れ替え
	//if (Trim(qryKeisaiInput[0].EDA_NO)=="01"){
	//	rdSintiku.checked =true;
	//}
	//if (Trim(qryKeisaiInput[0].EDA_NO)=="02"){
	//	rdJyoken.checked =true;
	//}
	//if (Trim(qryKeisaiInput[0].EDA_NO)=="01"){
	//	rdJyoken.checked =true;
	//}
	//if (Trim(qryKeisaiInput[0].EDA_NO)=="02"){
	//	rdSintiku.checked =true;
	//}
	//20120316nakamura↑
	if (qryKeisaiInput[0].SEIKYU_GENBA!=null){
		Reqgenbanm.value=qryKeisaiInput[0].SEIKYU_GENBA;
	}
	//2012.12.11 蔡吉↑

	//請求現場名		2012.12.11 蔡吉
	if (qryKeisaiInput[0].SYUBETU_NM!=null){
		obj("rdSintiku").innerText=qryKeisaiInput[0].SYUBETU_NM;
	}
	
	//現場名
	if (qryKeisaiInput[0].GENBA_NAME!=null){
		obj("Genbanm").innerText=qryKeisaiInput[0].GENBA_NAME;
	}
	
	//所在地1
	if (qryKeisaiInput[0].SHOZAICHI1_CD!=null){
		obj("syozai_cd3").innerText=qryKeisaiInput[0].SHOZAICHI1_CD;
	}
	//所在地2
	if (qryKeisaiInput[0].SHOZAICHI2_CD!=null){
		obj("syozai_cd4").innerText=qryKeisaiInput[0].SHOZAICHI2_CD;
	}

	//2012.12.11 蔡吉
	//if (qryKeisaiInput[0].SHOZAICHI_NM!=null){
	//	syozaichi.value=qryKeisaiInput[0].SHOZAICHI_NM;
	//}

	//所在地名
	if (qryKeisaiInput[0].SHOZAICHI_NAME!=null){
		obj("lblSyozaiNm").innerText =qryKeisaiInput[0].SHOZAICHI_NAME;
	}
	//所在地備考
	if(qryKeisaiInput[0].SHOZAICHI_NM!=null){
		obj("SyozaiNm1").innerText =qryKeisaiInput[0].SHOZAICHI_NM;
	}


	// 蔡吉  2012.12.31↓
 	if(Trim(qryKeisaiInput[0].KEISAI_KBN)=="3"){
		//掲載区分=「その他」
		btnInsertOrSelect.disabled = true;
		btnGetMeg.disabled = true;
		rdSinki.checked = false;
		rdEnchyo.checked = false;
		rdZaiKeisai.checked = false;
		obj('rdSinki').disabled = true;
		obj('rdEnchyo').disabled = true;
		obj('rdZaiKeisai').disabled = true;
		document.getElementById("GenbaNo").innerHTML = "";
		document.getElementById("rdSintiku").innerHTML = "";
		document.getElementById("Genbanm").innerHTML = "";
		document.getElementById("syozai_cd3").innerHTML = "";
		document.getElementById("syozai_cd4").innerHTML = "";
		document.getElementById("lblSyozaiNm").innerHTML = "";
		document.getElementById("SyozaiNm1").innerHTML = "";
	}else{
		btnInsertOrSelect.disabled = false;
		if(obj("GenbaNo").innerText == ""){
			btnGetMeg.disabled = true;
		}else {
			btnGetMeg.disabled = false;
		}
		if(Trim(qryKeisaiInput[0].KEISAI_KBN)=="2"){
			//掲載区分=「オプション」 
			rdSinki.checked = true;
			obj('rdEnchyo').disabled = true;
     		obj('rdZaiKeisai').disabled = true;
		}else{
			obj('rdSinki').disabled = false;
			obj('rdEnchyo').disabled = false;
			obj('rdZaiKeisai').disabled = false;
		}		
	}
	
	Chusi_Flg = qryKeisaiInput[0].CHUSI;
	Drop_Flg  =qryKeisaiInput[0].TORIKESI;
	//2012.12.11 蔡吉
	if (Trim(qryKeisaiInput[0].CHUSI)=="1"){
		//中止フラグ「中止」
		obj("Chusi").innerText =  "掲載中止";
		pchusi_flg="1";//掲載中止「中止」
		Chusi_Flg_Save="1";
		Chusi_Flg_Save1="1";
		Chusi_Flg_Save2="1";
		btnChusi.disabled = true;
		btnDrop.disabled = true;
		btnDropCancel.disabled = true;
	}else if(Trim(qryKeisaiInput[0].TORIKESI)=="1"){
		//受注取消フラグ
		obj("Chusi").innerText =  "受注取消";
		btnChusiCancel.disabled = true;
		btnChusi.disabled = true;
		btnDrop.disabled = true;
	}else{
		obj("Chusi").innerText =  "";
		btnChusiCancel.disabled = true;
		btnDropCancel.disabled = true;
	}
	//2012.12.31 蔡吉↑
	
	var qryTantoList = ListResult.TANTO;
	
	//担当者リスト
	if (qryTantoList != null){
		setList("TantoSelect",qryTantoList.item,qryKeisaiInput[0].TANTO,true);
	}else{
		setList("TantoSelect",null,null,true);
	}
	
	var qryHyojiList = ListResult.HYOJI;
	//上位表示リスト  2012.12.11 蔡吉
	//コード.上位表示 != null
	if (qryHyojiList != null){
		//掲載物件情報.上位表示 != null
		if(qryKeisaiInput[0].HYOJI != null){
			setList("cmbHyoji",qryHyojiList.item,qryKeisaiInput[0].HYOJI,false);
			phyoji_Save=qryKeisaiInput[0].HYOJI;
		}else{
			setList("cmbHyoji",qryHyojiList.item,"1",false);
			phyoji_Save="1";//初期値「なし」を表示
		}
	}else{
		setList("cmbHyoji",null,null,false);
		phyoji_Save="1";
	}

	//2012.12.14  蔡吉
	var qryTokushuList = ListResult.TOKUSHU;
	//特集リスト
	//コード.特集 != null
	if (qryTokushuList != null){
		//掲載物件情報.特集 != null
		if (qryKeisaiInput[0].TOKUSHU != null){
			setList("tokushu",qryTokushuList.item,qryKeisaiInput[0].TOKUSHU,false);
			ptokushu_Save = qryKeisaiInput[0].TOKUSHU;
		}else{
			setList("tokushu",qryTokushuList.item,"1",false);
			ptokushu_Save = "1";//初期値「なし」を表示
		}
	}else{
		setList("tokushu",null,null,false);
		ptokushu_Save = "1";
	}
	
	//会員請求先
	qryKaiinSeikList = ListResult.KAIINSEIK;
	
	if (qryKaiinSeikList != null){
		qryKaiinSeikView=ViewResult.QRYKAIINSEIK
		qryKaiinSeikView = ToArray(qryKaiinSeikView.Row);
		setList("cmbKaiinSeik",qryKaiinSeikList.item,Trim(qryKeisaiInput[0].KAIIN_SEIK),true);
	}else{
		setList("cmbKaiinSeik",null,null,true);
	}
	//会員請求先名
	if (qryKeisaiInput[0].SEIKYU_NM!=null){
		obj("lblKaiinSeikNM").innerText=qryKeisaiInput[0].SEIKYU_NM;
	}
	if (qryKeisaiInput[0].SEIKYU_SOU_NM!=null){
		obj("lblKaiinSeikSOUNM").innerText=qryKeisaiInput[0].SEIKYU_SOU_NM;
	}
	
	//掲載明細
	var Gokei_Kingaku=0;
	var Gokei_Nebiki=0;
	var Gokei_Sashihiki=0;
	var Gokei_Shohizei=0;
	var SoGokei=0;
	var icount=0;
		
	
	//20120314nakamura↓商品選択テーブルの枠太さを細くする
	//strHtml = '<table border="1" cellspacing="1" cellpadding="0" class="sfont">';
	strHtml = '<table border="1" cellpadding="1" cellspacing="0" class="sfont">';
	//20120314nakamura↑
	strHtml += '<tr align="center" class="juchuInpMeisai">';
	strHtml += '<td align="center" height="20"  width="200">';
	strHtml += '<input type="Button" id="shoHinSentaku" value="商品選択" onClick="onShohinSentakuClick()"></td>';
	strHtml += '<td width="40">数量</td>';
	strHtml += '<td width="70">本体金額</td>';
	strHtml += '<td width="65">値引額</td>';
	strHtml += '<td width="75">差引金額</td> </tr>';
	if (qryKeisaiInput[0].SHOHIN_NM!=null){
		bShohinFromDb = true;
		for(var icount=0;icount<qryKeisaiInput.length;icount++){
			objTmp = new Object();
			strHtml += '<tr>';
			
			//商品名
			strHtml += '	<td>'+ToHtmlNull(qryKeisaiInput[icount].SHOHIN_NM) +'</td>';
			objTmp.SHOHIN_NM = qryKeisaiInput[icount].SHOHIN_NM;
			objTmp.SHOHIN_CD = qryKeisaiInput[icount].SHOHIN_CD;
			//数量 
			strHtml += '	<td align="right">' + ToHtmlNull(jpfMdfyComma(Trim(qryKeisaiInput[icount].SURYO),0)) + '<br>';
			objTmp.SURYO = qryKeisaiInput[icount].SURYO;
			//本体金額 
			strHtml += '	<td align="right">' + ToHtmlNull(jpfMdfyComma(Trim(qryKeisaiInput[icount].KINGAKU),0)) + '<br>';
			objTmp.KINGAKU = qryKeisaiInput[icount].KINGAKU;
			//値引額 
			strHtml += '	<td align="right">' + ToHtmlNull(jpfMdfyComma(Trim(qryKeisaiInput[icount].NEBIKI),0)) + '<br>';
			objTmp.NEBIKI = qryKeisaiInput[icount].NEBIKI;
			
			//差引金額 
			strHtml += '	<td align="right">' + ToHtmlNull(jpfMdfyComma(Trim(qryKeisaiInput[icount].GOKEI),0)) + '<br>';
			objTmp.GOKEI = qryKeisaiInput[icount].GOKEI;
			strHtml += '</tr>';
			
			Gokei_Kingaku=parseFloat(Gokei_Kingaku)+parseFloat(qryKeisaiInput[icount].KINGAKU);
			Gokei_Nebiki=parseFloat(Gokei_Nebiki)+parseFloat(qryKeisaiInput[icount].NEBIKI);
			Gokei_Sashihiki=parseFloat(Gokei_Sashihiki)+parseFloat(qryKeisaiInput[icount].GOKEI);
			Gokei_Shohizei=parseFloat(Gokei_Shohizei)+parseFloat(qryKeisaiInput[icount].SHOHIZEI);
			objTmp.SHOHIZEI = qryKeisaiInput[icount].SHOHIZEI;   //消費税
			SoGokei=parseFloat(SoGokei)+parseFloat(qryKeisaiInput[icount].ZEIKOMI);
			objTmp.ZEIKOMI = qryKeisaiInput[icount].ZEIKOMI;   //税込み
			
			arySeiri[icount] = objTmp;
		}
	}
	for(var mLoop=icount;mLoop<10;mLoop++){
		strHtml += '<tr>';
		
		//商品名
		strHtml += '<td>&nbsp</td>';
		
		//数量 
		strHtml += '<td>&nbsp</td>';
		
		//本体金額 
		strHtml += '<td>&nbsp</td>';
		
		//値引額 
		strHtml += '<td>&nbsp</td>';
		
		//差引金額 
		strHtml += '<td>&nbsp</td>';
		
		
		strHtml += '</tr>';
	}
	if (qryKeisaiInput[0].SHOHIN_NM!=null){
		strHtml += '<tr><td colspan="2" class="juchuInpMeisai" align="center">合計</td>';
		strHtml += '<td align="right" height="20">' + jpfMdfyComma(String(Gokei_Kingaku),0) +'</td>';
		strHtml += '<td align="right" >' + jpfMdfyComma(String(Gokei_Nebiki),0) +'</td>';
		strHtml += '<td align="right" >' + jpfMdfyComma(Gokei_Sashihiki,0) +'</td></tr>';
		strHtml += '<tr><td colspan="2" class="juchuInpMeisai" align="center" height="20">消費税額</td>';
		strHtml += '<td align="right" colspan="3">'+jpfMdfyComma(Gokei_Shohizei,0) +'</td></tr>';
		strHtml += '<tr><td colspan="2" class="juchuInpMeisai" align="center" height="20">総合計</td>';
		strHtml += '<td align="right" colspan="3">'+jpfMdfyComma(SoGokei,0) +'</td></tr>';
	}else{
		strHtml += '<tr><td colspan="2" class="juchuInpMeisai" align="center">合計</td>';
		strHtml += '<td align="right" height="20">&nbsp</td>';
		strHtml += '<td align="right" >&nbsp</td>';
		strHtml += '<td align="right" >&nbsp</td></tr>';
		strHtml += '<tr><td colspan="2" class="juchuInpMeisai" align="center" height="20">消費税額</td>';
		strHtml += '<td align="right" colspan="3">&nbsp</td></tr>';
		strHtml += '<tr><td colspan="2" class="juchuInpMeisai" align="center" height="20">総合計</td>';
		strHtml += '<td align="right" colspan="3">&nbsp</td></tr>';
	}
	strHtml += '</table>';
	obj("ShohinList").innerHTML = strHtml;

	//画面コントロールの制御
	gamenCtl(pstrMode);

	onInitControls();
	initConvTable();
	// 禁止文字チェック用変換テーブル初期化 
	initCodeTable();
	
	

}
/**********************************/ 
/** 画面制御					 **/ 
/**********************************/ 
function gamenCtl(kbn) { 
	//入力
    if (kbn==1){
    	//掲載中止ボタン、掲載中止取消ボタンを非表示
		//受注取消ボタン、受注取消解除ボタンを非表示 
    	btnChusi.style.display="none";
    	btnChusiCancel.style.display="none";
		//2012.12.14  蔡吉
		btnDrop.style.display="none";
    	btnDropCancel.style.display="none";
    	
    	//現場番号は表示項目 DEL 2012.08.01 特急対応 R.Katsumata
    	// obj("genba_no").disabled = true;
    	
    	//クエリ１の掲載ステータスが「0」（商談開始）の場合																										
		//仮登録ボタンは使用可能（Enabeled = true）																								
		//以外の場合																										
		//仮登録ボタンは使用不可（Enabeled = false）																								
		if (Trim(hidKeisaiStat.value)!=0){
			btnKariToroku.style.display="none";
		}
		
		//計上日は表示項目
		//2012.12.14  蔡吉↓
		//obj("kejyobi").disabled = true;
		kejyobi.style.display = "none";
		hidkejyobi.style.display = "inline-block";
		btnKeijyobi.style.display = "none";
		//obj("btnKeijyobi").disabled = true;
		//2012.12.14  蔡吉↑

    }
    //修正
    if (kbn==2){
    	//仮登録を非表示
    	btnKariToroku.style.display="none";
    }
    //参照
    if (kbn==3){
    	//非表示項目
		var inputElements = document.getElementsByTagName("input");
		var selectElements = document.getElementsByTagName("select");
		var radioElements = document.getElementsByTagName("rdokeisaikbn");
		var array = new Array(inputElements, selectElements,radioElements);
		for(i = 0, len = array.length; i<len;i++){
			for(tg in array[i]) {
				var target = array[i][tg];
				strType	= getBlankData(target.type);
				strTags	= getBlankData(target.tagName);
				if(strType.toUpperCase() == 'TEXT') {
					array[i][tg].readOnly = true;
				}
				if(strTags.toUpperCase() == 'SELECT'){
					array[i][tg].disabled = true;
				}
				if(strType.toUpperCase() == 'BUTTON'){
					array[i][tg].disabled = true;
				}
			}
		}
		//掲載区分「基本掲載」
		rdKihon.disabled				=true;
		rdKihon.style.border            =1;
		//掲載区分「オプションのみ」
		rdOption.disabled				=true;
		rdOption.style.border			=1;
		//掲載区分「その他」
		rdSonota.disabled				=true;
		rdSonota.style.border			=1;
		//作業区分「新規」
		rdSinki.disabled				=true;
		rdSinki.style.border			=1;
		//作業区分「期間延長」
		rdEnchyo.disabled				=true;
		rdEnchyo.style.border			=1;
		//作業区分「再掲載」
		rdZaiKeisai.disabled			=true;
		rdZaiKeisai.style.border		=1;
		btnKariToroku.style.display		="none";//仮登録ボタン
    	btnToroku.style.display			="none";//登録ボタン
		btnChusi.style.display			="none";//掲載中止ボタン
    	btnChusiCancel.style.display	="none";//掲載中止取消ボタン
		btnDrop.style.display			="none";//受注取消ボタン
    	btnDropCancel.style.display		="none";//受注取消解除ボタン
		getBackPage.disabled			= false;//前画面
    	//obj("genba_no").disabled = true;
    }
}

/**********************************/ 
/** 前画面ボタン				 **/ 
/**********************************/ 
//2012.08.01 特急対応 R.Katsumata
function onBackButton(){
	//掲載一覧（営業）・掲載一覧管理のみ
	if (FromGamen.value == "NewKanri" || FromGamen.value == "ItiranKanri"){	
		ret = confirm("一覧画面に戻りますか？変更内容は反映されません")
		if(ret == true){
			onBack();
		}else{
			return;
		}
	}
	onBack();
}

/**********************************/ 
/** 前画面						 **/ 
/**********************************/ 
function onBack() {
	//画面条件を設定
	strCondition = getGamenCondition();
	if (pmotoGamen==1){
		//掲載一覧（営業）
		location.replace("/seasar/ajaxClt/atview/juchu/NHjuchu/KeiSaiItiranEigyo/KeiSaiItiranEigyo.cfm?" + strCondition );
	}else{
		if (pmotoGamen==2){
			//掲載一覧管理
			location.replace("/seasar/ajaxClt/atview/juchu/NHjuchu/KeiSaiItiranKanri/KeiSaiItiranKanri.cfm?" + strCondition);
		}else{ 
			//進捗確認
			location.replace("/seasar/ajaxClt/atview/juchu/NHjuchu/ScheduelConfirm/ScheduelConfirm.cfm?" + strCondition);
		}
	}
}
/**********************************/ 
/** 会員複写					 **/ 
/**********************************/ 
function KaiinCopy() { 
	if (Trim(txtkaiin_no.value)==""){
		alert("申込会員を選択して下さい。");
		txtkaiin_no.select();
		return;
	}
	keisai_kaiin1_no.value=txtkaiin_no.value;
	obj("keisai_kaiin1_name").innerText =  obj("kaiin_name").innerText;
	obj("keisai_kaiin1_tel").innerText =  obj("tel_kaiin").innerText;
	obj("keisai_kaiin1_fax").innerText =  obj("fax_kaiin").innerText;
	
}

/**********************************/ 
/**　	新規／検索登録　最新現場情報取得			 **/ 
/**　	2012.12.14  蔡吉	 		 **/ 
/**********************************/ 
function onGetMsgClick(btn){

	if(Trim(txtkaiin_no.value)== ""){
		alert("申込会員の会員番号を入力して下さい。");
		txtkaiin_no.select();
		return false;
	}
	if(Trim(keisai_kaiin1_no.value) == ""){
		alert("掲載会社１の会員番号を入力して下さい。");
		keisai_kaiin1_no.select();			
		return false;
	}
	if(Trim(keisaikikanF.value) == ""){
		alert("掲載期間FROMを入力して下さい。");
		keisaikikanF.focus();
		return false;
	}
	if(Trim(keisaikikanE.value) == ""){
		alert("掲載期間TOを入力して下さい。");
		keisaikikanE.focus();			
		return false;
	}
	if(!rdKihon.checked && !rdOption.checked && !rdSonota.checked){
		alert("掲載区分を入力して下さい。");
		rdKihon.focus();
		return false;
	}
	//新規／検索登録
	if(btn == "1"){
		kaiinNo = txtkaiin_no.value;//申込会員
		keikaiNo = keisai_kaiin1_no.value;//掲載会社１
		kikanNoF = keisaikikanF.value;//掲載期間From
		kikanNoT = keisaikikanE.value;//掲載期間To
		syubetu = obj("rdSintiku").innerHTML;//種別
		genBaNo = obj("GenbaNo").innerHTML;//現場番号
		shozaichi1 = obj("syozai_cd3").innerHTML;//所在地1
		shozaichi2 = obj("syozai_cd4").innerHTML;//所在地2
		keisaiNo = obj("KeisaiNo").innerHTML;//掲載番号
		genBaNm = obj("Genbanm").innerHTML;//現場名
		SyozaiNm3 = obj("lblSyozaiNm").innerHTML;//所在地1
		SyozaiNm2 = obj("SyozaiNm1").innerHTML;//所在地備考
		
		var GetDataKey = new Object();
		var Condition = new Object();
		//申込会員データベース存在チェック
		Condition.kaiin_no =obj("txtkaiin_no").value;
		Condition.kbn ="1";
		GetDataKey.Condition = Condition;
		var ResultXml = postXmlHttp(EVENT_GET_KESAIINPUT_KAIIN,GetDataKey,"");
		var ViewResult= ResultXml.ViewResult;
		sqlflg = ViewResult.SQLFLG;
		if(sqlflg != "OK"){
			alert("申込会員を選択して下さい。");
			txtkaiin_no.select();
			return;
		}
		
		//掲載会社１データベース存在チェック
		Condition.kbn ="0";
		Condition.kaiin_no = obj("keisai_kaiin1_no").value;
		GetDataKey.Condition = Condition;
		var ResultXml = postXmlHttp(EVENT_GET_KESAIINPUT_KAIIN,GetDataKey,"");
		var ViewResult= ResultXml.ViewResult;
		sqlflg = ViewResult.SQLFLG;
		if(sqlflg != "OK"){
			alert("掲載会社１を選択して下さい。");
			keisai_kaiin1_no.select();
			return;
		}
		
		var strUrl    = "/seasar/ajaxClt/atview/juchu/NHjuchu/GenbakenSaku/GenbakenSaku.cfm";  
		// 画面窗口   
		var strOpt    = "dialogWidth:950px;dialogHeight:600px;center:yes ;edge:sunken ;status;no;";
		try{  
			//子画面表示   
			mainWnd = window.showModalDialog(strUrl, this, strOpt);
			if(mainWnd == "getDate"){
				genba_Flg="1";
				pKeisai_kaiin1Save=Trim(keisai_kaiin1_no.value);
				//基本掲載
				if (rdKihon.checked){
					pKesaiKbn2_Save = "1";
				}
				//オプションのみ
				if (rdOption.checked){
					pKesaiKbn2_Save = "2";		
				}
				//その他
				if (rdSonota.checked){
					pKesaiKbn2_Save = "3";
				}
				//掲載期間
				pKeisaikikanFSave=Trim(keisaikikanF.value);
				pKeisaikikanESave=Trim(keisaikikanE.value);
				//現場番号
				if(objGetDate.GENBA_NO !=null){
					obj("GenbaNo").innerHTML = objGetDate.GENBA_NO;
				}else{
					obj("GenbaNo").innerHTML ="";
				}
				//作業区分
				//掲載区分[基本掲載]
				if(rdKihon.checked){
					if(objGetDate.SAGYO_KBN == "1"){
						//新規
						rdSinki.checked = true;
						rdEnchyo.checked = false;
						rdZaiKeisai.checked = false;
					}else if(objGetDate.SAGYO_KBN == "2"){
						//期間延長
						rdSinki.checked = false;
						rdEnchyo.checked = true;
						rdZaiKeisai.checked = false;
					}else {
						//再掲載
						rdSinki.checked = false;
						rdEnchyo.checked = false;
						rdZaiKeisai.checked = true;
					}
				}else if(rdOption.checked){//掲載区分[オプションのみ]
					rdSinki.checked = true;
					rdEnchyo.checked = false;
					rdZaiKeisai.checked = false;
					obj("rdEnchyo").disabled = true;
					obj('rdZaiKeisai').disabled = true;
				}
				//現場番号
				if(obj("GenbaNo").innerText == ""){
					btnGetMeg.disabled = true;
				}else {
					btnGetMeg.disabled = false;
				}
				//種別
				if(objGetDate.SHUBETU_CD !=null){
					obj("rdSintiku").innerHTML = objGetDate.SHUBETU_CD;
				}else{
					obj("rdSintiku").innerHTML ="";
				}
				//現場名
				if(objGetDate.GENBA_NM !=null){
					obj("Genbanm").innerHTML = objGetDate.GENBA_NM;
				}else{
					obj("Genbanm").innerHTML ="";
				}
				//所在地NO.1
				if(objGetDate.SHOZAICHI1_CD != null){
					obj("syozai_cd3").innerHTML = objGetDate.SHOZAICHI1_CD;
				}else{
					obj("syozai_cd3").innerHTML ="";
				}
				//所在地NO.2
				if(objGetDate.SHOZAICHI2_CD !=null){
					obj("syozai_cd4").innerHTML = objGetDate.SHOZAICHI2_CD;
				}else{
					obj("syozai_cd4").innerHTML ="";
				}
				//所在地1
				if(objGetDate.SHOZAICHI_NM !=null){
					obj("lblSyozaiNm").innerHTML = objGetDate.SHOZAICHI_NM;
				}else{
					obj("lblSyozaiNm").innerHTML ="";
				}
				//所在地備考
				if(objGetDate.SHOZAICHI_NM2 !=null){
					obj("SyozaiNm1").innerHTML = objGetDate.SHOZAICHI_NM2;
				}else{
					obj("SyozaiNm1").innerHTML ="";
				}
				
			}
		}catch(e){
		}

	}


	//最新現場情報取得
	if(btn=="2"){
		eventName = "GetDate"
		var Condition = new Object();
		var GetDate = new Object();
		Condition.KeikaiNo = keisai_kaiin1_no.value;//掲載会社１
		//現場番号
		if(Trim(obj("GenbaNo").innerText) == ""){
			return;
		}else{
			Condition.GenBaNo = Trim(obj("GenbaNo").innerText);//現場番号
		}
		Condition.Shozaichi1="";//所在地1
		Condition.Shozaichi2="";//所在地備考
		Condition.kaiin_nm="";//現場名
		Condition.ZaiHan="";//新築戸建
		GetDate.ListItem = Condition;
		ResultXml = postXmlHttp(eventName,GetDate,"");
		//outDebug(ResultXml);
		ResultXml = ResultXml.ViewResult.KEISAIITIRANDATALIST;
		if(ResultXml==null){
			alert("入稿システムにデータが存在しません。現場検索にて現場を指定して下さい。");
			btnInsertOrSelect.focus();
			return;
		}
		genba_Flg="1";
		pKeisai_kaiin1Save=Trim(keisai_kaiin1_no.value);
		//基本掲載
		if (rdKihon.checked){
			pKesaiKbn2_Save = "1";
		}
		//オプションのみ
		if (rdOption.checked){
			pKesaiKbn2_Save = "2";		
		}
		//その他
		if (rdSonota.checked){
			pKesaiKbn2_Save = "3";
		}
		//掲載期間
		pKeisaikikanFSave=Trim(keisaikikanF.value);
		pKeisaikikanESave=Trim(keisaikikanE.value);
		Save_ResultXml = ResultXml.Row;
		//現場番号
		if(Save_ResultXml.PROJECT_ID != null){
			obj("GenbaNo").innerText   = Save_ResultXml.PROJECT_ID;
		}else{
			obj("GenbaNo").innerText   = "";
		}
		//種別
		if(Save_ResultXml.CODE_KNJ != null){
			obj("rdSintiku").innerText  = Save_ResultXml.CODE_KNJ;
		}else{
			obj("rdSintiku").innerText  ="";
		}
		//現場名
		if(Save_ResultXml.PROJECT_NAME != null){
			obj("Genbanm").innerText    = Save_ResultXml.PROJECT_NAME;
		}else{
			obj("Genbanm").innerText    = "";
		}
		//所在地1
		if(Save_ResultXml.SYZ_CD1 != null){
			obj("syozai_cd3").innerText  = Save_ResultXml.SYZ_CD1;
		}else{
			obj("syozai_cd3").innerText  = "";
		}
		//所在地2
		if(Save_ResultXml.SYZ_CD2 != null){
			obj("syozai_cd4").innerText  = Save_ResultXml.SYZ_CD2;
		}else{
			obj("syozai_cd4").innerText  ="";
		}
		//所在地
		if(Save_ResultXml.SYZ_RKNM != null){
			obj("lblSyozaiNm").innerText = Save_ResultXml.SYZ_RKNM;
		}else{
			obj("lblSyozaiNm").innerText ="";
		}
		//オプションのみ
		if(rdOption.checked){
			rdSinki.checked = true;
			obj("rdEnchyo").disabled = true;
			obj('rdZaiKeisai').disabled = true;
		}else if(rdKihon.checked){
			//基本掲載
			var closeDay = Save_ResultXml.CLOSE_DAY;
			var P_KikanNoF = document.getElementById("keisaikikanF").value;
			closeDay2 = ToHtmlNull(closeDay.substr(0,4) +'/'+closeDay.substr(5,2)+'/'+closeDay.substr(8,2));
			closeDay1   = ToHtmlNull(closeDay.substr(0,4) +closeDay.substr(5,2)+closeDay.substr(8,2));
			P_KikanNoF1 = TrimToken(P_KikanNoF,"/");
			P_KikanNoF2 = DateChange(P_KikanNoF); 
			closeDay2=DateChange(closeDay2);
			closeDay2.addDays(1);//日期加1
			if(closeDay1 >= P_KikanNoF1){
				alert("選択されている現場は入稿データの掲載期間と重複しています。確認の上手配してください。");
				rdEnchyo.checked=true;//作業区分[期間延長]
			}else{
				if(P_KikanNoF2-closeDay2=="0"){
					rdEnchyo.checked=true;//作業区分[期間延長]
				}else{
					rdZaiKeisai.checked=true;//作業区分[再掲載]
				}
			}
		}
	}
}

/************************************/
//日期处理
//2013.01.04  蔡吉	 
/************************************/
function DateChange(date){
	var arr1 = date.split("/");
	//月去掉0
	if(arr1[1].substr(0,1)==0){
		arr1[1]=arr1[1].substr(1,1);
	}
	//日去掉0
	if(arr1[2].substr(0,1)==0){
		arr1[2]=arr1[2].substr(1,1);
	}
	var finaldate = new Date(arr1[0],parseInt(arr1[1])-1,arr1[2]);
	return finaldate;
}
/************************************/
//日期加
//2012.01.04 蔡吉	 
/************************************/
Date.prototype.Format = function(fmt) 
{
    var o =
     { 
        "M+" : this.getMonth() + 1, //月份 
        "d+" : this.getDate(), //日 
        "h+" : this.getHours(), //小时 
        "m+" : this.getMinutes(), //分 
        "s+" : this.getSeconds(), //秒 
        "q+" : Math.floor((this.getMonth() + 3) / 3), //季度 
        "S" : this.getMilliseconds() //毫秒 
     }; 
    if (/(y+)/.test(fmt)) {
         fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length)); 
	}
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
             fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length))); 
		}
    return fmt; 
	}
}

Date.prototype.addDays = function(d)
{
    this.setDate(this.getDate() + d);
};

Date.prototype.addWeeks = function(w)
{
    this.addDays(w * 7);
};

Date.prototype.addMonths= function(m)
{
    var d = this.getDate();
    this.setMonth(this.getMonth() + m);

    if (this.getDate() < d)
        this.setDate(0);
};

Date.prototype.addYears = function(y)
{
    var m = this.getMonth();
    this.setFullYear(this.getFullYear() + y);

    if (m < this.getMonth()) 
     {
        this.setDate(0);
     }
};


/**********************************/ 
/** 登録チェック					 **/ 
/**********************************/ 
function torokuCheck() { 
	var tempMoji  = "";

	var keisai_kbn = "";
	 //掲載区分
	 //基本掲載
	if (rdKihon.checked ==true){
		keisai_kbn = "1";
	}
	//オプションのみ
	if (rdOption.checked ==true){
		keisai_kbn = "2";
	}
	//その他
	if (rdSonota.checked ==true){
		keisai_kbn = "3";
	}
	//掲載区分は掲載基本、オプションの場合																																					
	//申込会社、請求先、担当者、掲載会社１、掲載区分、掲載期間From、																																				
	//掲載期間To、種別、現場名																																				
	//上記項目を入力されてない場合、ｴﾗｰ：ＸＸＸは必須入力項目ですを表示																																				
	//if ((rdKihon.checked ==true) || (rdOption.checked ==true)){
		if (Trim(txtkaiin_no.value) ==""){
			//20120314nakamura↓メッセージ変更
			//alert("申込会員の会員番号を入力して下さい。");
			alert("申込会員は必須入力項目です。");
			//20120314nakamura↑
			txtkaiin_no.select();
			return false;
		}
		if ( Trim(cmbKaiinSeik.value) ==""){
			if (cmbKaiinSeik.length  == 1){
				alert("申込会員の表示ボタンを押してください。");
				txtkaiin_no.select();
				return false;
			}
			
			
			alert("請求先は必須入力項目です。");
			cmbKaiinSeik.focus();			
			return false;
		}
		if ( Trim(TantoSelect.value) ==""){
			//20120314nakamura↓メッセージ変更
			//alert("担当者を選択してください。");
			alert("担当者は必須入力項目です。");
			//20120314nakamura↑
			TantoSelect.focus();			
			return false;
		}
		if ( Trim(keisai_kaiin1_no.value) ==""){
			alert("掲載会社１は必須入力項目です。");
			keisai_kaiin1_no.select();			
			return false;
		}
		if (!rdKihon.checked && !rdOption.checked && !rdSonota.checked){
			alert("掲載区分は必須入力項目です。");
			rdKihon.focus();
			return false;
		}

		
		//2012.10.12 A.Fujimoto カレンダーに登録されていないと計上日を取得できない場合があるため、必須解除
		/*if (!kejyobi.style.display){
			if ( Trim(kejyobi.value) ==""){
				alert("計上日は必須入力項目です。");
				kejyobi.focus();
				return false;
			}
		}*/
		if ( Trim(keisaikikanF.value) ==""){
			alert("掲載期間FROMは必須入力項目です。");
			keisaikikanF.focus();
			return false;
		}
		if ( Trim(keisaikikanE.value) ==""){
			alert("掲載期間TOは必須入力項目です。");
			keisaikikanE.focus();			
			return false;
		}

		//2012.12.11 蔡吉
		//請求現場名：使用できない文字が含まれています
		tempMoji =Reqgenbanm.value;
		if(isExistForbiddenCode(tempMoji)){
			alert("請求現場名" + "：使用できない文字が含まれています");
			Reqgenbanm.focus();
			return false;
		}

		//2012.08.01 特急対応 掲載区分「その他」の時は現場情報を必須入力項目チェックからはずす R.Katsumata 
		if ((rdKihon.checked ==true) || (rdOption.checked ==true)){
			//2012.12.31 蔡吉 START
			/*if ((!rdSintiku.checked) && (!rdJyoken.checked)){
				alert("種別は必須入力項目です。");
				//20120316nakamura↓ラジオボタン位置・データ入れ替え
				//rdSintiku.focus();			
				rdJyoken.focus();			
				//20120316nakamura↑
				return false;
			}*/
			//2012.12.31 蔡吉 END

			//2012.12.11 蔡吉
			//請求現場名
			if ( Reqgenbanm.value.replace(/(^[\s\u3000]*)|([\s\u3000]*$)/g, "")==""){//去掉全角半角空格
				alert("請求現場名は必須入力項目です。");
				Reqgenbanm.focus();
				return false;
			}
			
			//2013.01.07 蔡吉
			//現場番号!=NULL or 種別 ==NULL時
			if(Trim(obj("GenbaNo").innerText) !="" || Trim(obj("rdSintiku").innerText) ==""){
				if(genba_Flg == "0"){
					alert("新規／検索登録ボタンor最新現場情報取得ボタンを押してください。");
					btnInsertOrSelect.focus();
					return false;
				}
			}
			//2012.08.01 特急対応 作業区分のデフォルトをNULLに変更のため必須入力項目に追加　A.Fujimoto
			if (!rdSinki.checked && !rdEnchyo.checked && !rdZaiKeisai.checked){
				alert("作業区分は必須入力項目です。");
				rdoSayokbn.focus();
				return false;
			}
			//2013.01.07 蔡吉
			//if ( Trim(genbanm.value) ==""){
			//	alert("現場名は必須入力項目です。");
			//	genbanm.focus();
			//	return false;
			//}
		}
		//2013.01.07 蔡吉↓
		//tempMoji =genbanm.value;
		//if(isExistForbiddenCode(tempMoji)){
		//alert("現場名" + "：使用できない文字が含まれています");
		//return false
		//}

		//if ( Trim(syozaichi.value) !=""){
		//tempMoji =syozaichi.value;
		//if(isExistForbiddenCode(tempMoji)){
		//alert("所在地名" + "：使用できない文字が含まれています");
		//return false
		//}
		//2013.01.07 蔡吉↑

		//}

	//}
	//関連チェック
	//元の掲載ステータスは0（商談開始）、商品選択ボタンは押したことがない場合																																					
	//ｴﾗｰ：商品選択を行って下さい																																				
	//を表示、処理中止																																				
	if (qryKeisaiInput[0].SHOHIN_NM==null && arySeiri.length==0){
		alert("商品選択ボタンを押してください。");
		shoHinSentaku.focus();
		return false;
	}
	
	//掲載期間Fromと掲載期間Toは同月ではない場合
	//	ｴﾗｰ：期間を跨いだ掲載期間は入力できません																							
	//	を表示、処理中止						
	var strKikanF=Trim(keisaikikanF.value);
	var strKikanE=Trim(keisaikikanE.value);
	if (strKikanF.substr(5,2) != strKikanE.substr(5,2)){
		alert("期間を跨いだ掲載期間は入力できません。");
		return false;
	}						
												
	//掲載期間From>掲載期間Toの場合																									
	//	ｴﾗｰ：掲載期間期間の入力が間違っています																							
	//	を表示、処理中止
	if (strKikanF > strKikanE ){
		alert("掲載期間の入力が間違っています。");
		return false;
	}	
	
	//2012.12.31 蔡吉 START
	//掲載区分＝オプション且つ作業区分は新規以外の場合																										
	//	ｴﾗｰ：掲載区分がオプションの場合、																								
	//	作業区分は新規以外設定出来ません																								
	//	を表示、処理中止									
	//if ((rdOption.checked ==true) && (rdSinki.checked !=true)){
	//	alert("作業区分は新規以外設定出来ません。");
	//	return false;
	//}
	
	//掲載区分＝オプション且つ上位表示＝なしの場合																									
	//	ｴﾗｰ：上位表示を設定して下さい																							
	//	を表示、処理中止		
	//2012.10.25　A.Fujimoto　商品CD『特集』を追加の為、制御解除
	//if ((rdOption.checked) && (Trim(cmbHyoji.value) !="2")){
		//20120314nakamura↓メッセージ変更
		//alert("上位表示に設定して下さい。");
	//	alert("上位表示を「あり」に設定して下さい。");
	//	//20120314nakamura↑
	//	cmbHyoji.focus();
	//	return false;
	//}

	//var strGenbaNo = genba_no.value;

	//その他手配時の現場番号チェック  2012.08.01 特急対応 A.Fujimto 
	//if (rdSonota.checked){
	//	if (strGenbaNo.length != 0){
	//		alert("掲載区分『その他』の場合は『現場番号』を登録できません");
	//		document.all.genba_no.focus();
	//		return false;
	//	}
	//}
	//if (strGenbaNo.length != 8 ){
	//	if (strGenbaNo.length != 0){
			//ｴﾗｰﾒｯｾｰｼﾞ表示
	//		alert("現場番号は８桁入力してください");
			//現場番号にフォーカスをセットする
	//		document.all.genba_no.focus();
	//		return false;
	//	}
	//}
	//画面.現場番号の数値チェック  2012.08.01 特急対応 A.Fujimto ADD 
	//if(isNaN(strGenbaNo)){
	//	alert("現場番号に数値以外は入力できません");
		//現場番号にフォーカスをセットする
		//document.all.genba_no.focus();
	//		return false;
	//}
	//2012.12.31 蔡吉 END
	
	//掲載区分、上位表示を変更した場合																																
	//	変数.掲載区分、変数.上位表示 それぞれ画面の設定と違う場合																														
	//			ｴﾗｰ：商品選択を行って下さい																												
	//			を表示、処理中止
	//掲載区分「基本掲載」
	if (rdKihon.checked){
		keisai_kbn = "1";
	}
	//掲載区分「オプションのみ」
	if (rdOption.checked){
		keisai_kbn = "2";		
	}
	//掲載区分「その他」
	if (rdSonota.checked){
		keisai_kbn = "3";
	}
	//2012.12.14 掲載区分を変更した場合	
	if (keisai_kbn != pKesaiKbn_Save){
		alert("商品選択を行って下さい。");
		shoHinSentaku.focus();
		return false;
	}
	//2012.12.14 上位表示を変更した場合	
	if (Trim(cmbHyoji.value)!=phyoji_Save){
		alert("商品選択を行って下さい。");
		shoHinSentaku.focus();
		return false;
	}

	//2012.12.14 特集を変更した場合	
	if (Trim(tokushu.value)!=ptokushu_Save){
		alert("商品選択を行って下さい。");
		shoHinSentaku.focus();
		return false;
	}
	
	
	//[変数.mode] = 2（修正）の場合				
	//	変数.ChuSiFlgSave <> 変数.ChuSiFlgの場合	
	// 掲載中止変更
	//			ｴﾗｰ：商品選択を行って下さい
	//			を表示、処理中止
	if (Chusi_Flg_Save!=Chusi_Flg && pstrMode=="2"){
		alert("商品選択ボタンを押してください。");
		shoHinSentaku.focus();
		return false;
	}

	return true;
}

/**********************************/ 
/** 商品ボタンチェック			 **/ 
/**********************************/ 
function syohinCheck() { 
	//掲載区分
	if ((rdKihon.checked ==true) || (rdOption.checked ==true) || (rdSonota.checked ==true)){
	}else{
		alert("掲載区分を選択してください。");
		rdKihon.focus();
		return false;
	}
	//2012.12.11 蔡吉
	//掲載区分=「オプションのみ」
	if(rdOption.checked == true){
		//上位表示、特集どちらかが選択されていること。
		if(Trim(cmbHyoji.value) !="2" && Trim(tokushu.value) !="2"){
			alert("上位表示または特集を設定して下さい");
			cmbHyoji.focus();
			return false;
		}
	}
	//
	//2012.10.25　A.Fujimoto　商品CD『特集』を追加の為、制御解除
	//if ((rdOption.checked) && (Trim(cmbHyoji.value) !="2")){
		//20120314nakamura↓メッセージ変更
		//alert("上位表示に設定して下さい。");
	//	alert("上位表示を「あり」に設定して下さい。");
		//20120314nakamura↑
	//	cmbHyoji.focus();
	//	return false;
	//}
	
	return true;
}


/**********************************/ 
/** 申込会員「検索」ボタン押下時 **/ 
/**********************************/ 
function onKaiinInitClick(kbn) { 
    var strUrl    = "/seasar/ajaxClt/atview/juchu/NHjuchu/popup/KaiinKesakuSub.html"; 
    // 画面窗口  
    var strOpt    = "dialogWidth:800px;dialogHeight:600px;center:yes ;edge:sunken ;status;no;"; 
    try{ 
    	if (kbn==1){
    		SeikyuKbn = '1';
    	}else{
    		SeikyuKbn = '0';
    	}
    
        //子画面表示  
        mainWnd = window.showModalDialog(strUrl, this, strOpt); 
        //申込会員 検索押下
        if (kbn==1){
	        txtkaiin_no.value               = KAI_NO;
			//蔡吉 2013.01.21 修正 START
			if(SYOUGO_HAN_RK !="　"){
				kaiin_name.innerHTML   = SYOUGO_HAN_RK;
			}else{
				kaiin_name.innerHTML   = "";
			}
	        //蔡吉 2013.01.21 修正 END
	        obj("tel_kaiin").innerText =  TEL_DAIHYO;
			obj("fax_kaiin").innerText =  FAX_DAIHYO;
			var GetDataKey = new Object();
			var Condition = new Object();
	    	Condition.kaiin_no =obj("txtkaiin_no").value;
	    	Condition.kbn ="1";
		    
			GetDataKey.Condition = Condition;
		    var ResultXml = postXmlHttp(EVENT_GET_KESAIINPUT_KAIIN,GetDataKey,"");
			var ViewResult= ResultXml.ViewResult;
			var ListResult= ResultXml.ListResult;
			
			qryKaiinSeikList = ListResult.KAIINSEIK;
	
			if (qryKaiinSeikList != null){
				setList("cmbKaiinSeik",qryKaiinSeikList.item,KAI_BLNO,true);
				qryKaiinSeikView=ViewResult.QRYKAIINSEIK
				qryKaiinSeikView = ToArray(qryKaiinSeikView.Row);
			}else{
				setList("cmbKaiinSeik",null,null,true);
			}
			obj("lblKaiinSeikSOUNM").innerText=SEIKYU_SOU_NM;
			obj("lblKaiinSeikNM").innerText=SEIKYU_NM;

	     }
		 //掲載会社１ 検索押下
	     if (kbn==2){
	        keisai_kaiin1_no.value               = KAI_NO;
	        keisai_kaiin1_name.innerHTML         = SYOUGO_HAN_RK;
	        obj("keisai_kaiin1_tel").innerText =  TEL_DAIHYO;
			obj("keisai_kaiin1_fax").innerText =  FAX_DAIHYO;
	     }
		 //掲載会社2 検索押下
	     if (kbn==3){
	        keisai_kaiin2_no.value             = KAI_NO;
	        keisai_kaiin2_name.innerHTML       = SYOUGO_HAN_RK;
	        obj("keisai_kaiin2_tel").innerText =  TEL_DAIHYO;
			obj("keisai_kaiin2_fax").innerText =  FAX_DAIHYO;
	     }
		 //掲載会社3 検索押下
	     if (kbn==4){
	        keisai_kaiin3_no.value             = KAI_NO;
	        keisai_kaiin3_name.innerHTML       = SYOUGO_HAN_RK;
	        obj("keisai_kaiin3_tel").innerText =  TEL_DAIHYO;
			obj("keisai_kaiin3_fax").innerText =  FAX_DAIHYO;
	     }
	     
    }catch(e){ 
    } 
}
/**********************************/ 
/** 申込会員変更時 				 **/ 
/**********************************/ 
function reflectKaiin() { 
	//画面.申込会員名称 = 空白																																	
	//画面.申込会員TEL = 空白																																	
	//画面.申込会員FAX = 空白																																	
	//画面.請求先名称 = 空白																																	
	//画面.請求書送付先名称 = 空白																																	
	//画面.請求先コンボボックス内容をクリア、「未選択」のみになる																																	

    obj("kaiin_name").innerText =  "";
	obj("tel_kaiin").innerText =  "";
	obj("fax_kaiin").innerText =  "";
	setList("cmbKaiinSeik",null,null,true);
	obj("lblKaiinSeikSOUNM").innerText="";
	obj("lblKaiinSeikNM").innerText="";
	
}
/**********************************/ 
/** 会員請求先変更時			 **/ 
/**********************************/ 
function KaiinSeikSel() { 
	if (obj("cmbKaiinSeik").selectedIndex!=0){																															
		obj("lblKaiinSeikSOUNM").innerText=qryKaiinSeikView[obj("cmbKaiinSeik").selectedIndex-1].SEIKYU_SOU_NM;
		obj("lblKaiinSeikNM").innerText=qryKaiinSeikView[obj("cmbKaiinSeik").selectedIndex-1].SEIKYU_NM;
	}else{
		obj("lblKaiinSeikSOUNM").innerText="";
		obj("lblKaiinSeikNM").innerText="";
	}
	
}

/**********************************/ 
/** 掲載期間Fromロストフォーカス **/ 
/**********************************/ 
function onKeisaiFromLostFoucs() {
	var KeisaikikanF_Flg;
	keisaikikanF_Flg =TrimToken(pKeisaikikanFSave1,"/");
	//2013.01.17 蔡吉
	if(keisaikikanF.readOnly==true){
		return;
	}
	if(TrimToken(keisaikikanF.value,"/") != TrimToken(pKeisaikikanFSave,"/")){
		genba_Flg="0";
	}
    var GetDataKey = new Object();
	var Condition = new Object();
	var qryKeisaiKeijyo="";
	if (!isDate(TrimToken(keisaikikanF.value,"/"))){
		return;
	}
	if (TrimToken(keisaikikanF.value, "/")==""){
		return;
	}
	
    Condition.KeisaiF =TrimToken(keisaikikanF.value, "/");
    
    
	GetDataKey.Condition = Condition;
    var ResultXml = postXmlHttp(EVENT_GET_KESAIINPUT_KEISAIF,GetDataKey,"");
	var ViewResult= ResultXml.ViewResult;
	if (ViewResult.KEISAI_T!=null && keisaikikanF_Flg != TrimToken(keisaikikanF.value,"/")){
		keisaikikanE.value=getDateFormat(ViewResult.KEISAI_T);
		pKeisaikikanFSave1 = keisaikikanF.value;
	}
	qryKeisaiKeijyo = ViewResult.KEISAIINPUTKEIJYO;
	
	if (FromGamen.value == "NewKanri"){
		// 新規の場合、計上日を常に更新
		//2012.10.12 A.Fujimoto カレンダーマスタから計上日の日付が取得できないときは""
		if(qryKeisaiKeijyo != null){
			qryKeisaiKeijyo = ToArray(qryKeisaiKeijyo.Row);
			//2013.01.17 蔡吉 
			if(!kejyobi.style.display){
				kejyobi.value=getDateFormat(Trim(qryKeisaiKeijyo[0].CAL_DATE));
			}else{
				obj("hidkejyobi").innerHTML=getDateFormat(Trim(qryKeisaiKeijyo[0].CAL_DATE));
			}	
		}else{
			alert("来年度のathomeカレンダーが登録されていないため\n計上日が空欄となります。\n確定後に情報システム部でセットいたしますので\n手配はこのまま続行してください。");
			//keisaikikanF.focus();
			kejyobi.value="";
			return false;
		}
	}else{
		if (qryKeisaiKeijyo != null && kejyobi.value==""){
			qryKeisaiKeijyo = ToArray(qryKeisaiKeijyo.Row);
			//2013.01.17 蔡吉
			if(!kejyobi.style.display){
				kejyobi.value=getDateFormat(Trim(qryKeisaiKeijyo[0].CAL_DATE));
			}else{
				obj("hidkejyobi").innerHTML=getDateFormat(Trim(qryKeisaiKeijyo[0].CAL_DATE));
			}
		}else{
			alert("来年度のathomeカレンダーが登録されていないため\n計上日が空欄となります。\n確定後に情報システム部でセットいたしますので\n手配はこのまま続行してください。");
			//keisaikikanF.focus();
			kejyobi.value="";
			return false;
		}
	}
}
/**********************************/ 
/** 掲載期間Toロストフォーカス **/ 
/**********************************/ 
function onKeisaiToLostFoucs() { 
    //掲載期間Fromと掲載期間Toは同月ではない場合																									
	//	ｴﾗｰ：期間を跨いだ掲載期間は入力できません																							
	//	を表示、処理中止
	if(TrimToken(keisaikikanE.value,"/") != TrimToken(pKeisaikikanESave,"/")){
		genba_Flg="0";
	}
	var strKikanF=Trim(keisaikikanF.value);
	var strKikanE=Trim(keisaikikanE.value);

	if (!isDate(TrimToken(strKikanE,"/")) || strKikanF==""){
		return;
	}
	if (strKikanF.substr(5,2) != strKikanE.substr(4,2)){
		alert("期間を跨いだ掲載期間は入力できません。");
		return;
	}						
												
	//掲載期間From>掲載期間Toの場合																									
	//	ｴﾗｰ：掲載期間期間の入力が間違っています																							
	//	を表示、処理中止
	if (TrimToken(strKikanF,"/") > strKikanE ){
		alert("掲載期間の入力が間違っています。");
		return;
	}			
	
	
}
/**************************/ 
/** カレンダー「検索」ボタン押下時 **/ 
/**************************/ 
function onCalendarClick(kbn) { 
	//計上日 選択押下
	if (kbn==1){
		 AreaCd = "001";  
		 dateKbn = "1";  
	}else{
		 AreaCd = strArea; 
		 dateKbn = "0";  
	}
	
	NowDay =strEigyoDate;  
	//NowDay = 20120101;  
	//AreaCd = "007";  
	//dateKbn = "0";  
    var strUrl    = "/seasar/ajaxClt/atview/juchu/NHjuchu/popup/ClendarSub.html";  
    // 画面窗口   
    var strOpt    = "dialogWidth:800px;dialogHeight:600px;center:yes ;edge:sunken ;status;no;";
    try{  
        //子画面表示   
        mainWnd = window.showModalDialog(strUrl, this, strOpt);  
        if (mainWnd == "toroku"){
			//計上日 選択押下
	        if (kbn==1){
	        	obj("kejyobi").value = getDateFormat(Trim(rtnDate));  
	        }
			//掲載期間FROM 選択押下
	        if (kbn==2){
	        	obj("keisaikikanF").value = getDateFormat(Trim(rtnDate));
	        	onKeisaiFromLostFoucs();
	        }
			//掲載期間TO 選択押下
	        if (kbn==3){
	        	obj("keisaikikanE").value = getDateFormat(Trim(rtnDate));  
	        }
	    }
    }catch(e){  
    }  
      
}
/**************************/ 
/** 商品選択ボタン押下時 **/ 
/**************************/ 
function onShohinSentakuClick(kbn) {
    if(!syohinCheck()){
		return;
	}
    //掲載区分
	if (rdKihon.checked ==true){
		pkeisai_kbn = "1";//掲載区分「基本掲載」
	}
	if (rdOption.checked ==true){
		pkeisai_kbn = "2";//掲載区分「オプションのみ」
	}
	if (rdSonota.checked ==true){
		pkeisai_kbn = "3";//掲載区分「その他」
	}
 	//引数　エリア　
	pArea = strArea;
	//引数　上位フラグ　1:なし　2:あり
	phyoji = Trim(cmbHyoji.value);
	//引数　特集　
	ptokushu = Trim(tokushu.value);
	//引数　掲載番号
	pkeisai_no =Trim(obj("KeisaiNo").innerText);
	//中止フラグ　0：通常　1:中止
	pchusi_flg =Chusi_Flg;
	//中止フラグ　0：通常　1:中止(保存上一状况)
	pchusi_Flg_Save1 = Chusi_Flg_Save1;
	//中止フラグ　0：通常　1:中止(初期状况)
	pchusi_Flg_Save2 = Chusi_Flg_Save2;

	var Gokei_Kingaku=0;
	var Gokei_Nebiki=0;
	var Gokei_Sashihiki=0;
	var Gokei_Shohizei=0;
	var SoGokei=0;

	var strUrl    = "/seasar/ajaxClt/atview/juchu/NHjuchu/popup/ShohinSelectSub.html";  
    // 画面窗口   
    var strOpt    = "dialogWidth:800px;dialogHeight:600px;center:yes ;edge:sunken ;status;no;";
    try{  
        //子画面表示   
        mainWnd = window.showModalDialog(strUrl, this, strOpt);
        if (mainWnd == "toroku"){
        	bShohinFromDb = false;  //画面の商品は商品選択画面で設定される
			pKesaiKbn_Save = pkeisai_kbn;
        	
	        strHtml = '<table border="1" cellspacing="1" cellpadding="0" class="sfont">';
			strHtml += '<tr align="center" class="juchuInpMeisai">';
			strHtml += '<td align="center" height="20"  width="200">';
			strHtml += '<input type="Button" id="shoHinSentaku" value="商品選択" onClick="onShohinSentakuClick()"></td>';
			strHtml += '<td width="40">数量</td>';
			strHtml += '<td width="70">本体金額</td>';
			strHtml += '<td width="65">値引額</td>';
			strHtml += '<td width="75">差引金額</td> </tr>';
			
			//alert(arySeiri.length);
			
			if (arySeiri.length!=0){
				Chusi_Flg_Save=pchusi_flg;
				Chusi_Flg_Save1=pchusi_flg;
				phyoji_Save=phyoji;
				ptokushu_Save = ptokushu;
				for(var count=0;count<arySeiri.length;count++){
					
					strHtml += '<tr>';
					//alert(arySeiri[count].SHOHIN_NM);
					//alert(arySeiri[count].SURYO);
					//alert(arySeiri[count].KINGAKU);
					//alert(arySeiri[count].NEBIKI);
					//alert(arySeiri[count].GOKEI);
					//商品名
					strHtml += '	<td>'+ToHtmlNull(arySeiri[count].SHOHIN_NM) +'</td>';
					//strHtml += '<td>&nbsp</td>';
					//数量 
					strHtml += '	<td align="right">' + ToHtmlNull(jpfMdfyComma(Trim(arySeiri[count].SURYO),0)) + '<br>';
					
					//本体金額 
					strHtml += '	<td align="right">' + ToHtmlNull(jpfMdfyComma(Trim(arySeiri[count].KINGAKU),0)) + '<br>';
					
					//値引額 
					strHtml += '	<td align="right">' + ToHtmlNull(jpfMdfyComma(Trim(arySeiri[count].NEBIKI),0)) + '<br>';
					
					//差引金額 
					strHtml += '	<td align="right">' + ToHtmlNull(jpfMdfyComma(Trim(arySeiri[count].GOKEI),0)) + '<br>';
					
					
					strHtml += '</tr>';
					
					Gokei_Kingaku=parseFloat(Gokei_Kingaku)+parseFloat(arySeiri[count].KINGAKU);
					Gokei_Nebiki=parseFloat(Gokei_Nebiki)+parseFloat(arySeiri[count].NEBIKI);
					Gokei_Sashihiki=parseFloat(Gokei_Sashihiki)+parseFloat(arySeiri[count].GOKEI);
					Gokei_Shohizei=parseFloat(Gokei_Shohizei)+parseFloat(arySeiri[count].SHOHIZEI);
					SoGokei=parseFloat(SoGokei)+parseFloat(arySeiri[count].ZEIKOMI);                                               
		
				}

				for(var jLoop=count;jLoop<10;jLoop++){
					strHtml += '<tr>';
					
					//商品名
					strHtml += '<td>&nbsp</td>';
					
					//数量 
					strHtml += '<td>&nbsp</td>';
					
					//本体金額 
					strHtml += '<td>&nbsp</td>';
					
					//値引額 
					strHtml += '<td>&nbsp</td>';
					
					//差引金額 
					strHtml += '<td>&nbsp</td>';
					
					
					strHtml += '</tr>';
				}
				strHtml += '<tr><td colspan="2" class="juchuInpMeisai" align="center">合計</td>';
				strHtml += '<td align="right" height="20">' + jpfMdfyComma(String(Gokei_Kingaku),0) +'</td>';
				strHtml += '<td align="right" >' + jpfMdfyComma(String(Gokei_Nebiki),0) +'</td>';
				strHtml += '<td align="right" >' + jpfMdfyComma(Gokei_Sashihiki,0) +'</td></tr>';
				
				strHtml += '<tr><td colspan="2" class="juchuInpMeisai" align="center" height="20">消費税額</td>';
				strHtml += '<td align="right" colspan="3">'+jpfMdfyComma(Gokei_Shohizei,0) +'</td></tr>';

				strHtml += '<tr><td colspan="2" class="juchuInpMeisai" align="center" height="20">総合計</td>';
				strHtml += '<td align="right" colspan="3">'+jpfMdfyComma(SoGokei,0) +'</td></tr>';
				
			
				strHtml += '</table>';
				obj("ShohinList").innerHTML = strHtml;
			}
	        
		}	 
    }catch(e){  
    }  
      
}

/**********************/
/**中止     　　       **/
/**更新日: 2012.12.11**/
/**更新者: 蔡吉      **/
/********************/
function onChusiClick(kbn){
	if (kbn=="1"){
		//確認：掲載番号XXXXXXXXのデータを
		//掲載中止します。宜しいですか？
		var strTemp="掲載番号"+pkeisai_no+"のデータを掲載中止します。宜しいですか？";
		var strRtn=confirm(strTemp);
		if (strRtn) {
			btnChusi.disabled = true;
			btnDrop.disabled = true;
			btnChusiCancel.disabled = false;
			btnDropCancel.disabled = true;
			obj("Chusi").innerText =  "掲載中止";
			Chusi_Flg="1";
		}
	}
	//掲載中止を取消
	if(kbn=="2"){
		var strTemp1="掲載番号"+pkeisai_no+"データを掲載中止を取消します。宜しいですか？";
		var strRtn1=confirm(strTemp1);
		if (strRtn1) {
			btnChusi.disabled = false;
			btnDrop.disabled = false;
			btnChusiCancel.disabled = true; 
			btnDropCancel.disabled = true;
			obj("Chusi").innerText =  "";
			Chusi_Flg="0";
		}
	}
	//2012.12.11 蔡吉 start
	//受注取消
	if (kbn=="3"){
		//確認：掲載番号XXXXXXXXのデータを
		//受注取消します。宜しいですか？
		var strTemp="掲載番号"+pkeisai_no+"のデータを受注取消します。宜しいですか？";
		var strRtn=confirm(strTemp);
		if (strRtn) {
			btnChusi.disabled = true;
			btnDrop.disabled = true;
			btnDropCancel.disabled = false;
			btnChusiCancel.disabled = true;
			obj("Chusi").innerText =  "受注取消";
			Drop_Flg = "1";
		}
	}
	//受注取消解除
	if(kbn=="4"){
		var strTemp1="掲載番号"+pkeisai_no+"データを受注取消解除します。宜しいですか？";
		var strRtn1=confirm(strTemp1);
		if (strRtn1) {
			btnChusi.disabled = false;
			btnDrop.disabled = false;
			btnChusiCancel.disabled = true; 
			btnDropCancel.disabled = true;
			obj("Chusi").innerText =  "";
			Drop_Flg = "0";
		}
	}
	//2012.12.11 蔡吉 end
}
/********************/
/**作業区分の制御  **/
/********************/
//2012.08.01 特急対応 A.Fujimto
//マスク時のクリア・その他手配時に種目をマスク
function onSagyoCtl(kbn){
	//2012.12.11 蔡吉 変更 start
	/*
	if (kbn=="1"){
		obj("rdSinki").disabled = false;
		obj("rdEnchyo").disabled = false;
		obj("rdZaiKeisai").disabled = false;

		obj("rdJyoken").disabled = false;
		obj("rdSintiku").disabled = false;


	}else if(kbn == "2"){
		// オプションのみの場合
		//rdSinki.checked =true;
		rdEnchyo.checked =false;
		rdZaiKeisai.checked =false;
		obj("rdEnchyo").disabled = true;
		obj("rdZaiKeisai").disabled = true;

		obj("rdJyoken").disabled = false;
		obj("rdSintiku").disabled = false;

		cmbHyoji.selectedIndex = 2;
		
	}else if(kbn == "3"){
		// その他のみの場合
		//rdSinki.checked =true;
		rdEnchyo.checked =false;
		rdZaiKeisai.checked =false;
		obj("rdEnchyo").disabled = true;
		obj("rdZaiKeisai").disabled = true;

		rdJyoken.checked =false;
		rdSintiku.checked =false;
		obj("rdJyoken").disabled = true;
		obj("rdSintiku").disabled = true;
	
	}*/
	//作業区分変更
	if(kbn != pKesaiKbn2_Save){
		genba_Flg = "0";
	}
	//掲載区分 = その他
	if(kbn=="3"){
		btnInsertOrSelect.disabled = true;
		btnGetMeg.disabled = true;
		rdSinki.checked = false;
		rdEnchyo.checked = false;
		rdZaiKeisai.checked = false;
		obj('rdSinki').disabled = true;
		obj('rdEnchyo').disabled = true;
		obj('rdZaiKeisai').disabled = true;
		document.getElementById('GenbaNo').innerHTML = '';
		document.getElementById('rdSintiku').innerHTML = '';
		document.getElementById('Genbanm').innerHTML = '';
		document.getElementById('syozai_cd3').innerHTML = '';
		document.getElementById('syozai_cd4').innerHTML = '';
		document.getElementById('lblSyozaiNm').innerHTML = '';
		document.getElementById('SyozaiNm1').innerHTML = '';
	}else{
		btnInsertOrSelect.disabled = false;
		if(obj("GenbaNo").innerText == ""){
			btnGetMeg.disabled = true;
		}else {
			btnGetMeg.disabled = false;
		}
		if(kbn=="2"){
			//掲載区分 = オプションのみ
			rdSinki.checked = true;
			obj('rdSinki').disabled = false;
			obj('rdEnchyo').disabled = true;
     		obj('rdZaiKeisai').disabled = true;
		}else{
			obj('rdSinki').disabled = false;
			obj('rdEnchyo').disabled = false;
			obj('rdZaiKeisai').disabled = false;
		}		
	}
	//2012.12.11 蔡吉 変更 end
	
}


/********************/
/** 掲載会社表示　　   **/
/********************/
function KaiinDisplayK(kbn){
	var GetDataKey = new Object();
	var Condition = new Object();
	Condition.kbn ="0";
	//申込会員押下
	if (kbn==1){
    	Condition.kaiin_no =obj("txtkaiin_no").value;
    	Condition.kbn ="1";
    	if (Trim(obj("txtkaiin_no").value) == ""){
    		alert("申込会員の会員番号を入力して下さい。");
    		txtkaiin_no.select();
    		return;
    	}
    }
	//掲載会社１押下
	if (kbn==2){
    	Condition.kaiin_no = obj("keisai_kaiin1_no").value;
    	if (Trim(obj("keisai_kaiin1_no").value) == ""){
    		alert("掲載会社１の会員番号を入力して下さい。");
    		keisai_kaiin1_no.select();
    		return;
    	}
    }
	//掲載会社2押下
    if (kbn==3){
    	Condition.kaiin_no =obj("keisai_kaiin2_no").value;
    	if (Trim(obj("keisai_kaiin2_no").value) == ""){
    		alert("掲載会社２の会員番号を入力して下さい。");
    		keisai_kaiin2_no.select();
    		return;
    	}
    }
	//掲載会社3押下
    if (kbn==4){
    	Condition.kaiin_no =obj("keisai_kaiin3_no").value;
    	if (Trim(obj("keisai_kaiin3_no").value) == ""){
    		alert("掲載会社３の会員番号を入力して下さい。");
    		keisai_kaiin3_no.select();
    		return;
    	}
    }
    
	GetDataKey.Condition = Condition;
    var ResultXml = postXmlHttp(EVENT_GET_KESAIINPUT_KAIIN,GetDataKey,"");
	var ViewResult= ResultXml.ViewResult;
	var ListResult= ResultXml.ListResult;
	sqlflg = ViewResult.SQLFLG;
	if(sqlflg != "OK"){
		//alert("入力された会員番号は存在しません。");
		//申込会員押下
		if (kbn==1){
			alert("申込会社を選択して下さい。");
			txtkaiin_no.select();
			return;
		}
		//掲載会社1押下
		if (kbn==2){
			obj("keisai_kaiin1_name").innerText="";
			obj("keisai_kaiin1_tel").innerText="";
			obj("keisai_kaiin1_fax").innerText="";
			keisai_kaiin1_no.select();
			alert("掲載会社１を選択して下さい。");
			return;
		}
		//掲載会社2押下
		if (kbn==3){
			obj("keisai_kaiin2_name").innerText="";
			obj("keisai_kaiin2_tel").innerText="";
			obj("keisai_kaiin2_fax").innerText="";
			keisai_kaiin2_no.select();
			alert("掲載会社2を選択して下さい。");
			return;
		}
		//掲載会社3押下
		if (kbn==4){
			obj("keisai_kaiin3_name").innerText="";
			obj("keisai_kaiin3_tel").innerText="";
			obj("keisai_kaiin3_fax").innerText="";
			keisai_kaiin3_no.select();
			alert("掲載会社3を選択して下さい。");
			return;
		}
	}else{
		var Kaiinlist = ViewResult.KAIINLIST.Row;
		//申込会員押下
		if (kbn==1){
			//蔡吉 2013.01.21 修正 START
			if(Kaiinlist.SYOUGO_HAN_RK !="　"){
				obj("kaiin_name").innerText=Kaiinlist.SYOUGO_HAN_RK;
			}else{
				obj("kaiin_name").innerText="";
			}
			//蔡吉 2013.01.21 修正 END
			obj("tel_kaiin").innerText=Kaiinlist.TEL_DAIHYO;
			obj("fax_kaiin").innerText=Kaiinlist.FAX_DAIHYO;
			qryKaiinSeikList = ListResult.KAIINSEIK;
	
			if (qryKaiinSeikList != null){
				setList("cmbKaiinSeik",qryKaiinSeikList.item,"",true);
				qryKaiinSeikView=ViewResult.QRYKAIINSEIK
				qryKaiinSeikView = ToArray(qryKaiinSeikView.Row);
				cmbKaiinSeik.selectedIndex = 1;    //Defaultは「00」の方を選択
				//蔡吉 2013.01.21 修正 START
				if(qryKaiinSeikView[obj("cmbKaiinSeik").selectedIndex-1].SEIKYU_SOU_NM !=null){
					obj("lblKaiinSeikSOUNM").innerText=qryKaiinSeikView[obj("cmbKaiinSeik").selectedIndex-1].SEIKYU_SOU_NM;
				}else{
					obj("lblKaiinSeikSOUNM").innerText="";
				}
				if(qryKaiinSeikView[obj("cmbKaiinSeik").selectedIndex-1].SEIKYU_NM !=null){
					obj("lblKaiinSeikNM").innerText=qryKaiinSeikView[obj("cmbKaiinSeik").selectedIndex-1].SEIKYU_NM;
				}else{
					obj("lblKaiinSeikNM").innerText="";
				}
				//蔡吉 2013.01.21 修正 END
			}else{
				setList("cmbKaiinSeik",null,null,true);
			}

		}
		//掲載会社1押下
		if (kbn==2){
			obj("keisai_kaiin1_name").innerText=Kaiinlist.SYOUGO_HAN_RK;
			obj("keisai_kaiin1_tel").innerText=Kaiinlist.TEL_DAIHYO;
			obj("keisai_kaiin1_fax").innerText=Kaiinlist.FAX_DAIHYO;
		}
		//掲載会社2押下
		if (kbn==3){
			obj("keisai_kaiin2_name").innerText=Kaiinlist.SYOUGO_HAN_RK;
			obj("keisai_kaiin2_tel").innerText=Kaiinlist.TEL_DAIHYO;
			obj("keisai_kaiin2_fax").innerText=Kaiinlist.FAX_DAIHYO;
		}
		//掲載会社3押下
		if (kbn==4){
			obj("keisai_kaiin3_name").innerText=Kaiinlist.SYOUGO_HAN_RK;
			obj("keisai_kaiin3_tel").innerText=Kaiinlist.TEL_DAIHYO;
			obj("keisai_kaiin3_fax").innerText=Kaiinlist.FAX_DAIHYO;
		}
	}
}


/************************************/
//登録処理
/************************************/
function subToroku(kbn){
	var ResultXml = "";
	var ViewResult = "";
	var strRet = "";
	var strMsg = "";
	var strItem = "";
	var tempMoji  = "";
	
	//event名 
	var eventName = "KeisaiInputToroku";
	/** 送信用オブジェクトの作成 **/
	var GetDataKey = new Object();
	var objListItem = new Object();
	//登録押下
	if(onKeisaiFromLostFoucs()==false){//余斌　2013/01/29  set計上日
		return;
	}
	if(Drop_Flg!=1){//受注取消 余斌　2013/01/22
		if (kbn==1){
			if(!torokuCheck()){
				return;
			}
		}else{
			//2012.12.11 蔡吉 START
			//禁止文字チェック 
			if ( Trim(Reqgenbanm.value) !=""){
				tempMoji =Reqgenbanm.value;
				if(isExistForbiddenCode(tempMoji)){
					alert("請求現場名" + "：使用できない文字が含まれています");
					obj("Reqgenbanm").focus();
					return;
				}
			}
			//禁止文字チェック 
			//if ( Trim(genbanm.value) !=""){
	 
			//	tempMoji =genbanm.value;
			//	if(isExistForbiddenCode(tempMoji)){
			//	alert("現場名" + "：使用できない文字が含まれています");
			//	return false
			//	}
			//}

			//if ( Trim(syozaichi.value) !=""){
			//	tempMoji =syozaichi.value;
			//	if(isExistForbiddenCode(tempMoji)){
			//	alert("所在地名" + "：使用できない文字が含まれています");
			//	return false
			//}
			//}
			//2012.12.11 蔡吉 END
		}

		if (TantoSelect.selectedIndex == 0){
			alert("担当者を選択してください。");
			TantoSelect.focus();
			return;
		}
	}
	//会員コード
	objListItem.KaiinNo = Trim(txtkaiin_no.value);
	//会員請求先
	objListItem.KaiinSeik = Trim(cmbKaiinSeik.value);
	//担当者
	objListItem.Tanto = Trim(TantoSelect.value);
	//掲載会社コード１，２，３
	objListItem.KeisaiKaiin1 = Trim(keisai_kaiin1_no.value);
	objListItem.KeisaiKaiin2 = Trim(keisai_kaiin2_no.value);
	objListItem.KeisaiKaiin3 = Trim(keisai_kaiin3_no.value);
	
	//掲載番号
	objListItem.KeisaiNo = Trim(obj("KeisaiNo").innerText);
	objListItem.KeisaiKbn = "";
	//掲載区分
	if (rdKihon.checked){
		objListItem.KeisaiKbn = "1";
	}
	if (rdOption.checked){
		objListItem.KeisaiKbn = "2";
	}
	if (rdSonota.checked){
		objListItem.KeisaiKbn = "3";
	}
	//計上日
	if(!kejyobi.style.display){
		objListItem.Kejyobi = TrimToken(kejyobi.value, "/");
	}else{
		objListItem.Kejyobi = TrimToken(obj("hidkejyobi").innerText, "/");
	}
	
	//掲載期間
	objListItem.keisaiKikanF = TrimToken(keisaikikanF.value, "/");
	objListItem.keisaiKikanE = TrimToken(keisaikikanE.value, "/");

	//作業区分
	objListItem.SagyoKbn = "";
	if (rdSinki.checked ==true){//作業区分「新規」
		objListItem.SagyoKbn = "1";
	}
	if (rdEnchyo.checked ==true){//作業区分「期間延長」
		objListItem.SagyoKbn = "2";
	}
	if (rdZaiKeisai.checked ==true){//作業区分「再掲載」
		objListItem.SagyoKbn = "3";
	}
	
	//請求現場名
	objListItem.Reqgenbanm = Trim(Reqgenbanm.value);//蔡吉 2012.01.05
	
	
	
	
	//種別
	//objListItem.Syobetu = "";
	//20120316nakamura↓ラジオボタン位置・データ入れ替え
	//if (rdSintiku.checked ==true){
	//	objListItem.Syobetu = "01";
	//}
	//if (rdJyoken.checked ==true){
	//	objListItem.Syobetu = "02";
	//}
	//if (rdJyoken.checked ==true){
	//	objListItem.Syobetu = "01";
	//}
	//if (rdSintiku.checked ==true){
		//objListItem.Syobetu = "02";
	//}
	//種別
	//蔡吉 2012.01.05
	if(Trim(obj("rdSintiku").innerText) == rdSintikuOne){
		objListItem.Syobetu = "01";
	}else if (Trim(obj("rdSintiku").innerText) == rdSintikuTwo){
		objListItem.Syobetu = "02";
	}else{
		objListItem.Syobetu = "";
	}
	
	//20120316nakamura↑
	//現場名
	objListItem.GenbaNm = Trim(obj("Genbanm").innerText);
	
	//所在地コード１、所在地コード２、所在地名1、所在地名2
	objListItem.SyozaiCd1 = Trim(obj("syozai_cd3").innerText);
	objListItem.SyozaiCd2= Trim(obj("syozai_cd4").innerText);
	objListItem.SyozaiNm1 = Trim(obj("lblSyozaiNm").innerText);
	objListItem.SyozaiNm2 = Trim(obj("SyozaiNm1").innerText);

	//上位表示
	objListItem.Hyoji = Trim(cmbHyoji.value);

	//特集
	objListItem.tokushu = Trim(tokushu.value);//2013.01.04 START

	//引数　エリア　
	objListItem.pArea = strArea;//2013.01.04 START
	
	//現場番号
	objListItem.GenbaNo = Trim(obj("GenbaNo").innerText);
	
	//中止フラグ
	objListItem.Chusi_Flg = Chusi_Flg;

	//受注取消フラグ
	objListItem.Drop_Flg = Drop_Flg;
	
	//仮登録、登録区分 1登録　2仮登録
	objListItem.Kari_Flg =kbn ;
	
	//元掲載ステータス
	objListItem.MotoStat =hidKeisaiStat.value ;
	
	//明細データ
	//alert(arySeiri.length);
	//alert(qryKeisaiInput.length);
	if (arySeiri.length!=0){
		objListItem.arySeiri =arySeiri;
	}else{
		objListItem.arySeiri =qryKeisaiInput;
	}
	GetDataKey.ListItem = objListItem;
	ResultXml = postXmlHttp(eventName,GetDataKey,"");
	ViewResult = ResultXml.ViewResult;
	strRet = ViewResult.RET;
	
	if (strRet == "NG"){
		strMsg = ViewResult.ERRMSG;
		strItem = ViewResult.ERRITEM;
		alert(strMsg);
		obj(strItem).focus();
		return;
	}
	
	onBack();
}

/************************************/
//掲載会社１の変更の場合
/************************************/
function onkeisai_kaiin1_no_Change(){
	obj("keisai_kaiin1_name").innerText =  "";
	obj("keisai_kaiin1_tel").innerText =  "";
	obj("keisai_kaiin1_fax").innerText =  "";
	if(obj("keisai_kaiin1_no").innerText != pKeisai_kaiin1Save){
		genba_Flg = "0";
	}
	
}

/************************************/
//掲載会社２の変更の場合
/************************************/
function onkeisai_kaiin2_no_Change(){
	obj("keisai_kaiin2_name").innerText =  "";
	obj("keisai_kaiin2_tel").innerText =  "";
	obj("keisai_kaiin2_fax").innerText =  "";
}

/************************************/
//掲載会社２の変更の場合
/************************************/
function onkeisai_kaiin3_no_Change(){
	obj("keisai_kaiin3_name").innerText =  "";
	obj("keisai_kaiin3_tel").innerText =  "";
	obj("keisai_kaiin3_fax").innerText =  "";
}

/************************************/
//所在地１の変更の場合
/************************************/
function onsyozai_cd1_Change(){
	obj("lblSyozaiNm").innerText = "";
}
	
/************************************/
//所在地２の変更の場合
/************************************/
function onsyozai_cd2_Change(){
	obj("lblSyozaiNm").innerText = "";
}

/************************************/
/** 進捗画面へ戻す時の条件を取得   **/
/************************************/
function getGamenCondition(){
	var strCondtion = "";
	// 遷移元画面を設定
	strCondtion += "FromGamen=" + FromGamen.value;
	
	if (FromGamen.value == "ScheduelConfirm"){
		//掲載ステータス
		strCondtion += "&lstSutetasu=" + lstSutetasu.value;
		//申込会員
		strCondtion += "&txtKaiin_No=" + txtKaiin_No.value;
		//申込会員名
		//strCondtion += "&txtKaiin_Nm=" + txtKaiin_Nm.value;//蔡吉 2013.01.17
		//掲載番号
		strCondtion += "&txtKeisai_No=" + txtKeisai_No.value;
		//部
		strCondtion += "&lstBu=" + lstBu.value;
		//現場番号
		strCondtion += "&txtGenba_No=" + txtGenba_No.value;
		//課
		strCondtion += "&lstKa=" + lstKa.value;
		//受注番号
		strCondtion += "&txtJuchu_No=" + txtJuchu_No.value;
		//担当者
		strCondtion += "&txtTantoCd=" + txtTantoCd.value;
		//掲載開始日（From）
		strCondtion += "&txtKeisai_from=" + txtKeisai_from.value;
		//掲載開始日（To）
		strCondtion += "&txtKeisai_to=" + txtKeisai_to.value;
		//物件種別
		strCondtion += "&txtBukenCd=" + txtBukenCd.value;
		//入稿日(From)
		strCondtion += "&txtNyukou_from=" + txtNyukou_from.value;
		//入稿日(To)
		strCondtion += "&txtNyukou_to=" + txtNyukou_to.value;
		//計上日(From)
		strCondtion += "&txtKeijyo_from=" + txtKeijyo_from.value;
		//計上日(To)
		strCondtion += "&txtKeijyo_to=" + txtKeijyo_to.value;
		//蔡吉 2013.01.17
		//掲載会社
		strCondtion += "&txtKaiin_No1=" + txtKaiin_No1.value;
		//掲載会社名
		//strCondtion += "&txtKaiin_Nm1=" + txtKaiin_Nm1.value;
	}
	if (FromGamen.value == "JuchuKanri"){
		//申込会員
		strCondtion += "&txtKaiin_No2=" + txtKaiin_No2.value;
		//現場名
		strCondtion += "&genba_nm=" + genba_nm.value;
		//担当者
		strCondtion += "&TantouSelect2=" + TantouSelect2.value;
		//登録日(From)
		strCondtion += "&torokuD_F=" + torokuD_F.value;
		//登録日(To)
		strCondtion += "&torokuD_E=" + torokuD_E.value;
		//掲載開始日(From)
		strCondtion += "&keisaiD_F=" + keisaiD_F.value;
		//掲載開始日(To)
		strCondtion += "&keisaiD_E=" + keisaiD_E.value;
		//掲載番号
		strCondtion += "&keisai_no=" + keisai_no.value;
		//現場番号
		strCondtion += "&genba_no=" + hgenba_no.value;
	}
	if (FromGamen.value == "NewKanri"){
		//担当者
		strCondtion += "&TantouSelect=" + TantouSelect.value;
	}
	if (FromGamen.value == "ItiranKanri"){
		//部
		strCondtion += "&lstBu=" + lstBu.value;
		//課
		strCondtion += "&lstKa=" + lstKa.value;
		//担当者
		strCondtion += "&lstTanto=" + lstTanto.value;
		//申込会員
		strCondtion += "&kaiin_no=" + kaiin_no.value;
		//掲載番号
		strCondtion += "&keisai_no=" + keisai_no.value;
		//蔡吉　　2012.12.10
		//受注取消フラグ
		strCondtion += "&lstDrop=" + lstDrop.value;
	}
	return strCondtion;

}

//20120314nakamura↓新築戸建会員名称にリンクを貼る
/***************************************/
//会員名称リンク：モックアップ画面にあった 
//パラメタ　１:詳細入力　２：修正入力 
/***************************************/
function KaiinSyokai(txtkaiin_no,TantoSelect){
	//申込会員
	var kaiinno = txtkaiin_no;
	var strLoginTanto = TantoSelect
	window.open("http://hornet.in.athome.co.jp/kikan_ap/HorNet2/home/atbb/IT_KaiinSearchF.cfm?TantoCd="+strLoginTanto+"&type=2&kcode="+kaiinno+"&TOGO=1","KaiinSyokai","width=1018,height=645,toolbar=yes directories=yes scrollbars=yes menubar=yes status=yes resizable=no left=0 right=0 top=0")  

}
//20120314nakamura↑
//余斌　2013/01/18 start
function document.onkeydown() { 
	if(window.event.keyCode==27){//ESC 
		window.event.keyCode=8;      
	}
	if (event.keyCode==8 && pstrMode=="3"){//后退键
		event.keyCode = 0;         
		event.cancelBubble = true;         
		return false;     
	}        
}//余斌　2013/01/18 end