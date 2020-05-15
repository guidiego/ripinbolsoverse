const Handlebars = require("handlebars");
const data = require('./data.json');
const fs = require('fs');
const moment = require('moment');
const _ = require('lodash');

Handlebars.registerHelper('baseUrl', function (path) {
    return (process.env.BASE_URL || '') + path;
})

Handlebars.registerHelper('assetUrl', function (path) {
    return (process.env.BASE_URL || '') + '/assets' + path;
})

const hbsFile = fs.readFileSync('./index.hbs')
const template = Handlebars.compile(hbsFile.toString());

const initialDate = moment(data.govInitialDate);
const people = data.people.map(({ out, name, owner, start }, idx) => {
    const outDate = moment(out);

    return {
        idx,
        name,
        owner,
        liveDays: outDate.diff(start || initialDate, 'days'),
        outDate: outDate.format('DD/MM/YYYY'),
    }
});

const mostTimeOnGov = _.maxBy(people, 'liveDays').idx
const lessTimeOnGov = _.minBy(people, 'liveDays').idx

people[mostTimeOnGov].mostDays = true;
people[lessTimeOnGov].lessDays = true;

fs.writeFileSync('./index.html', template({
    people: people.sort((a, b) => b.idx - a.idx)
}));