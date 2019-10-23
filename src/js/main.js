import ShareTarget from './ShareTarget.js'
import SendSB from './SendScrapBox.js'
import ShapeDetection from './ShapeDetection.js'

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js').then(function() {
    console.log('サービスワーカーの登録成功');
  }).catch(function(err) {
    console.log('サービスワーカーの登録ができませんでした：', err);
  });
}
ShareTarget.setInputValue();
SendSB.addOnClick();
ShapeDetection.addOnClick();
