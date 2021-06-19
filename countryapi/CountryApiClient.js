import fetch from 'node-fetch';
import fs from 'fs';

export class CountryApiClient {
    constructor() {
        this.baseUri = 'https://jsonmock.hackerrank.com';
        this.page;
        this.keyword;
    }

    async getCountriesResponse(keyword, page = 1) {
        // console.debug(`Sending request with params keyword: ${keyword} page: ${page}`);

        const jsonResponse = await fetch(`${this.baseUri}/api/countries/search?name=${keyword}&page=${page}`)
            .then(response => {
                // console.debug("Request passed");
                return response.json()
            })
            .catch(err => console.error(`Error ${err}`));

        return jsonResponse;
    }

    execute() {
        return this.getCountriesResponse(this.keyword, this.page);
    }

    page(page) {
        this.page = page;
        return this;
    }

    keyword(keyword) {
        this.keyword = keyword;
        return this;
    }

    static builder() {
        return new CountryApiClient();
    }
}

function toJsonFile(content) {
    fs.writeFile('user.json', JSON.stringify(content), (e) => console.log(e))
    console.log("file saved");
}

function main() {
    CountryApiClient.builder()
        .page(1)
        .keyword('p')
        .execute()
        .then(result => {
            toJsonFile(result);
        })
        .catch(err => console.error(err));
}

main();
