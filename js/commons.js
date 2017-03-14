var root = "http://www.vatsalAmbastha.com/"
//var root = "file:///E:/Adrenak/adrenak.github.io/"

// ================================================
// NAV BAR
// ================================================
// TODO: For god's sake, remove so many params and replace with an internal List
var NavBarBuilder = function(salutation, firstLink, secondLink, thirdLink){
	var _salutation = salutation;
	var _firstLink = firstLink;
	var _secondLink = secondLink;
	var _thirdLink = thirdLink;

	return {
		getSalutation : function(){
			return _salutation;
		},
		getFirstLink : function(){
			return _firstLink;
		},
		getSecondLink : function(){
			return _secondLink;
		},
		getThirdLink : function(){
			return _thirdLink;
		}
	}
}

var NavBarTextBuilder = function(text, color, link, tabName){
	var _text = text;
	var _color = color;
	var _link = link;
	var _tabName = tabName;

	return {
		getText : function(){
			return _text;
		},
		getColor : function(){
			return _color;
		},
		getLink : function(){
			return _link;
		},
		getTabName : function(){
			return _tabName;
		}
	}
}

function createNavBar(builder) {
	var navBar = createFromHTML('' + 
		'<nav class="navbar navbar-default navbar-custom navbar-fixed-top">' + 
	        '<div class="container-fluid">' + 
	            '<!-- Brand and toggle get grouped for better mobile display -->' + 
	            '<div class="navbar-header page-scroll">' + 
	                '<button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1">' + 
	                    '<span class="sr-only">Toggle navigation</span>' + 
	                    '<span class="icon-bar"></span>' + 
	                    '<span class="icon-bar"></span>' + 
	                    '<span class="icon-bar"></span>' + 
	                '</button>' + 
	                '<a class="navbar-brand" href="' + builder.getSalutation().getLink() + '" style="color:' + builder.getSalutation().getColor() + '">' + builder.getSalutation().getText() + '</a>' + 
	            '</div>' + 

	            '<!-- Collect the nav links, forms, and other content for toggling -->' + 
	            '<div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">' + 
	                '<ul class="nav navbar-nav navbar-right">' + 
	                    '<li>' + 
	                        '<a href="' + builder.getFirstLink().getLink() + '" style="color:' + builder.getFirstLink().getColor() + '; font-size:105%" >' + builder.getFirstLink().getText() + '</a>' + 
	                    '</li>' + 
	                    '<li>' + 
	                        '<a href="' + builder.getSecondLink().getLink() + '" style="color:' + builder.getSecondLink().getColor() + '; font-size:105%" >' + builder.getSecondLink().getText() + '</a>' + 
	                    '</li>' + 
	                    '<li>' + 
	                        '<a href="' + builder.getThirdLink().getLink() + '" style="color:' + builder.getThirdLink().getColor() + '; font-size:105%" >' + builder.getThirdLink().getText() + '</a>' + 
	                    '</li>' + 
	                '</ul>' + 
	            '</div>' + 
	        '</div>' + 
	    '</nav>' + 
	'');
	return navBar;
}

function createFooter(){
	var footer = createFromHTML('' +
		'<div class="container">' +
            '<div class="row">' +
                '<div class="col-lg-8 col-lg-offset-2 col-md-10 col-md-offset-1">' +
                    '<ul class="list-inline text-center">' +
                        '<li>' +
                            '<a href="https://www.linkedin.com/in/vatsalambastha" target="tw">' +
                                '<span class="fa-stack fa-lg">' +
                                    '<i class="fa fa-circle fa-stack-2x"></i>' +
                                    '<i class="fa fa-linkedin fa-stack-1x fa-inverse"></i>' +
                                '</span>' +
                            '</a>' +
                        '</li>' +
                        '<li>' +
                            '<a href="http://www.twitter.com/vatsalAmbastha" target="tw">' +
                                '<span class="fa-stack fa-lg">' +
                                    '<i class="fa fa-circle fa-stack-2x"></i>' +
                                    '<i class="fa fa-twitter fa-stack-1x fa-inverse"></i>' +
                                '</span>' +
                            '</a>' +
                        '</li>' +
                        '<li>' +
                            '<a href="https://github.com/adrenak" target="bb">' +
                                '<span class="fa-stack fa-lg">' +
                                    '<i class="fa fa-github fa-2x"></i>' +
                                '</span>' +
                            '</a>' +
                        '</li>' +                        
                        '<li>' +
                            '<a href="http://www.behance.net/adrenak" target="tw">' +
                                '<span class="fa-stack fa-lg">' +
                                    '<i class="fa fa-circle fa-stack-2x"></i>' +
                                    '<i class="fa fa-behance fa-stack-1x fa-inverse"></i>' +
                                '</span>' +
                            '</a>' +
                        '</li>' +                        
                        '<li>' +
                            '<a href="http://www.facebook.com/vatsalAmbastha" target="fb">' +
                                '<span class="fa-stack fa-lg">' +
                                    '<i class="fa fa-circle fa-stack-2x"></i>' +
                                    '<i class="fa fa-facebook fa-stack-1x fa-inverse"></i>' +
                                '</span>' +
                            '</a>' +
                        '</li>' +
                    '</ul>' +
                    '<p class="copyright text-muted">Copyright &copy; Vatsal Ambastha 2017</p>' +
                '</div>' +
            '</div>' +
        '</div>' +
    '');
	return footer;
}

// ================================================
// BLOG 
// ================================================

function createDescriptedBlogLink(blogDetails){
	var descriptedBlogLink = createFromHTML('' + 
		'<div class="post-preview">' + 
			'<a href="' + root + blogDetails[1] + '" target="' + blogDetails[0] + '">' + 
				'<h2 class="post-title">' + blogDetails[0] + '</h2>' + 
				'<h3 class="post-subtitle">' + blogDetails[2] + '</h3>' + 
			'</a>' + 
			'<p class="post-meta"><i>Written on ' + blogDetails[3] + '</i></p>' + 
		'</div>' + 
	'');

	return descriptedBlogLink;
}

// ================================================
// HEADER
// ================================================

// Creates HTML code for the header using the builder provided
function createHeader(builder){
	if(builder == undefined)
		console.log("Pass a builder into createHeader()");
	
	console.log(builder.getSubTitleColor());
	var commonBlogHeader = createFromHTML('' +
		'<header class="intro-header" style="background-image: url(\'' + builder.getBGImage() + '\')">' +
	        '<div class="container">' +
	            '<div class="row">' +
	                '<div class="col-lg-8 col-lg-offset-2 col-md-10 col-md-offset-1">' +
	                    '<div class="post-heading">' +
	                        '<center><h1 style="color:' + builder.getTitleColor()+ '">' + builder.getTitle() + '</h1></center>' +
	                        '<center><h2 style="color:' + builder.getSubTitleColor() + '">' + builder.getSubTitle() + '</h2></center>' +
	                        '<span class="meta">' + builder.getDateDetails() + '</span>' +
	                    '</div>' +
	                '</div>' +
	            '</div>' +
	        '</div>' +
	    '</header>' +
	'');
	return commonBlogHeader;
}

// Builder to store header details
var HeaderBuilder = function(bgImage, title, subTitle) {
	var _bgImage = bgImage;
	var _title = title;
	var _subTitle = subTitle;

	// Optional members
	var _titleColor = "#ffffff";
	var _subTitleColor = "#ffffff";
	var _dateColor = "#ffffff";
	var _date;

	return{
		setDetails : function(author, postedOn){
			_author = author;
			_postedOn = postedOn;
		},
		
		setTitleColor : function(titleColor){
			_titleColor = titleColor;
			return this;
		},
		
		setSubTitleColor : function(subTitleColor){
			_subTitleColor = subTitleColor;
			return this;
		},
		
		setDate : function(date){
			_date = date;
			return this;
		},

		setDateColor : function(dateColor){
			_dateColor = dateColor;
			return this;
		},
		
		getBGImage : 		function(){ return _bgImage; },
		
		getTitle : 			function(){ return _title; },
		
		getSubTitle : 		function(){ return _subTitle; },
		
		getDateDetails : 	function(){ 
			if(_date != undefined)
				return 'Posted on ' + _date; 
			return '';
		},
		
		getTitleColor : 	function(){ return _titleColor; },
		
		getSubTitleColor : 	function(){ return _subTitleColor; },
		
		getPostedOnColor : 	function(){ return _postedOnColor; },

		getDateColor : 		function(){ return _dateColor; },
		
		build : 			function(){ return this; }
	}
}

// ================================================
// HTML Generation
// ================================================
// Creates HTML nodes from HTML Text
function createFromHTML(htmlStr) {
    var frag = document.createDocumentFragment(), temp = document.createElement('div');
    temp.innerHTML = htmlStr;
    
    while (temp.firstChild) {
        frag.appendChild(temp.firstChild);
    }
    return frag;
}