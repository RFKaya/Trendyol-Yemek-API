const axios = require('axios');
const fs = require('fs');
const config = require('../config.json')

async function getReviews() {
    return await axios.get(`https://api.trendyol.com/mealgw/suppliers/${config.supplierid}/restaurants/${config.restaurantid}/reviews/filter`, {
        headers: {
            'Authorization': `Basic ${config.token}`
        },
        params: {
            'startDate': Date.now() - 1296000000 // 2 gün 172800000 - 15 gün 1296000000
        }
    }).then(function (response) {
        return response.data.content
    }).catch(error => console.log(error));
}

async function updateReviews(reviews) {
    fs.writeFileSync('data/trendyolReviews.json', JSON.stringify(reviews || await getReviews()));
    console.log("sa")
}

module.exports = async () => {

    const reviewsLocalFile = fs.readFileSync('data/trendyolReviews.json', 'utf8')
    const reviewsLocal = JSON.parse(reviewsLocalFile);

    const reviews = await getReviews()
    const newReviews = reviews.filter(review => !reviewsLocal.some(r => r.reviewId == review.reviewId))

    if (newReviews.length) {
        console.log("yeni değerlendirme var")
        console.log(newReviews.map(review => review.rating))

        for (let review of newReviews) {
            await axios.post(config.webhookURL, {
                content:
                    `Yeni Değerlendirme! (Trendyol Yemek)\n` +
                    `- Puan: ${"⭐".repeat(review.rating.average)}\n` +
                    `- Tarih: <t:${(review.createdDate / 1000).toFixed()}>\n` +
                    `- Yorum: ${review.comment}`,
            })
        }

        updateReviews(reviews);

    } else {
        console.log("yeni değerlendirme yok")
    }

}

module.exports.updateReviews = updateReviews