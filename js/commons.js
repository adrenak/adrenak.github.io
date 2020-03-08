function createNavBar(){
	var result = createFromHTML(`
		<b><p align="center">
			<font size="6" class="navbarentry">
				|
				<a href="index.html">Home</a> | 
				<a href="https://vatsalambastha.blogspot.com">Blog</a> |
				<a href="Vatsal-Ambastha-Resume.pdf">Resume</a> |
				<a href="https://www.upwork.com/freelancers/~013bc15aa780db478a">Hire</a>|
				    
				| |
				<a href="projects.html">Projects</a>| 
				<a href="https://www.behance.net/adrenak">Portfolio</a> |
				<a href="https://www.github.com/adrenak">Open Source</a> |
			</font>
		</p>
		</b>
	`);
	return result;
}

function createWorkTile(title, tag, details, link){
	if(link == undefined){
		var tile = createFromHTML(`
<font class="worktitle">` + title + `</font><font class="worktag"><sup>___` + tag + `</sup></font>
<br>
<font class="workdetails">` + details + `</font>
<br><br>
		`);
		return tile;
	}
	else{
		tile = createFromHTML(`
<font class="worktitle"><a href="` + link + `">` + title + `</a></font><font class="worktag"><sup>___` + tag + `</sup></font>
<br>
<font class="workdetails">` + details + `</font>
<br><br>
	`);
	return tile;
	}
}

function createFooter(){
	var footer = createFromHTML(`
		<br><br><br>
		<center>
			<font class=footer">
			© Vatsal Ambastha 2020. 
			<a href="http://www.FirexitSoftware.com">Firexit Software</a>	|	
				<a href="https://www.github.com/adrenak">Github</a>   |   
				<a href="https://www.upwork.com/freelancers/~013bc15aa780db478a">Upwork</a>   |   
				<a href="https://www.linkedin.com/in/vatsalAmbastha/">LinkedIn</a> | 
				<a href="https://www.behance.net/adrenak">Behance</a>
			</font>
		</center>
    `);
	return footer;
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