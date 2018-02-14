function createNavBar(){
	var result = createFromHTML(`
		<p align="left">
			<font size="7">
				<a href="../../index.html" target="home">HOME</a>
			</font>
		</p>
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
			<a href="https://www.github.com/adrenak" target="git">GITHUB</a>   |   
			<a href="https://www.twitter.com/adrenak" target="twitter">TWITTER</a>   |   
			<a href="https://www.upwork.com/freelancers/~013bc15aa780db478a" target="uw">UPWORK</a>   |   
			<a href="https://reddit.com/user/adrenak" target="reddit">REDDIT</a>   |   
			<a href="https://www.linkedin.com/in/vatsalAmbastha/" target="linkedin">LINKEDIN</a>   |   
			<a href="https://www.facebook.com/vatsalAmbastha" target="personalfb">PERSONAL FB</a>    |    
			<a href="https://www.facebook.com/FirexitSoftware" target="firexitfb">FIREXIT FB</a>   |   
			<a href="http://www.FirexitSoftware.com" target="firexitweb">FIREXIT WEB</a>
		</center>
    `);
	return footer;
}

function createDescriptedBlogLink(blogDetails){
	var descriptedBlogLink = createFromHTML(`
		<div>
			<a href=` + blogDetails[1] + ` target=` + blogDetails[0] + `>
				<font size="6">` + blogDetails[0] + `</font>
			</a>
			<br>
			<font size="5">` + blogDetails[2] + `</font>
			<br>
			<font size="4">` + blogDetails[3] + `</font>
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