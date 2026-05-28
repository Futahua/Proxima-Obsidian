const fs = require('fs');
const file = 'c:/Users/admin/Dropbox/Apps/remotely-save/Croptop/.obsidian/plugins/proxima/data.json';
let data = JSON.parse(fs.readFileSync(file, 'utf8'));

if (!data.projectSchemas) data.projectSchemas = {};
if (!data.projectVisibleProps) data.projectVisibleProps = {};

const dysonSchema = [
  {
    "id": "faction",
    "name": "Assigned Faction",
    "type": "select",
    "options": [
      { "id": "solar", "name": "Solar Ascendancy", "color": "#fdcb6e" },
      { "id": "martian", "name": "Martian Conglomerate", "color": "#e84393" },
      { "id": "jovian", "name": "Jovian Federation", "color": "#0984e3" }
    ]
  },
  {
    "id": "dependencies",
    "name": "Dependencies",
    "type": "relation"
  },
  {
    "id": "base_cost",
    "name": "Base Cost (EJ)",
    "type": "number"
  },
  {
    "id": "dep_cost_rollup",
    "name": "Dependency Cost",
    "type": "rollup",
    "relationProperty": "dependencies",
    "targetProperty": "base_cost",
    "aggregation": "sum"
  },
  {
    "id": "total_cost",
    "name": "Total Cost Output",
    "type": "formula",
    "expression": "prop('Base Cost (EJ)') + prop('Dependency Cost') * 1.5"
  }
];

data.projectSchemas['dyson-sphere'] = dysonSchema;
data.projectVisibleProps['dyson-sphere'] = dysonSchema.map(s => s.id);

fs.writeFileSync(file, JSON.stringify(data, null, 2));
console.log("Restored Dyson Sphere properties to data.json");
