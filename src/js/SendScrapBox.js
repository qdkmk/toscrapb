import env from './env.js'

class SendSB {
  constructor(){
    this.submitButton = document.getElementById(env.SELECTOR_CREATE_BUTTON);
    this.inputProjectId = "";
    this.inputTitle = "";
    this.inputText = "";
    this.linkWordList = "";
    this.makeLinkButton = document.getElementById(env.MAKE_LINK);
    this.addLinkListButton = document.getElementById(env.ADD_LINK_LIST);
    this.addLinkListWordModalVisible = false;
  }
  addOnClick(){
    this.submitButton.addEventListener('click',()=> {
      this.SendScrapBox();
    });
    this.makeLinkButton.addEventListener('click',()=> {
      let text = document.getElementById(env.SELECTOR_INPUT_TEXT).value;
      let linkWordArray = document.getElementById(env.LINK_WORD_LIST).value.split(/\n/);
      document.getElementById(env.SELECTOR_INPUT_TEXT).value =  this.makeLink(text,linkWordArray);
      document.getElementById(env.DRAWER_CHECKBOX).checked = false;
    });
    this.addLinkListButton.addEventListener('click',()=> {
      this.addLinkListWordModalVisible = !this.addLinkListWordModalVisible;
      if(this.addLinkListWordModalVisible){
        document.getElementById(env.ADD_LINK_WORD_MODAL).style.display = "block";
        document.getElementById(env.MAKE_LINK).style.display = "none";
        document.getElementById(env.ADD_LINK_WORD_MODAL).style.opacity = 1;
        this.addLinkListButton.innerHTML = "入力完了";
      }else{
        document.getElementById(env.ADD_LINK_WORD_MODAL).style.display = "none";
        document.getElementById(env.MAKE_LINK).style.display = "block";
        document.getElementById(env.ADD_LINK_WORD_MODAL).style.opacity = 0;
        this.addLinkListButton.innerHTML = "自動リンク置換用の単語を登録";
      }
    });
  }

  setProjectId(projectId) {
    //localStrageに現在のprojectIdを保存
    if (!projectId) {
      return;
    }
    localStorage.setItem(env.LOCALSTORAGE_PROJECT_ID, projectId);
  }
  setlinkWordList(linkWordList) {
    //localStrageに現在のlinkWordList(自動リンク生成用の単語リスト)を保存
    if (!linkWordList) {
      return;
    }
    localStorage.setItem(env.LOCALSTORAGE_LILNK_WORD_LIST, linkWordList);
  }

  SendScrapBox(){
    //現在の入力内容でscrapboxのページを作成
    this.inputProjectId = document.getElementById(env.SELECTOR_INPUT_PROJECT_ID).value;
    this.inputTitle = document.getElementById(env.SELECTOR_INPUT_TITLE).value;
    this.inputText = document.getElementById(env.SELECTOR_INPUT_TEXT).value;
    this.linkWordList = document.getElementById(env.LINK_WORD_LIST).value;
      alert(`https://scrapbox.io/${this.inputProjectId}/${this.inputTitle}?body=${this.inputText}`);
      this.setProjectId(this.inputProjectId);
      this.setlinkWordList(this.linkWordList);
      open(
        `https://scrapbox.io/${this.inputProjectId}/${this.inputTitle}?body=${encodeURIComponent(this.inputText)}`
      );
  }
  makeLink(text,linkWordArray){
    //単語リストからscrapboxのリンクを自動生成する(linkWordArrayに含まれる単語リストをもとに、textを変換して返す)
    //文字数の少ない単語順にソート
    linkWordArray.sort((a,b)=>{
      return a.length - b.length;
    })
    linkWordArray.forEach((word)=>{
      console.log(word)
      if(word !== ""){
        text = text.replace(new RegExp(word,"g"),"[$&]");
      }
    });
    return text;
  }

}
export default new SendSB()
