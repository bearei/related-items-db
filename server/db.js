var config = require('../knexfile.js');
var env = process.env.NODE_ENV || 'development';
var knex = require('knex')(config[env]);

const fetchChartFromDB = () => {
    return knex('sizes')
        .where({})
        .then(chart => {
            return chart;
        });
};

const postPAV = (details) => {
    return knex('pavs')
        .insert({
            link_to_image: details.link_to_image,
            star_rating: details.star_rating,
            review_count: details.review_count,
            short_description: details.short_description,
            price: details.price,
            product_id: details.product_id 
        });
};

const deletePAV = (id) => {
    return knex('pavs')
        .where({id: id})
        .del();
}

const updatePAV = (id, newDets) => {
    return knex('pavs')
        .where({id: id})
        .update({
            price: newDets.price,
            product_id: newDets.product_id
        });
}

const fetchFourRandomPAVsFromDB = (id) => {
    return knex('pavs')
        .where({product_id: id})
        .limit(4)
        .then(pavs => {
            return pavs;
        })
};

module.exports.deletePAV = deletePAV;
module.exports.updatePAV = updatePAV;
module.exports.postPAV = postPAV;
module.exports.fetchChartFromDB = fetchChartFromDB;
module.exports.fetchFourRandomPAVsFromDB = fetchFourRandomPAVsFromDB;