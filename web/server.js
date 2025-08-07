const express = require('express');
const app = express();
const path = require('path');
const port = 3000; // Możesz użyć innego portu, który jest wolny w Twojej sieci
const host = 'xxxx'; // Zastąp xxxxx Twoim lokalnym adresem IP

app.use(express.static(path.join(__dirname)));

app.listen(port, host, () => {
  console.log(`Server running at http://${host}:${port}`);
});

