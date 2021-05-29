import fetch from 'node-fetch';

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

async function resolveCountingPromises(promises, limit) {
    return await Promise.all(promises)
        .then(promiseArray => {
            return promiseArray.map(jsonResponse => {
                return countCountriesWithPopulationGreaterThan(limit, jsonResponse);
            }).reduce((prev, curr) => {
                return prev + curr;
            }, 0);
        })
        .catch(err => console.error(err));
}

async function getPopulation(limit, keyword) {
    return await getCountriesResponse(keyword, null)
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
};

const errorMsg = (result, expected) => `Invalid result should be ${expected} but is ${result}`;

const testData = [
    { limit: 1337321, keyword: "p", expected: 24 },
    { limit: 2, keyword: "s", expected: 103 },
    { limit: 2, keyword: "po", expected: 4 },
    { limit: 2, keyword: "po", expected: 4 }
];

function test(testData) {
    testData.forEach(test => {
        getPopulation(test.limit, test.keyword).then(result => {
            console.log(`(${test.limit}, ${test.keyword}) - ${result}`); //24
            console.assert(result === test.expected, errorMsg(result, test.expected));
        });
    });
}


test(testData);