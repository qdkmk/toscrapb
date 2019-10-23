import env from './env.js'

class ShareTarget {
  constructor() {
    //前回のプロジェクトIDと自動リンク反映用のテキストをlocalStorageから取得
    this.lastProjectId = localStorage.getItem(env.LOCALSTORAGE_PROJECT_ID);
    this.lastLinkWordList = localStorage.getItem(env.LOCALSTORAGE_LILNK_WORD_LIST);
    //他のアプリからの共有で遷移してきた場合、queryを取得
    const parsedUrl = new URL(location);
    this.queries = parsedUrl.searchParams;

    this.$inputProjectId = document.getElementById(env.SELECTOR_INPUT_PROJECT_ID);
    this.linkWordList = document.getElementById(env.LINK_WORD_LIST);
    this.$inputTitle = document.getElementById(env.SELECTOR_INPUT_TITLE);
    this.$inputText = document.getElementById(env.SELECTOR_INPUT_TEXT);
  }

  setInputValue() {
    //起動時、前回のプロジェクトIDと自動リンク反映用のテキストをセット
    this.$inputProjectId.value = this.lastProjectId;
    this.linkWordList.value = this.lastLinkWordList;
    //他のアプリからの共有で遷移して起動した場合、queryからtitle,textをセット
    this.$inputTitle.value = this.queries.get('title');
    this.$inputText.value = this.convertScrapBoxLink(this.queries.get('text'));
  }

  convertScrapBoxLink(str) {
    //http://...をscrapboxのリンク仕様[]に変換
    if(typeof str !== "string") return "";
    const regexpUrl =
      /((h?)(ttps?:\/\/[a-zA-Z0-9.\-_@:/~?%&;=+#',()*!]+))/g;
    const regexpLink = (all, url, h, href) => {
      return '[' + all + ']';
    }
    return str.replace(regexpUrl, regexpLink);
  };
}

export default new ShareTarget()
