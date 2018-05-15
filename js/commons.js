//var ROOT = "file:///D://Work/Adrenak/adrenak.github.io";
var ROOT = "http://www.vatsalambastha.com";

function createNavBar(){
	var result = createFromHTML(`
		<b><p align="left">
			<font size="6" class="navbarentry">
				<a href="` + ROOT + `/index.html" target="home">Home</a> | 
				<a href="` + ROOT + `/works.html" target="home">Works</a> | 
				<a href="` + ROOT + `/hire.html" target="hire">Hire</a>
			</font>
		</p></b>
	`);
	return result;
}

function createBlogHeader(topic, subtitle){
	var result = createFromHTML(`
	<center>
		<font size="7">`+ topic + `</font>
		<br>
		<font size="5">` + subtitle + `</font>
	</center>
	`);
	return result;
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
				<a href="https://www.linkedin.com/in/vatsalAmbastha/" target="linkedin">LinkedIn</a>
			</font>
		</center>
    `);
	return footer;
}

function createDescriptedBlogLink(blogDetails){
	var descriptedBlogLink = createFromHTML(`
		<div>
			<a href=` + blogDetails[1] + ` target=` + blogDetails[0] + `>
				<font class="blogtitle">` + blogDetails[0] + `</font>
			</a>
			<br>
			<font class="blogsubtitle">` + blogDetails[2] + `</font>
			<br>
			<font class="blogdate">` + blogDetails[3] + `</font>
		</div>
	`);

	return descriptedBlogLink;
}

// Creates HTML code for the header using the builder provided
function createHeader(txt){
	var commonBlogHeader = createFromHTML(`
		<div>
			<center><h1>` + txt + `</h1></center>
		</div>
		`);
	return commonBlogHeader;
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

function readFile(filePath, callback){
	var rawFile = new XMLHttpRequest();
    rawFile.open("GET", filePath, true);
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                var allText = rawFile.responseText;
				callback(allText);
            }
        }
    }
    rawFile.send(null);
}