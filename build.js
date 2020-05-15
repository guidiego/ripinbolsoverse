const Handlebars = require("handlebars");
const data = require('./data.json');
const fs = require('fs');
const moment = require('moment');
const _ = require('lodash');


const hbsFile = fs.readFileSync('./index.hbs')
const template = Handlebars.compile(hbsFile.toString());

const initialDate = moment(data.govInitialDate);
const people = data.people.map(({ out, name, owner }, idx) => {
    const outDate = moment(out);
    const isLast = idx == data.people.length - 1;

    return {
        idx,
        name,
        owner,
        liveDays: outDate.diff(initialDate, 'days'),
        outDate: outDate.format('DD/MM/YYYY'),
        isLast,
    }
}).sort((a, b) => b.idx - a.idx);

fs.writeFileSync('./index.html', template({ people }));