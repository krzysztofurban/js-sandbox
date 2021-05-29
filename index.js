const fetch = require('node-fetch');

async function getCountriesResponse(keyword, page = 1) {
    console.log(`Sending request with params keyword: ${keyword} page: ${page}`);

    const jsonResponse = await fetch(`https://jsonmock.hackerrank.com/api/countries/search?name=${keyword}&page=${page}`)
        .then(response => {
            console.log("Request passed");
            return response.json()
        })
        .catch(err => console.error(`Error ${err}`));

    return jsonResponse;
}

function countCountriesWithPopulationGreaterThan(value, jsonData) {
    return jsonData.data
        .filter(country => country.population > value)
        .length;
}

async function resolveCountingPromises(promises, borderValue) {
    console.log(`Started resolving ${promises.length} promises `)
    const result = await Promise.all(promises)
        .then(promiseArray => {
            return promiseArray.map(jsonResponse => {
                return countCountriesWithPopulationGreaterThan(borderValue, jsonResponse);
            }).reduce((prev, curr) => {
                return prev + curr;
            }, 0);
        })
        .catch(err => console.error(err));

    return result;
}

async function getPopulation(borderValue, keyword) {
    const result = await getCountriesResponse(keyword, null)
        .then(jsonResponse => {
            const totalPages = jsonResponse.total_pages;
            console.log(`Total pages ${totalPages}`);

            if (totalPages === 1) {
                return countCountriesWithPopulationGreaterThan(borderValue, jsonResponse);
            } else {
                const firstPageResult = countCountriesWithPopulationGreaterThan(borderValue, jsonResponse);

                let promises = [];
                for (let nextPage = 2; nextPage <= jsonResponse.total_pages; nextPage++) {
                    promises.push(getCountriesResponse(keyword, nextPage));
                }

                return resolveCountingPromises(promises, borderValue).then(result => result + firstPageResult);
            }
        })
        .catch(err => {
            console.error(err);
        });

    return result;
};

getPopulation(2, 's').then(result => {
    console.warn(result);
});