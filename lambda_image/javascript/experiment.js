var myHeaders = new Headers();
myHeaders.append("Content-Type", "text/plain");

var raw = "{\r\n    \"word\": \"Sunderland\",\r\n    \"based_on\": \"toc\",\r\n    \"route\": \"Skilled Worker\"\r\n}";

var requestOptions = {
  method: 'POST',
  headers: myHeaders,
  body: raw,
  redirect: 'follow'
};

fetch("https://hvpfqi4bob.execute-api.eu-west-2.amazonaws.com/sponsorship-checker", requestOptions)
  .then(response => response.text())
  .then(result => console.log(result))
  .then(result => {
    var output = result;
    console.log(output); 
})
  .catch(error => console.log('error', error));
