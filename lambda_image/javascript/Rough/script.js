function displayInput() {
	var word = document.getElementById("word").value;
	var based_on = document.getElementById("based_on").value;
	var route = document.getElementById("route").value;

	var myHeaders = new Headers();
	myHeaders.append("Content-Type", "text/plain");

	var raw = JSON.stringify({
	    "word": word,
	    "based_on": based_on,
	    "route": route
	});

	var requestOptions = {
	  method: 'POST',
	  headers: myHeaders,
	  body: raw,
	  redirect: 'follow'
	};

	fetch("https://hvpfqi4bob.execute-api.eu-west-2.amazonaws.com/sponsorship-checker", requestOptions)
	.then(response => response.text())
	.then(result => {
		var output = "Word: " + word + "<br>Based on: " + based_on + "<br>Route: " + route + "<br><br>Response:<br>" + result;
		var processedJsonString = result.replace(/NaN/g, 'null');
		var parsedJson = JSON.parse(processedJsonString);
		var data = parsedJson.output_table;

		var lastUpdated = parsedJson.last_updated;

		var lastUpdate = document.getElementById("last_update");

		lastUpdate.innerHTML = "Last Updated: " + lastUpdated;

		var table = document.getElementById("myTable");
		table.innerHTML = ""; // clear the old table
		for (var i = 0; i < data.length; i++) {
			var row = `<tr>
				<td>${data[i]["Organisation Name"]}</td>
				<td>${data[i]["Town/City"]}</td>
				<td>${data[i]["County"]}</td>
				<td>${data[i]["Type & Rating"]}</td>
				<td>${data[i]["Route"]}</td>
				</tr>`
			table.innerHTML += row;
		}
		
	})
	.catch(error => console.log('error', error));

}
