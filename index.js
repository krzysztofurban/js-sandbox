const fetch = require('node-fetch');

async function getCountriesResponse(keyword, page = 1) {
    // console.debug(`Sending request with params keyword: ${keyword} page: ${page}`);

    const jsonResponse = await fetch(`https://jsonmock.hackerrank.com/api/countries/search?name=${keyword}&page=${page}`)
        .then(response => {
            // console.debug("Request passed");
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

async function resolveCountingPromises(promises, liimt) {
    const result = await Promise.all(promises)
        .then(promiseArray => {
            return promiseArray.map(jsonResponse => {
                return countCountriesWithPopulationGreaterThan(liimt, jsonResponse);
            }).reduce((prev, curr) => {
                return prev + curr;
            }, 0);
        })
        .catch(err => console.error(err));

    return result;
}

async function getPopulation(limit, keyword) {
    const result = await getCountriesResponse(keyword, null)
        .then(jsonResponse => {
            const totalPages = jsonResponse.total_pages;

            if (totalPages === 1) {
                return countCountriesWithPopulationGreaterThan(limit, jsonResponse);
            } else {
                const firstPageResult = countCountriesWithPopulationGreaterThan(limit, jsonResponse);

                let promises = [];
                for (let nextPage = 2; nextPage <= jsonResponse.total_pages; nextPage++) {
                    promises.push(getCountriesResponse(keyword, nextPage));
                }

                return resolveCountingPromises(promises, limit).then(result => result + firstPageResult);
            }
        })
        .catch(err => {
            console.error(err);
        });
    
    return result;
};

getPopulation(2, 's').then(result => {
    console.log(`(2,s) - ${result}`); // 103
});

getPopulation(2, 'po').then(result => {
    console.log(`(2,po) - ${result}`); //4
});

getPopulation(1337321, 'p').then(result => {
    console.log(`(1337321,p) - ${result}`); //24
});
