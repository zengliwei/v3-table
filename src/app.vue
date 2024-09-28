<script setup>
import v3Table from './components/v3-table.vue'

let genderOpts = [
  {value: 'male', label: 'Male'},
  {value: 'female', label: 'Female'}
];

let filterTypes = {
  select: {
    props: {}
  }
};

let columns = [
  {type: 'checkbox'},
  {type: 'index'},
  {field: 'name', title: 'Name', width: 220, sort: true, expandable: true, fixed: 'left', filter: {type: 'text'}},
  {field: 'age', title: 'Age', width: 100, align: 'center', sort: true, filter: {type: 'text'}},
  {
    field: 'gender',
    title: 'Gender',
    width: 100,
    align: 'center',
    sort: true,
    filter: {type: 'select', opts: genderOpts}
  },
  {field: 'mobile', title: 'Mobile', width: 160, sort: true, filter: {type: 'text'}},
  {field: 'email', title: 'E-mail', width: 260, sort: true, filter: {type: 'text'}}
];

let data = [
  {
    "name": "Prof. Maida Schneider",
    "age": 48,
    "gender": "female",
    "mobile": "201-312-8053",
    "email": "leo10@durgan.com",
    "children": [
      {
        "name": "Meggie Prohaska IV",
        "age": 47,
        "gender": "female",
        "mobile": "(979) 752-8128",
        "email": "samson34@hotmail.com"
      }, {
        "name": "Chadd Beier",
        "age": 32,
        "gender": "male",
        "mobile": "505.956.9065",
        "email": "sabrina.spinka@mcglynn.info"
      }, {
        "name": "Mara Tremblay",
        "age": 29,
        "gender": "female",
        "mobile": "463-704-9074",
        "email": "sanford.kihn@morissette.com"
      }
    ]
  }, {
    "name": "Bianka Casper",
    "age": 33,
    "gender": "male",
    "mobile": "(520) 864-5278",
    "email": "erica97@braun.com"
  }, {
    "name": "Malachi Cummerata",
    "age": 63,
    "gender": "male",
    "mobile": "+1.989.962.7833",
    "email": "qwisozk@hotmail.com"
  }, {
    "name": "Amber Dickinson I",
    "age": 71,
    "gender": "male",
    "mobile": "985-371-4588",
    "email": "liam29@gmail.com"
  }, {
    "name": "Macy Russel",
    "age": 43,
    "gender": "male",
    "mobile": "(352) 549-5803",
    "email": "jcorwin@medhurst.net"
  }, {
    "name": "Ms. Beaulah Wehner III",
    "age": 48,
    "gender": "male",
    "mobile": "(907) 658-0874",
    "email": "janick.emard@adams.org"
  }, {
    "name": "Dr. Jazmyn Gibson",
    "age": 40,
    "gender": "male",
    "mobile": "336.787.5321",
    "email": "wmayert@yahoo.com"
  }, {
    "name": "Pearlie Gutmann",
    "age": 89,
    "gender": "female",
    "mobile": "737.433.5901",
    "email": "dfeil@yahoo.com"
  }, {
    "name": "Prof. Sadie Rutherford II",
    "age": 20,
    "gender": "male",
    "mobile": "1-404-782-0226",
    "email": "vernie16@gmail.com"
  }, {
    "name": "Holly Blick",
    "age": 41,
    "gender": "female",
    "mobile": "+1 (443) 866-8280",
    "email": "nickolas.connelly@hotmail.com"
  }, {
    "name": "Rossie Johnston",
    "age": 57,
    "gender": "female",
    "mobile": "(978) 837-2859",
    "email": "karlie29@ullrich.com"
  }, {
    "name": "Elinor Gleason",
    "age": 28,
    "gender": "female",
    "mobile": "608.927.3346",
    "email": "breana72@yahoo.com"
  }, {
    "name": "Dr. Freeman D'Amore IV",
    "age": 22,
    "gender": "male",
    "mobile": "657-336-9625",
    "email": "ahmed57@hotmail.com"
  }, {
    "name": "Robyn Ernser V",
    "age": 63,
    "gender": "male",
    "mobile": "520.904.8847",
    "email": "grice@hansen.org"
  }, {
    "name": "Abdul Jenkins IV",
    "age": 37,
    "gender": "female",
    "mobile": "+1-754-292-4430",
    "email": "darien22@yahoo.com"
  }, {
    "name": "Cornelius Kulas",
    "age": 48,
    "gender": "female",
    "mobile": "878-849-1498",
    "email": "jazmyne11@emmerich.com"
  }, {
    "name": "Mariah Jenkins",
    "age": 66,
    "gender": "female",
    "mobile": "938-886-3353",
    "email": "laurie.olson@kunde.info"
  }, {
    "name": "Katarina Ferry",
    "age": 42,
    "gender": "male",
    "mobile": "1-580-957-3676",
    "email": "orempel@cassin.com"
  }, {
    "name": "Dr. Hubert Runolfsdottir Jr.",
    "age": 99,
    "gender": "female",
    "mobile": "279-425-6501",
    "email": "jovanny.spinka@gerhold.com"
  }, {
    "name": "Miss Jazmin Wilkinson I",
    "age": 62,
    "gender": "female",
    "mobile": "+1-603-574-8793",
    "email": "vokeefe@yahoo.com"
  }, {
    "name": "Chad Hahn",
    "age": 48,
    "gender": "male",
    "mobile": "(401) 760-4652",
    "email": "davonte15@mills.com"
  }, {
    "name": "Ms. Mozell Haag III",
    "age": 64,
    "gender": "female",
    "mobile": "(910) 870-1617",
    "email": "viviane14@yahoo.com"
  }, {
    "name": "Mrs. Heather Berge",
    "age": 71,
    "gender": "female",
    "mobile": "(469) 897-1805",
    "email": "oschowalter@yahoo.com"
  }, {
    "name": "Ruby Stamm",
    "age": 76,
    "gender": "female",
    "mobile": "+1-380-388-3322",
    "email": "jerel.lang@barton.com"
  }, {
    "name": "Rollin O'Reilly",
    "age": 81,
    "gender": "male",
    "mobile": "951-962-1508",
    "email": "dean88@gmail.com"
  }, {
    "name": "Lexi Okuneva",
    "age": 28,
    "gender": "male",
    "mobile": "352-264-9681",
    "email": "kamren.graham@gmail.com"
  }, {
    "name": "Mabelle Homenick",
    "age": 89,
    "gender": "female",
    "mobile": "+1-615-345-8098",
    "email": "lstroman@heathcote.com"
  }, {
    "name": "Mrs. Rozella Funk",
    "age": 21,
    "gender": "female",
    "mobile": "1-845-396-4790",
    "email": "herman.savanah@schmidt.com"
  }, {
    "name": "Mr. Roberto Schultz",
    "age": 92,
    "gender": "female",
    "mobile": "+1-747-475-5970",
    "email": "leora.rowe@white.info"
  }, {
    "name": "Miss Martine Jakubowski",
    "age": 29,
    "gender": "male",
    "mobile": "+1 (212) 322-0644",
    "email": "hilbert94@gmail.com"
  }, {
    "name": "Prof. Charity Frami V",
    "age": 39,
    "gender": "female",
    "mobile": "531.810.2395",
    "email": "farrell.dwight@williamson.com"
  }, {
    "name": "Clemens Aufderhar I",
    "age": 43,
    "gender": "male",
    "mobile": "(423) 923-4829",
    "email": "macey32@langworth.com"
  }, {
    "name": "Agustin Jones",
    "age": 70,
    "gender": "male",
    "mobile": "341.782.5229",
    "email": "kip04@yahoo.com"
  }, {
    "name": "Bertha Hartmann",
    "age": 40,
    "gender": "female",
    "mobile": "+1 (682) 442-6946",
    "email": "joshuah.romaguera@yahoo.com"
  }, {
    "name": "Vallie Larson",
    "age": 46,
    "gender": "female",
    "mobile": "+1.228.454.1742",
    "email": "jamel86@hotmail.com"
  }, {
    "name": "Harold Cole",
    "age": 54,
    "gender": "male",
    "mobile": "308-876-9150",
    "email": "bbarton@johns.net"
  }, {
    "name": "Dr. Doyle Lesch",
    "age": 31,
    "gender": "male",
    "mobile": "+1 (678) 691-4765",
    "email": "harmon.damore@howe.net"
  }, {
    "name": "Prof. Karina Dibbert DVM",
    "age": 68,
    "gender": "male",
    "mobile": "+1.857.500.9133",
    "email": "dangelo19@oconnell.com"
  }, {
    "name": "Davonte Schaden V",
    "age": 41,
    "gender": "male",
    "mobile": "(708) 369-2385",
    "email": "lenore.hilpert@yahoo.com"
  }, {
    "name": "Sigrid Parisian",
    "age": 89,
    "gender": "female",
    "mobile": "805.485.0667",
    "email": "guido02@gmail.com"
  }, {
    "name": "Keara Smitham",
    "age": 94,
    "gender": "male",
    "mobile": "+1.651.643.4983",
    "email": "walker.maxie@hotmail.com"
  }, {
    "name": "Emmanuelle Ullrich",
    "age": 31,
    "gender": "female",
    "mobile": "256-357-9559",
    "email": "charity.hegmann@connelly.com"
  }, {
    "name": "Letitia Konopelski",
    "age": 74,
    "gender": "male",
    "mobile": "1-870-862-4755",
    "email": "aruecker@runolfsdottir.biz"
  }, {
    "name": "Dr. Maximilian Thompson I",
    "age": 29,
    "gender": "male",
    "mobile": "352.215.9172",
    "email": "fbauch@bartoletti.com"
  }, {
    "name": "Mrs. Destini Wuckert",
    "age": 26,
    "gender": "female",
    "mobile": "458-369-8136",
    "email": "gislason.harmony@yahoo.com"
  }, {
    "name": "Mr. Ron Hermann",
    "age": 51,
    "gender": "female",
    "mobile": "+17194401490",
    "email": "juliet14@harber.com"
  }, {"name": "Bart Schimmel", "age": 18, "gender": "male", "mobile": "+1.714.351.6117", "email": "zborer@hotmail.com"}
];
</script>

<template>
  <v3-table
      :columns="columns"
      :filter-types="filterTypes"
      :data="data"
      :page-size="20"
      height="calc(100vh - 10rem)"/>
</template>

<style scoped>
</style>
