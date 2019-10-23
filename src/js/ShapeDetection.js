import env from './env.js'
import GetApi from './GetApi.js'

class ShapeDetection {
  constructor() {
    this.startBtn = document.getElementById(env.VIDEO_START);
    this.video = document.getElementById(env.VIDEO_PLAYER);
    this.barcodeText = document.getElementById(env.BARCODE_TEXT);
    this.inputText = document.getElementById(env.SELECTOR_INPUT_TEXT);
    this.loadingGif = document.getElementById(env.LOADING);
    this.localStream = null;
    this.captureTimer = null;
    this.startOrStopButtonStatus = false;
    this.fps = 10;
    this.medias = {
      video: {
        width: 320,
        height: 240,
        facingMode: {
          exact: "environment"
        }
      },
      audio: false
    };
  }

  addOnClick() {
    this.startBtn.addEventListener('click', () => {
      this.startOrStopButton(this.startOrStopButtonStatus);
    });
  }
startOrStopButton(status){
  if(status){
    this.stopVideo();
  }else{
    this.startVideo();
  }

}

  startVideo() {
    this.video.style.display = "block";
    this.barcodeText.style.display = "block";
    document.getElementById('rawValue').innerHTML = "";
    navigator.mediaDevices.getUserMedia(this.medias).then(async(stream) => {
      this.video.srcObject = stream;
      this.localStream = stream;
      this.switchButtoncondition();
      if (window.BarcodeDetector) {
        let result;
        //正しいisbnを読み取れるまでスキャンし続ける
        while(true){
          result = await this.findIsbn();
          if(/\d{13}/.test(result)){
            this.callGetApi(result);
            break;
          }
        }
      } else {
        console.error('BarcodeDetection is not enable!');
      }
    }).catch((err) => {
      console.log(err);
    });
  }

  findIsbn() {
    return new Promise((resolve, reject) => {
      const detector = new BarcodeDetector();
      detector.formats = "ean_13"

      this.captureTimer = setInterval(() => {
        detector.detect(this.video).then((barcodes) => {
          let barcode = null;
          barcodes.some((barcode) => {
            console.log(barcode.rawValue);
            if (this.isValidISBN13(barcode.rawValue)) {
              this.stopVideo();
              return resolve(barcode.rawValue);
            }else{
              console.log("not isbn")
            }
          });
        }).catch((err) => {
          console.log(err);
        });
      }, 1000 / this.fps);
    })
  }
  //Google Books APIの呼び出し
  callGetApi(code) {
    this.loadingGif.style.display = "block";
    GetApi.getgapi(code).then((text) => {
        this.inputText.value += text;
        this.loadingGif.style.display = "none";
        alert("書籍情報を自動入力しました")
      })
      .catch((err) => {
        console.log(err)
        this.loadingGif.style.display = "none";
        alert("書籍情報の取得に失敗しました\n" + err)
      })
  }


  switchButtoncondition(){
    this.startOrStopButtonStatus = !this.startOrStopButtonStatus;
    if(this.startOrStopButtonStatus){
      this.startBtn.innerHTML = "Stop";
    }else{
      this.startBtn.innerHTML = "バーコードから書籍情報を取得";
    }
  }


  stopVideo() {
    this.video.style.display = "none";
    this.barcodeText.style.display = "none";
    clearInterval(this.captureTimer);
    this.localStream.getTracks().forEach((track) => {
      track.stop();
    });
    this.localStream = null;
    this.video.srcObject = null;
    this.switchButtoncondition();
  };

//isbnが9784からはじまることの確認（日本の書籍）とチェックデジットの検算
  isValidISBN13(code) {
    if (!code) return false;
    if (13 != code.length) return false;
    if(Number(code.charAt(0)) !== 9) return false;
    if(Number(code.charAt(1)) !== 7) return false;
    if(Number(code.charAt(2)) !== 8) return false;
    if(Number(code.charAt(3)) !== 4) return false;
    var sum = 0;
    for (var i = 0; i < code.length; i++) {
      var num = Number(code.charAt(i));

      if (0 == (i % 2)) {
        sum += num;
      } else {
        sum += (num * 3);
      }
    }
    return (0 == (sum % 10));
  }

}

export default new ShapeDetection()
