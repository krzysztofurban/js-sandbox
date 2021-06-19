import fetch from 'node-fetch';

// As filtering by name doesn't work i will iterate over all pages. And get first match
async function getResponse(url) {
    const jsonResponse = await fetch(url)
        .then(response => response.json())
        .catch(err => console.error(`Error ${err}`));

    return jsonResponse;
}

async function getPlanetName(planetUrl) {
    const planetName = await getResponse(planetUrl)
        .then(jsonResponse => {
            return jsonResponse.name;
        })
        .catch(err => console.error(`Error ${err}`));

    return planetName;
}

function findFirstByName(jsonResponse, name) {
    return jsonResponse.results.filter(p => p.name === name)[0];
}

async function findPersonInformation(name, startPage) {
    console.log(startPage);
    let personInfo = await getResponse(`https://swapi.dev/api/people/?page=${startPage}`)
        .then(jsonResponse => {
            let person = findFirstByName(jsonResponse, name);

            if (person === undefined) {
                let nextPage = jsonResponse.next.split("page=")[1];
                return findPersonInformation(name, nextPage);
            } else {
                return person;
            }
        })
        .catch(err => console.error(`Error ${err}`));

    return personInfo;
}

async function getPlanetByName(name) {
    const person = await findPersonInformation(name, 1)
        .then(person => person)
        .catch(err => console.error(`Error ${err}`));

    // TODO: Not working properly, doesn't wait for previous results
    const planetName = await getPlanetName(person.homeworld)
        .then(planetName => planetName)
        .catch(err => console.error(`Error ${err}`));

    return {
        name: person.name,
        planet: planetName
    }
}

const errorMsg = (result, expected) => `Invalid result should be ${expected} but is ${result}`;

const testData = [
    { name: "Luke Skywalker", expectedPlanet: "Tatooine" },
    { name: "Beru Whitesun lars", expectedPlanet: "Tatooine" },
    { name: "Finis Valorum", expectedPlanet: "Coruscant" }
];

function testPlanetNameFetch(testData) {
    testData.forEach(test => {
        getPlanetByName(test.name)
            .then(personInfo => {
                console.assert(personInfo.planet === test.expectedPlanet, errorMsg(personInfo.planet, test.expectedPlanet));
                console.log(`OK: ${JSON.stringify(personInfo)}`);
            })
            .catch(err => console.error(`Error ${err}`));
    });
}

testPlanetNameFetch(testData);