const fs = require("fs");

(async function () {

  //data klasörü var mı?
  const dataDirectory = './data'
  if (!fs.existsSync(dataDirectory)) {
    fs.mkdirSync(dataDirectory)
    console.log("data klasörü bulunamadığı için oluşturuldu.")
  }

  //trendyolReviews.json var mı?
  if (!fs.existsSync(dataDirectory + '/trendyolReviews.json')) {
    await require('./trendyol/getReviews.js').updateReviews()
    console.log("trendyolReviews.json bulunamadığı için oluşturuldu.")
  }

  //3 saniyede bi yorumları yokla
  setInterval(function () {
    console.log(`[${new Date().toLocaleString('tr-TR')}] yorumlar kontrol ediliyor...`)
    require('./trendyol/getReviews.js')()
  }, 3000);

})();