# reStructuredText Simple Table

Generate reStructuredText simple tables.

```bash
npm install rest-simple-table
```

```javascript
var RST = require('rest-simple-table');

return new RST({
  head: ['Name', 'Role'],
  body: [
    ['Elliot Mitchum', 'Website Developer'],
    ['Duarte Garin', 'Technical Director']
  ]
}).draw();
```