var cheerio = require('cheerio');
var request = require('request');
var iconv = require('iconv-lite');


const tableStr = "<table cellpadding=\"1\" cellspacing=\"1\" class=\"tableBorder trBgBlue tdAlignC number12 draggable\" width=\"760px\">";
const firstPrefix = "<td nowrap=\"nowrap\">";
const secondPrefix = "<td class=\"tdAlignL font13 fontStyle\" nowrap>";
const thirdPrefix = "<td width=\"16\" align=\"center\">";


const firstPrefixLength = firstPrefix.length;
const secondPrefixLength = secondPrefix.length;
const thirdPrefixLength = thirdPrefix.length;



exports.fetchResultFromJC = function(req, res) {
	console.log('Fetching Result from JC....');
	const url = 'http://racing.hkjc.com/racing/Info/Meeting/RaceCard/Chinese/Local/'+'20160328/ST/';
	console.log('Fetching ' + url);

	request(url, function(error, response, body) {
		
		result = [];
		let textStr = body.split("\\r?\\n")
		for (j=0; j<textStr.length; j++){

			output = "";
			console.log(textStr[j]);
			/*
			if (textStr[j].includes(firstPrefix) && textStr[j].includes("</td>")){
				output = textStr[j].substring(textStr[j].indexOf(firstPrefix)+firstPrefixLength, textStr[j].indexOf("</td>"));
				//oneRow.add(output);
				console.log(output);
			} else if (textStr[j].includes(secondPrefix) && textStr[j].includes("</td>")){
				output = textStr[j].substring(textStr[j].indexOf(secondPrefix)+secondPrefixLength, textStr[j].indexOf("</td>"));
				
				
				if (output.includes("<a "))
					output = textStr[j].substring(textStr[j].indexOf("\">")+2, textStr[j].indexOf("</a>"));
				
				//oneRow.add(output);
				console.log(output);
				if (textStr[j].includes("(") && textStr[j].includes(")")) {
					id = textStr[j].substring(textStr[j].indexOf("</a>"));
					id = id.substring(id.indexOf("(")+1, id.indexOf(")"));
					//oneRow.add(id);
					console.log(id);
				}
				
			} else if (textStr[j].includes(secondPrefix) && textStr[j].includes("</td>")){
				output = textStr[j].substring(textStr[j].indexOf(secondPrefix)+secondPrefixLength, textStr[j].indexOf("</td>"));
				
				
				if (output.includes("<a "))
					output = textStr[j].substring(textStr[j].indexOf("\">")+2, textStr[j].indexOf("</a>"));
				//oneRow.add(output);
				console.log("HERE : "+output);
				
			} else if (textStr[j].includes(thirdPrefix)) {
				output += textStr[j].substring(textStr[j].indexOf(thirdPrefix)+thirdPrefixLength, textStr[j].indexOf("</td>"));
				j++;
				while (!textStr[j].includes("</tr>")) {
					output += " "+ textStr[j].substring(textStr[j].indexOf(thirdPrefix)+thirdPrefixLength, textStr[j].indexOf("</td>"));
					j++;
				}
				//oneRow.add(output);
				console.log(output);
			}

			/*
			if (oneRow.size() == 13) {
				Object oneRowArray[] = oneRow.toArray();
				model.addRow(oneRowArray);
				oneRow = new ArrayList<String>();
				
			}
			*/
		}


		res.send('done');
	});
};
