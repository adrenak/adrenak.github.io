function createWorkTile(title, tag, details, link){
	if(link == undefined){
		var tile = createFromHTML(
title + `<sup>....` + tag + `</sup>
<br>`
+ details + 
`<br><br>`
		);
		return tile;
	}
	else{
		tile = createFromHTML(`
<u><a href="` + link + `">` + title + `</u></a><sup>....` + tag + `</sup>
<br>`
+ details + 
`<br><br>`);
	return tile;
	}
}

// Creates HTML nodes from HTML Text
function createFromHTML(htmlStr) {
    var frag = document.createDocumentFragment(), temp = document.createElement('div');
    temp.innerHTML = htmlStr;
    
    while (temp.firstChild) {
        frag.appendChild(temp.firstChild);
    }
    return frag;
}