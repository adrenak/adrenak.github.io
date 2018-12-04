//var ROOT = "file:///D://Work/Adrenak/adrenak.github.io";
var ROOT = "http://www.vatsalambastha.com";

function createNavBar(){
	var result = createFromHTML(`
		<b><p align="left">
			<font size="6" class="navbarentry">
				<a href="` + ROOT + `/index.html" target="home">Home</a> | 
				<a href="` + ROOT + `/works.html" target="works">Works</a> | 
				<a href="` + ROOT + `/hire.html" target="hire">Hire</a> |
				<a href="https://www.medium.com/@adrenak" target="blog">Blog</a> |
				<a href="https://www.behance.net/adrenak" target="portfolio">Portfolio</a> |
				<a href="resume.pdf" target="resume">Resume</a> 
			</font>
		</p></b>
	`);
	return result;
}

function createWorkTile(title, tag, details){
	var tile = createFromHTML(`
<font class="worktitle">` + title + `</font><font class="worktag"><sup>___` + tag + `</sup></font>
<br>
<font class="workdetails">` + details + `</font>
<br><br>
	`);
	return tile;
}

function createFooter(){
	var footer = createFromHTML(`
		<br><br><br>
		<center>
			<font class=footer">
			© Vatsal Ambastha, 2018. 
			<a href="http://www.FirexitSoftware.com" target="firexitweb">Firexit Software</a>	|	
				<a href="https://www.github.com/adrenak" target="git">Github</a>   |   
				<a href="https://www.upwork.com/freelancers/~013bc15aa780db478a" target="uw">Upwork</a>   |   
				<a href="https://www.linkedin.com/in/vatsalAmbastha/" target="linkedin">LinkedIn</a> | 
				<a href="https://www.behance.net/adrenak" target="behance">Behance</a>
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