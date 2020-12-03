function createWorkTile(title, tag, details, link){
	if(link == undefined){
		var tile = createFromHTML(
`<b>` + title + `</b><sup>. . . .` + tag + `</sup>
<br>`
+ details + 
`<br><br>`
		);
		return tile;
	}
	else{
		tile = createFromHTML(`
<a href="` + link + `"><u><b>` + title + `</b></u></a><sup>. . . .` + tag + `</sup>
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