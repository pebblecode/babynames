$(document).ready(function() {
	//alert("I'm working");
	var Names = loadNames();
	var Categories = loadCategories();
	var Edges = loadEdges();
	console.log(Names);
	console.log(Categories);
	console.log(Edges);
	randomStart(Names, Categories, Edges);

	$('.info').click(function(){
		$('.background, .modal').toggle();
	})
	$('.background').click(function(){
		$('.background, .modal').hide();
	})

	$('.loadMore').click(function(){
		randomStart(Names, Categories, Edges);
	})
});

	//generate 3 random categories to begin with
	//There are 56 categories
function randomStart(Names, Categories, Edges){
	//Get Total number of categories
	catTotal = countProperties(Categories)-1;
	//generate 3 random categories
	for(i=0;i<3;i++){
		ran = Math.floor((Math.random() * catTotal) + 1);
		console.log(ran);
		category = Categories[ran].Category;
		$('.CategoryRow#start div:nth-child('+(i+1)+') > span').unbind().last().html(category).click(function(){
			category = $(this).html();
			getNames(Names, Categories, Edges, category, "blue");
		});
	}
	
}

// Get all Names in a category by looking at Edges
function getNames(Names, Categories, Edges, category, color){
	console.log('GETTING NAMES');
	console.log("COLOR: "+color);
	//alert(category);

	//Maker sure initial load More function is removed.
	$('.loadMore').remove();

	//Get total number of Edges
	edgesTotal = countProperties(Edges)-1;
	console.log(edgesTotal);

	//Search through array for instances of a category
	var count = 0;
	var nameData = [];
	for (var i=0; i < edgesTotal; i++) {
        if (Edges[i].category === category ) {
            //console.log(Edges[i].name);
            //get name data for individual name
            nameData[count] = getNameData(Edges[i].name, Names);
            //categoryNames[count] = Edges[i].name;
            count++;
        }
    }
    console.log(nameData);
    
    //Create random order for display
    nameDataTotal = countProperties(nameData); //total number of names returned
    
    //Create a random order of names
    var ord = [];
	for (var i = 1; i <= nameDataTotal; i++) {
 	  ord.push(i);
	}
	ord = shuffle(ord);

	//Add to page

	var nameContainerID = makeid(8);
	newColor = nextColor(color);
	var nameContainer = $('.OverNameCont#proto').clone(false).removeClass(color).addClass(newColor).attr('id',nameContainerID);
	$('.NameRow',nameContainer).attr('id',nameContainerID);
	$('#proto',nameContainer).remove();
	$('.end').before(nameContainer);


	for(i= 0; i<nameDataTotal;i++){
		var name = (nameData[i].Name);
	 	//console.log(name);
	 	//check for paths
	 	var check = (checkForCats(name,Edges));
	 	var ID = makeid(8);
		var container = $('.NameCont#proto:first').clone(false).attr('id',ID);
		$('.Name',container).html(nameData[i].Name).attr('data-tooltip',nameData[i].n+' children named '+nameData[i].Name+' in 2013 ('+nameData[i].sex+').');
		
//grey out if only one category
		if(check==true){
			$('.Name',container).css('border','2px solid white')
		}else{
			$('.Name',container).css('border','2px solid #ddd').css('color','#ddd')
		}
		container.appendTo('.NameRow#'+nameContainerID);
		//$('.NameCont#proto').after(container);

//only clickable if more than one category
		if(check==true){

			$('.NameCont#'+ID).click(function(){
				name = $(this).find(".Name").html();
				console.log(name);
				getCategories(Names, Categories, Edges, name, category, newColor)
			});
		}

		//Hover to show more data


	}

	    //scroll to bottom
	  var WH = $(window).height();  
	  var SH = $('body')[0].scrollHeight;
	  $('html, body').stop().animate({scrollTop: SH}, 1000);




	
}

function getCategories(Names, Categories, Edges, name, thisCategory, color){
	//console.log("GETTING CATEGORIES for "+ name);
	//Get total number of Edges
	edgesTotal = countProperties(Edges)-1;
	//console.log(edgesTotal);

	//Search through array for instances of a Name
	var count = 0;
	var categoryData = [];
	for (var i=0; i < edgesTotal; i++) {
        if (Edges[i].name === name ) {
            //console.log(Edges[i].name);
            //get name data for individual name
            categoryData[count] = Edges[i].category;
            //categoryNames[count] = Edges[i].name;
            count++;
        }
    }
    //console.log(categoryData);

    //clone categories
    categoryTotal = countProperties(categoryData);
    if(categoryTotal>3){categoryTotal = 3}
    //console.log(categoryTotal);
    ID = makeid(8);
    newColor = nextColor(color);
    var NewCats = $(".CatCont#start").clone(false).attr('id',ID).removeClass(color).addClass(newColor);
    for(i=0;i<3;i++){
    	console.log(categoryData[i]);
    	if(categoryData[i]!=undefined){
    		console.log('not undefined');
    		$('.cat > span',NewCats).eq(i).html(categoryData[i]).click(function(){
				category = $(this).html();
				getNames(Names, Categories, Edges, category, newColor);
			});
    	}else{
    		$('div:nth-child('+(i+1)+')',NewCats).remove();
    	}
    	
    }

    //add to DOM
    $('.end').before(NewCats);

    //scroll to bottom
	  var WH = $(window).height();  
	  var SH = $('body')[0].scrollHeight;
	  $('html, body').stop().animate({scrollTop: SH}, 1000);
}

//are there more than one category for a specific name
function checkForCats(name,Edges){
	//Search through array for instances of a Name
	var count = 0;
	var categoryData = [];
	for (var i=0; i < edgesTotal; i++) {
        if (Edges[i].name === name ) {
            //console.log(Edges[i].name);
            //get name data for individual name
            categoryData[count] = Edges[i].category;
            //categoryNames[count] = Edges[i].name;
            count++;
        }
    }
    //console.log(categoryData);

    //return true if there are 2 or more categories
    categoryTotal = countProperties(categoryData);
    if(categoryTotal>1){return true}else{return false}
    }


//Get the Data for an individual Name
function getNameData(name, Names){
	var namesTotal = countProperties(Names)-1;
	console.log("Names Total: "+namesTotal);
	//loop through names to find name
	//var count = 0;
	for (var i=0; i < namesTotal; i++) {
		//console.log(Names[i].Name+" "+name);
        if (Names[i].Name === name ) {
            //console.log("Found Name: "+name+" " +Names[i].sex);
            return Names[i];
            //get name data for individual name
            //getNameData(Edges[i].name, Names);
            //categoryNames[count] = Edges[i].name;
            //count++;
        }
    }
}

//function to shuffle an array
function shuffle(sourceArray) {
    for (var n = 0; n < sourceArray.length - 1; n++) {
        var k = n + Math.floor(Math.random() * (sourceArray.length - n));

        var temp = sourceArray[k];
        sourceArray[k] = sourceArray[n];
        sourceArray[n] = temp;
    }
    return sourceArray;
}

//count number of elements in obj
function countProperties(obj) {
    var count = 0;

    for(var prop in obj) {
        if(obj.hasOwnProperty(prop))
            ++count;
    }

    return count;
}

//Create random hashes for IDs
function makeid(n)
{
    var text = "a";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < n; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}	

function nextColor(color){
	switch (color) {
    case "blue":
        next = "purple";
        break;
    case "purple":
        next = "orange";
        break;
    case "orange":
        next = "green";
        break;
    case "green":
        next = "teal";
        break;
    case "teal":
        next = "blue";
        break;
	}
	return next;
}

function loadNames(){
	var names = 
	[{
        'Index': '1',
        'Name': 'DALI ',
        'sex': 'girl',
        'n': '3',
        'rank': '5742'
    },
    {
        'Index': '2',
        'Name': 'CRUZ ',
        'sex': 'girl',
        'n': '3',
        'rank': '5742'
    },
    {
        'Index': '3',
        'Name': 'BROOKE-LYNN ',
        'sex': 'girl',
        'n': '3',
        'rank': '5742'
    },
    {
        'Index': '4',
        'Name': 'CHARDONNAY ',
        'sex': 'girl',
        'n': '7',
        'rank': '3160'
    },
    {
        'Index': '5',
        'Name': 'SHERRY ',
        'sex': 'girl',
        'n': '5',
        'rank': '4050'
    },
    {
        'Index': '6',
        'Name': 'CHANEL ',
        'sex': 'girl',
        'n': '65',
        'rank': '626'
    },
    {
        'Index': '7',
        'Name': 'DIOR ',
        'sex': 'girl',
        'n': '13',
        'rank': '2062'
    },
    {
        'Index': '8',
        'Name': 'OAKLEY ',
        'sex': 'girl',
        'n': '8',
        'rank': '2887'
    },
    {
        'Index': '9',
        'Name': 'VOGUE ',
        'sex': 'girl',
        'n': '3',
        'rank': '5742'
    },
    {
        'Index': '10',
        'Name': 'DISNEY ',
        'sex': 'girl',
        'n': '3',
        'rank': '5742'
    },
    {
        'Index': '11',
        'Name': 'RILEY ',
        'sex': 'girl',
        'n': '33',
        'rank': '1075'
    },
    {
        'Index': '12',
        'Name': 'KIA ',
        'sex': 'girl',
        'n': '15',
        'rank': '1864'
    },
    {
        'Index': '13',
        'Name': 'PORSCHE ',
        'sex': 'girl',
        'n': '12',
        'rank': '2176'
    },
    {
        'Index': '14',
        'Name': 'LOTUS ',
        'sex': 'girl',
        'n': '8',
        'rank': '2887'
    },
    {
        'Index': '15',
        'Name': 'MERCEDEZ ',
        'sex': 'girl',
        'n': '4',
        'rank': '4739'
    },
    {
        'Index': '16',
        'Name': 'HARLI ',
        'sex': 'girl',
        'n': '4',
        'rank': '4739'
    },
    {
        'Index': '17',
        'Name': 'COOPER ',
        'sex': 'girl',
        'n': '4',
        'rank': '4739'
    },
    {
        'Index': '18',
        'Name': 'ELAN ',
        'sex': 'girl',
        'n': '8',
        'rank': '2887'
    },
    {
        'Index': '19',
        'Name': 'CAPRI ',
        'sex': 'girl',
        'n': '4',
        'rank': '4739'
    },
    {
        'Index': '20',
        'Name': 'EOS ',
        'sex': 'girl',
        'n': '3',
        'rank': '5742'
    },
    {
        'Index': '21',
        'Name': 'BLIMI ',
        'sex': 'girl',
        'n': '13',
        'rank': '2062'
    },
    {
        'Index': '22',
        'Name': 'ZELDA ',
        'sex': 'girl',
        'n': '6',
        'rank': '3536'
    },
    {
        'Index': '23',
        'Name': 'VEGA ',
        'sex': 'girl',
        'n': '6',
        'rank': '3536'
    },
    {
        'Index': '24',
        'Name': 'ISIS ',
        'sex': 'girl',
        'n': '46',
        'rank': '825'
    },
    {
        'Index': '25',
        'Name': 'PERDITA ',
        'sex': 'girl',
        'n': '7',
        'rank': '3160'
    },
    {
        'Index': '26',
        'Name': 'LOLITA ',
        'sex': 'girl',
        'n': '5',
        'rank': '4050'
    },
    {
        'Index': '27',
        'Name': 'ATLANTIS ',
        'sex': 'girl',
        'n': '5',
        'rank': '4050'
    },
    {
        'Index': '28',
        'Name': 'SHAM ',
        'sex': 'girl',
        'n': '4',
        'rank': '4739'
    },
    {
        'Index': '29',
        'Name': 'HEAVENLY ',
        'sex': 'girl',
        'n': '4',
        'rank': '4739'
    },
    {
        'Index': '30',
        'Name': 'ANGELIC ',
        'sex': 'girl',
        'n': '3',
        'rank': '5742'
    },
    {
        'Index': '31',
        'Name': 'RIO ',
        'sex': 'girl',
        'n': '17',
        'rank': '1707'
    },
    {
        'Index': '32',
        'Name': 'DEJA ',
        'sex': 'girl',
        'n': '6',
        'rank': '3536'
    },
    {
        'Index': '33',
        'Name': 'BRITTANY ',
        'sex': 'girl',
        'n': '6',
        'rank': '3536'
    },
    {
        'Index': '34',
        'Name': 'XENA ',
        'sex': 'girl',
        'n': '7',
        'rank': '3160'
    },
    {
        'Index': '35',
        'Name': 'SARON ',
        'sex': 'girl',
        'n': '6',
        'rank': '3536'
    },
    {
        'Index': '36',
        'Name': 'TIRION ',
        'sex': 'girl',
        'n': '5',
        'rank': '4050'
    },
    {
        'Index': '37',
        'Name': 'IO ',
        'sex': 'girl',
        'n': '5',
        'rank': '4050'
    },
    {
        'Index': '38',
        'Name': 'DAENERYS ',
        'sex': 'girl',
        'n': '4',
        'rank': '4739'
    },
    {
        'Index': '39',
        'Name': 'PERL ',
        'sex': 'girl',
        'n': '3',
        'rank': '5742'
    },
    {
        'Index': '40',
        'Name': 'META ',
        'sex': 'girl',
        'n': '3',
        'rank': '5742'
    },
    {
        'Index': '41',
        'Name': 'EMMY ',
        'sex': 'girl',
        'n': '91',
        'rank': '460'
    },
    {
        'Index': '42',
        'Name': 'INDIANA ',
        'sex': 'girl',
        'n': '66',
        'rank': '616'
    },
    {
        'Index': '43',
        'Name': 'INDIANNA ',
        'sex': 'girl',
        'n': '22',
        'rank': '1433'
    },
    {
        'Index': '44',
        'Name': 'MONROE ',
        'sex': 'girl',
        'n': '16',
        'rank': '1774'
    },
    {
        'Index': '45',
        'Name': 'JOLIE ',
        'sex': 'girl',
        'n': '11',
        'rank': '2313'
    },
    {
        'Index': '46',
        'Name': 'TATUM ',
        'sex': 'girl',
        'n': '8',
        'rank': '2887'
    },
    {
        'Index': '47',
        'Name': 'MIRREN ',
        'sex': 'girl',
        'n': '8',
        'rank': '2887'
    },
    {
        'Index': '48',
        'Name': 'DYNASTY ',
        'sex': 'girl',
        'n': '4',
        'rank': '4739'
    },
    {
        'Index': '49',
        'Name': 'DALLAS ',
        'sex': 'girl',
        'n': '4',
        'rank': '4739'
    },
    {
        'Index': '50',
        'Name': 'RIPLEY ',
        'sex': 'girl',
        'n': '3',
        'rank': '5742'
    },
    {
        'Index': '51',
        'Name': 'REN ',
        'sex': 'girl',
        'n': '3',
        'rank': '5742'
    },
    {
        'Index': '52',
        'Name': 'DIAZ ',
        'sex': 'girl',
        'n': '3',
        'rank': '5742'
    },
    {
        'Index': '53',
        'Name': 'ITALIA ',
        'sex': 'girl',
        'n': '19',
        'rank': '1587'
    },
    {
        'Index': '54',
        'Name': 'SI ',
        'sex': 'girl',
        'n': '7',
        'rank': '3160'
    },
    {
        'Index': '55',
        'Name': 'DIVA ',
        'sex': 'girl',
        'n': '6',
        'rank': '3536'
    },
    {
        'Index': '56',
        'Name': 'DOLCE ',
        'sex': 'girl',
        'n': '6',
        'rank': '3536'
    },
    {
        'Index': '57',
        'Name': 'MIO ',
        'sex': 'girl',
        'n': '4',
        'rank': '4739'
    },
    {
        'Index': '58',
        'Name': 'VENICE ',
        'sex': 'girl',
        'n': '3',
        'rank': '5742'
    },
    {
        'Index': '59',
        'Name': 'AMORE ',
        'sex': 'girl',
        'n': '3',
        'rank': '5742'
    },
    {
        'Index': '60',
        'Name': 'DEA ',
        'sex': 'girl',
        'n': '10',
        'rank': '2460'
    },
    {
        'Index': '61',
        'Name': 'CIA ',
        'sex': 'girl',
        'n': '3',
        'rank': '5742'
    },
    {
        'Index': '62',
        'Name': 'STARR ',
        'sex': 'girl',
        'n': '15',
        'rank': '1864'
    },
    {
        'Index': '63',
        'Name': 'JAZMYN ',
        'sex': 'girl',
        'n': '13',
        'rank': '2062'
    },
    {
        'Index': '64',
        'Name': 'JAZZ ',
        'sex': 'girl',
        'n': '6',
        'rank': '3536'
    },
    {
        'Index': '65',
        'Name': 'JUDE ',
        'sex': 'girl',
        'n': '10',
        'rank': '2460'
    },
    {
        'Index': '66',
        'Name': 'LENNON ',
        'sex': 'girl',
        'n': '4',
        'rank': '4739'
    },
    {
        'Index': '67',
        'Name': 'JAZZLYN ',
        'sex': 'girl',
        'n': '3',
        'rank': '5742'
    },
    {
        'Index': '68',
        'Name': 'OLYMPIA ',
        'sex': 'girl',
        'n': '11',
        'rank': '2313'
    },
    {
        'Index': '69',
        'Name': 'ENNIS ',
        'sex': 'girl',
        'n': '4',
        'rank': '4739'
    },
    {
        'Index': '70',
        'Name': 'KYRIE ',
        'sex': 'girl',
        'n': '10',
        'rank': '2460'
    },
    {
        'Index': '71',
        'Name': 'HEAVEN ',
        'sex': 'girl',
        'n': '10',
        'rank': '2460'
    },
    {
        'Index': '72',
        'Name': 'AMEN ',
        'sex': 'girl',
        'n': '8',
        'rank': '2887'
    },
    {
        'Index': '73',
        'Name': 'HALO ',
        'sex': 'girl',
        'n': '7',
        'rank': '3160'
    },
    {
        'Index': '74',
        'Name': 'MAGI ',
        'sex': 'girl',
        'n': '6',
        'rank': '3536'
    },
    {
        'Index': '75',
        'Name': 'BETHLEHEM ',
        'sex': 'girl',
        'n': '6',
        'rank': '3536'
    },
    {
        'Index': '76',
        'Name': 'ZION ',
        'sex': 'girl',
        'n': '5',
        'rank': '4050'
    },
    {
        'Index': '77',
        'Name': 'NASREEN ',
        'sex': 'girl',
        'n': '5',
        'rank': '4050'
    },
    {
        'Index': '78',
        'Name': 'EVERLY ',
        'sex': 'girl',
        'n': '21',
        'rank': '1484'
    },
    {
        'Index': '79',
        'Name': 'DYLAN ',
        'sex': 'girl',
        'n': '16',
        'rank': '1774'
    },
    {
        'Index': '80',
        'Name': 'PRESLEY ',
        'sex': 'girl',
        'n': '9',
        'rank': '2649'
    },
    {
        'Index': '81',
        'Name': 'NIRVANA ',
        'sex': 'girl',
        'n': '9',
        'rank': '2649'
    },
    {
        'Index': '82',
        'Name': 'SANTANA ',
        'sex': 'girl',
        'n': '7',
        'rank': '3160'
    },
    {
        'Index': '83',
        'Name': 'JOVI ',
        'sex': 'girl',
        'n': '5',
        'rank': '4050'
    },
    {
        'Index': '84',
        'Name': 'RUBY-TUESDAY ',
        'sex': 'girl',
        'n': '3',
        'rank': '5742'
    },
    {
        'Index': '85',
        'Name': 'SUMMER-ROSE ',
        'sex': 'girl',
        'n': '57',
        'rank': '699'
    },
    {
        'Index': '86',
        'Name': 'WINTER-ROSE ',
        'sex': 'girl',
        'n': '6',
        'rank': '3536'
    },
    {
        'Index': '87',
        'Name': 'AUTUMN-WILLOW ',
        'sex': 'girl',
        'n': '3',
        'rank': '5742'
    },
    {
        'Index': '88',
        'Name': 'TOBY ',
        'sex': 'girl',
        'n': '6',
        'rank': '3536'
    },
    {
        'Index': '89',
        'Name': 'RUDY ',
        'sex': 'girl',
        'n': '4',
        'rank': '4739'
    },
    {
        'Index': '90',
        'Name': 'MAN ',
        'sex': 'girl',
        'n': '4',
        'rank': '4739'
    },
    {
        'Index': '91',
        'Name': 'LOUIE ',
        'sex': 'girl',
        'n': '4',
        'rank': '4739'
    },
    {
        'Index': '92',
        'Name': 'EVAN ',
        'sex': 'girl',
        'n': '4',
        'rank': '4739'
    },
    {
        'Index': '93',
        'Name': 'RORY ',
        'sex': 'girl',
        'n': '3',
        'rank': '5742'
    },
    {
        'Index': '94',
        'Name': 'PIP ',
        'sex': 'girl',
        'n': '3',
        'rank': '5742'
    },
    {
        'Index': '95',
        'Name': 'LAUREL ',
        'sex': 'girl',
        'n': '24',
        'rank': '1360'
    },
    {
        'Index': '96',
        'Name': 'PETAL ',
        'sex': 'girl',
        'n': '7',
        'rank': '3160'
    },
    {
        'Index': '97',
        'Name': 'PEONY ',
        'sex': 'girl',
        'n': '6',
        'rank': '3536'
    },
    {
        'Index': '98',
        'Name': 'MYRTLE ',
        'sex': 'girl',
        'n': '6',
        'rank': '3536'
    },
    {
        'Index': '99',
        'Name': 'BRACKEN ',
        'sex': 'girl',
        'n': '6',
        'rank': '3536'
    },
    {
        'Index': '100',
        'Name': 'MAPLE ',
        'sex': 'girl',
        'n': '3',
        'rank': '5742'
    },
    {
        'Index': '101',
        'Name': 'MAIZE ',
        'sex': 'girl',
        'n': '3',
        'rank': '5742'
    },
    {
        'Index': '102',
        'Name': 'AMARYLLIS ',
        'sex': 'girl',
        'n': '3',
        'rank': '5742'
    },
    {
        'Index': '103',
        'Name': 'SNOW ',
        'sex': 'girl',
        'n': '8',
        'rank': '2887'
    },
    {
        'Index': '104',
        'Name': 'MISTY ',
        'sex': 'girl',
        'n': '7',
        'rank': '3160'
    },
    {
        'Index': '105',
        'Name': 'RAIN ',
        'sex': 'girl',
        'n': '4',
        'rank': '4739'
    },
    {
        'Index': '106',
        'Name': 'SOL ',
        'sex': 'girl',
        'n': '3',
        'rank': '5742'
    },
    {
        'Index': '107',
        'Name': 'SOLEIL ',
        'sex': 'girl',
        'n': '3',
        'rank': '5742'
    },
    {
        'Index': '108',
        'Name': 'OCEAN ',
        'sex': 'girl',
        'n': '58',
        'rank': '684'
    },
    {
        'Index': '109',
        'Name': 'RIVER ',
        'sex': 'girl',
        'n': '58',
        'rank': '684'
    },
    {
        'Index': '110',
        'Name': 'DIVINE ',
        'sex': 'girl',
        'n': '29',
        'rank': '1177'
    },
    {
        'Index': '111',
        'Name': 'TEMPERANCE ',
        'sex': 'girl',
        'n': '18',
        'rank': '1639'
    },
    {
        'Index': '112',
        'Name': 'MIRACLE ',
        'sex': 'girl',
        'n': '14',
        'rank': '1956'
    },
    {
        'Index': '113',
        'Name': 'LADY ',
        'sex': 'girl',
        'n': '10',
        'rank': '2460'
    },
    {
        'Index': '114',
        'Name': 'GLORY ',
        'sex': 'girl',
        'n': '9',
        'rank': '2649'
    },
    {
        'Index': '115',
        'Name': 'PEACE ',
        'sex': 'girl',
        'n': '7',
        'rank': '3160'
    },
    {
        'Index': '116',
        'Name': 'OPAL ',
        'sex': 'girl',
        'n': '6',
        'rank': '3536'
    },
    {
        'Index': '117',
        'Name': 'MARVELLOUS ',
        'sex': 'girl',
        'n': '6',
        'rank': '3536'
    },
    {
        'Index': '118',
        'Name': 'LUX ',
        'sex': 'girl',
        'n': '6',
        'rank': '3536'
    },
    {
        'Index': '119',
        'Name': 'KITANA ',
        'sex': 'girl',
        'n': '6',
        'rank': '3536'
    },
    {
        'Index': '120',
        'Name': 'ECHO ',
        'sex': 'girl',
        'n': '6',
        'rank': '3536'
    },
    {
        'Index': '121',
        'Name': 'VICTORY ',
        'sex': 'girl',
        'n': '5',
        'rank': '4050'
    },
    {
        'Index': '122',
        'Name': 'UNIQUE ',
        'sex': 'girl',
        'n': '5',
        'rank': '4050'
    },
    {
        'Index': '123',
        'Name': 'TREASURE ',
        'sex': 'girl',
        'n': '5',
        'rank': '4050'
    },
    {
        'Index': '124',
        'Name': 'PURITY ',
        'sex': 'girl',
        'n': '5',
        'rank': '4050'
    },
    {
        'Index': '125',
        'Name': 'LOVEDAY ',
        'sex': 'girl',
        'n': '5',
        'rank': '4050'
    },
    {
        'Index': '126',
        'Name': 'CYAN ',
        'sex': 'girl',
        'n': '5',
        'rank': '4050'
    },
    {
        'Index': '127',
        'Name': 'BOADICEA ',
        'sex': 'girl',
        'n': '5',
        'rank': '4050'
    },
    {
        'Index': '128',
        'Name': 'YUMI ',
        'sex': 'girl',
        'n': '4',
        'rank': '4739'
    },
    {
        'Index': '129',
        'Name': 'QUEEN ',
        'sex': 'girl',
        'n': '4',
        'rank': '4739'
    },
    {
        'Index': '130',
        'Name': 'NON ',
        'sex': 'girl',
        'n': '4',
        'rank': '4739'
    },
    {
        'Index': '131',
        'Name': 'HAVANAH ',
        'sex': 'girl',
        'n': '4',
        'rank': '4739'
    },
    {
        'Index': '132',
        'Name': 'GLORIOUS ',
        'sex': 'girl',
        'n': '4',
        'rank': '4739'
    },
    {
        'Index': '133',
        'Name': 'DUCHESS ',
        'sex': 'girl',
        'n': '4',
        'rank': '4739'
    },
    {
        'Index': '134',
        'Name': 'VELVET ',
        'sex': 'girl',
        'n': '3',
        'rank': '5742'
    },
    {
        'Index': '135',
        'Name': 'SHY ',
        'sex': 'girl',
        'n': '3',
        'rank': '5742'
    },
    {
        'Index': '136',
        'Name': 'SHARN ',
        'sex': 'girl',
        'n': '3',
        'rank': '5742'
    },
    {
        'Index': '137',
        'Name': 'ROUX ',
        'sex': 'girl',
        'n': '3',
        'rank': '5742'
    },
    {
        'Index': '138',
        'Name': 'QI ',
        'sex': 'girl',
        'n': '3',
        'rank': '5742'
    },
    {
        'Index': '139',
        'Name': 'PROMISE ',
        'sex': 'girl',
        'n': '3',
        'rank': '5742'
    },
    {
        'Index': '140',
        'Name': 'LUMEN ',
        'sex': 'girl',
        'n': '3',
        'rank': '5742'
    },
    {
        'Index': '141',
        'Name': 'LILIBET ',
        'sex': 'girl',
        'n': '3',
        'rank': '5742'
    },
    {
        'Index': '142',
        'Name': 'LAMA ',
        'sex': 'girl',
        'n': '3',
        'rank': '5742'
    },
    {
        'Index': '143',
        'Name': 'LA` ',
        'sex': 'girl',
        'n': '3',
        'rank': '5742'
    },
    {
        'Index': '144',
        'Name': 'KOKO ',
        'sex': 'girl',
        'n': '3',
        'rank': '5742'
    },
    {
        'Index': '145',
        'Name': 'KIT ',
        'sex': 'girl',
        'n': '3',
        'rank': '5742'
    },
    {
        'Index': '146',
        'Name': 'HARLEM ',
        'sex': 'girl',
        'n': '3',
        'rank': '5742'
    },
    {
        'Index': '147',
        'Name': 'FEDORA ',
        'sex': 'girl',
        'n': '3',
        'rank': '5742'
    },
    {
        'Index': '148',
        'Name': 'CHARM ',
        'sex': 'girl',
        'n': '3',
        'rank': '5742'
    },
    {
        'Index': '149',
        'Name': 'ANNES ',
        'sex': 'girl',
        'n': '3',
        'rank': '5742'
    },
    {
        'Index': '150',
        'Name': 'AMELIA-ELIZABETH ',
        'sex': 'girl',
        'n': '3',
        'rank': '5742'
    },
    {
        'Index': '151',
        'Name': 'BECKHAM ',
        'sex': 'boy',
        'n': '3',
        'rank': '4685'
    },
    {
        'Index': '152',
        'Name': 'KRUZ ',
        'sex': 'boy',
        'n': '4',
        'rank': '3822'
    },
    {
        'Index': '153',
        'Name': 'CRUZE ',
        'sex': 'boy',
        'n': '5',
        'rank': '3315'
    },
    {
        'Index': '154',
        'Name': 'CRUZ ',
        'sex': 'boy',
        'n': '97',
        'rank': '420'
    },
    {
        'Index': '155',
        'Name': 'BROOKLYN ',
        'sex': 'boy',
        'n': '145',
        'rank': '304'
    },
    {
        'Index': '156',
        'Name': 'ROMEO ',
        'sex': 'boy',
        'n': '167',
        'rank': '278'
    },
    {
        'Index': '157',
        'Name': 'DIOR ',
        'sex': 'boy',
        'n': '5',
        'rank': '3315'
    },
    {
        'Index': '158',
        'Name': 'DIESEL ',
        'sex': 'boy',
        'n': '5',
        'rank': '3315'
    },
    {
        'Index': '159',
        'Name': 'TIMOTEI ',
        'sex': 'boy',
        'n': '6',
        'rank': '2954'
    },
    {
        'Index': '160',
        'Name': 'OAKLEE ',
        'sex': 'boy',
        'n': '8',
        'rank': '2403'
    },
    {
        'Index': '161',
        'Name': 'OAKLEY ',
        'sex': 'boy',
        'n': '256',
        'rank': '210'
    },
    {
        'Index': '162',
        'Name': 'VEYRON ',
        'sex': 'boy',
        'n': '3',
        'rank': '4685'
    },
    {
        'Index': '163',
        'Name': 'KIA ',
        'sex': 'boy',
        'n': '3',
        'rank': '4685'
    },
    {
        'Index': '164',
        'Name': 'ASTON-JAMES ',
        'sex': 'boy',
        'n': '3',
        'rank': '4685'
    },
    {
        'Index': '165',
        'Name': 'ALONZO ',
        'sex': 'boy',
        'n': '3',
        'rank': '4685'
    },
    {
        'Index': '166',
        'Name': 'FORD ',
        'sex': 'boy',
        'n': '8',
        'rank': '2403'
    },
    {
        'Index': '167',
        'Name': 'ROYCE ',
        'sex': 'boy',
        'n': '10',
        'rank': '2055'
    },
    {
        'Index': '168',
        'Name': 'LEYLAND ',
        'sex': 'boy',
        'n': '18',
        'rank': '1339'
    },
    {
        'Index': '169',
        'Name': 'HERBIE ',
        'sex': 'boy',
        'n': '51',
        'rank': '655'
    },
    {
        'Index': '170',
        'Name': 'ASTON ',
        'sex': 'boy',
        'n': '170',
        'rank': '275'
    },
    {
        'Index': '171',
        'Name': 'BENTLEY ',
        'sex': 'boy',
        'n': '184',
        'rank': '263'
    },
    {
        'Index': '172',
        'Name': 'COOPER ',
        'sex': 'boy',
        'n': '281',
        'rank': '198'
    },
    {
        'Index': '173',
        'Name': 'JENSEN ',
        'sex': 'boy',
        'n': '305',
        'rank': '184'
    },
    {
        'Index': '174',
        'Name': 'MORGAN ',
        'sex': 'boy',
        'n': '387',
        'rank': '151'
    },
    {
        'Index': '175',
        'Name': 'HARLEY ',
        'sex': 'boy',
        'n': '1,275',
        'rank': '49'
    },
    {
        'Index': '176',
        'Name': 'RILEY ',
        'sex': 'boy',
        'n': '3,122',
        'rank': '21'
    },
    {
        'Index': '177',
        'Name': 'TONY-JUNIOR ',
        'sex': 'boy',
        'n': '3',
        'rank': '4685'
    },
    {
        'Index': '178',
        'Name': 'DUTCH ',
        'sex': 'boy',
        'n': '3',
        'rank': '4685'
    },
    {
        'Index': '179',
        'Name': 'DEL ',
        'sex': 'boy',
        'n': '3',
        'rank': '4685'
    },
    {
        'Index': '180',
        'Name': 'FRANKIE-J ',
        'sex': 'boy',
        'n': '4',
        'rank': '3822'
    },
    {
        'Index': '181',
        'Name': 'JOHNBOY ',
        'sex': 'boy',
        'n': '5',
        'rank': '3315'
    },
    {
        'Index': '182',
        'Name': 'MATE ',
        'sex': 'boy',
        'n': '7',
        'rank': '2660'
    },
    {
        'Index': '183',
        'Name': 'DANISH ',
        'sex': 'boy',
        'n': '31',
        'rank': '931'
    },
    {
        'Index': '184',
        'Name': 'VINNIE ',
        'sex': 'boy',
        'n': '235',
        'rank': '221'
    },
    {
        'Index': '185',
        'Name': 'RYU ',
        'sex': 'boy',
        'n': '4',
        'rank': '3822'
    },
    {
        'Index': '186',
        'Name': 'LINK ',
        'sex': 'boy',
        'n': '6',
        'rank': '2954'
    },
    {
        'Index': '187',
        'Name': 'RAIDEN ',
        'sex': 'boy',
        'n': '20',
        'rank': '1247'
    },
    {
        'Index': '188',
        'Name': 'MARIO ',
        'sex': 'boy',
        'n': '64',
        'rank': '560'
    },
    {
        'Index': '189',
        'Name': 'THE ',
        'sex': 'boy',
        'n': '3',
        'rank': '4685'
    },
    {
        'Index': '190',
        'Name': 'JACK-DANIEL ',
        'sex': 'boy',
        'n': '3',
        'rank': '4685'
    },
    {
        'Index': '191',
        'Name': 'PAPA ',
        'sex': 'boy',
        'n': '6',
        'rank': '2954'
    },
    {
        'Index': '192',
        'Name': 'MD. ',
        'sex': 'boy',
        'n': '6',
        'rank': '2954'
    },
    {
        'Index': '193',
        'Name': 'SUAREZ ',
        'sex': 'boy',
        'n': '3',
        'rank': '4685'
    },
    {
        'Index': '194',
        'Name': 'RAMIREZ ',
        'sex': 'boy',
        'n': '3',
        'rank': '4685'
    },
    {
        'Index': '195',
        'Name': 'DAVID-JAMES ',
        'sex': 'boy',
        'n': '3',
        'rank': '4685'
    },
    {
        'Index': '196',
        'Name': 'CHRISTIANO ',
        'sex': 'boy',
        'n': '4',
        'rank': '3822'
    },
    {
        'Index': '197',
        'Name': 'MESSI ',
        'sex': 'boy',
        'n': '5',
        'rank': '3315'
    },
    {
        'Index': '198',
        'Name': 'XAVI ',
        'sex': 'boy',
        'n': '13',
        'rank': '1706'
    },
    {
        'Index': '199',
        'Name': 'ZIDANE ',
        'sex': 'boy',
        'n': '16',
        'rank': '1462'
    },
    {
        'Index': '200',
        'Name': 'NEON ',
        'sex': 'boy',
        'n': '3',
        'rank': '4685'
    },
    {
        'Index': '201',
        'Name': 'LAZAR ',
        'sex': 'boy',
        'n': '3',
        'rank': '4685'
    },
    {
        'Index': '202',
        'Name': 'LAZER ',
        'sex': 'boy',
        'n': '3',
        'rank': '4685'
    },
    {
        'Index': '203',
        'Name': 'JETSON ',
        'sex': 'boy',
        'n': '3',
        'rank': '4685'
    },
    {
        'Index': '204',
        'Name': 'JET ',
        'sex': 'boy',
        'n': '7',
        'rank': '2660'
    },
    {
        'Index': '205',
        'Name': 'ZEN ',
        'sex': 'boy',
        'n': '5',
        'rank': '3315'
    },
    {
        'Index': '206',
        'Name': 'STORM ',
        'sex': 'boy',
        'n': '7',
        'rank': '2660'
    },
    {
        'Index': '207',
        'Name': 'OCEAN ',
        'sex': 'boy',
        'n': '10',
        'rank': '2055'
    },
    {
        'Index': '208',
        'Name': 'ZEBEDEE ',
        'sex': 'boy',
        'n': '14',
        'rank': '1617'
    },
    {
        'Index': '209',
        'Name': 'ZEPHYR ',
        'sex': 'boy',
        'n': '14',
        'rank': '1617'
    },
    {
        'Index': '210',
        'Name': 'ROGEN ',
        'sex': 'boy',
        'n': '3',
        'rank': '4685'
    },
    {
        'Index': '211',
        'Name': 'HARLEY-DEAN ',
        'sex': 'boy',
        'n': '3',
        'rank': '4685'
    },
    {
        'Index': '212',
        'Name': 'WESTLEY ',
        'sex': 'boy',
        'n': '4',
        'rank': '3822'
    },
    {
        'Index': '213',
        'Name': 'ROMERO ',
        'sex': 'boy',
        'n': '4',
        'rank': '3822'
    },
    {
        'Index': '214',
        'Name': 'LOXLEY ',
        'sex': 'boy',
        'n': '4',
        'rank': '3822'
    },
    {
        'Index': '215',
        'Name': 'KALLEL ',
        'sex': 'boy',
        'n': '4',
        'rank': '3822'
    },
    {
        'Index': '216',
        'Name': 'TOMMYLEE ',
        'sex': 'boy',
        'n': '5',
        'rank': '3315'
    },
    {
        'Index': '217',
        'Name': 'RIPLEY ',
        'sex': 'boy',
        'n': '5',
        'rank': '3315'
    },
    {
        'Index': '218',
        'Name': 'JESSE-JAMES ',
        'sex': 'boy',
        'n': '5',
        'rank': '3315'
    },
    {
        'Index': '219',
        'Name': 'CAINE ',
        'sex': 'boy',
        'n': '10',
        'rank': '2055'
    },
    {
        'Index': '220',
        'Name': 'KALEL ',
        'sex': 'boy',
        'n': '13',
        'rank': '1706'
    },
    {
        'Index': '221',
        'Name': 'MONROE ',
        'sex': 'boy',
        'n': '16',
        'rank': '1462'
    },
    {
        'Index': '222',
        'Name': 'KAL-EL ',
        'sex': 'boy',
        'n': '16',
        'rank': '1462'
    },
    {
        'Index': '223',
        'Name': 'MAVERICK ',
        'sex': 'boy',
        'n': '20',
        'rank': '1247'
    },
    {
        'Index': '224',
        'Name': 'FOX ',
        'sex': 'boy',
        'n': '21',
        'rank': '1183'
    },
    {
        'Index': '225',
        'Name': 'KEANU ',
        'sex': 'boy',
        'n': '23',
        'rank': '1116'
    },
    {
        'Index': '226',
        'Name': 'ROCKY ',
        'sex': 'boy',
        'n': '50',
        'rank': '666'
    },
    {
        'Index': '227',
        'Name': 'TOMMY-LEE ',
        'sex': 'boy',
        'n': '71',
        'rank': '520'
    },
    {
        'Index': '228',
        'Name': 'KEATON ',
        'sex': 'boy',
        'n': '77',
        'rank': '493'
    },
    {
        'Index': '229',
        'Name': 'RIVER ',
        'sex': 'boy',
        'n': '80',
        'rank': '479'
    },
    {
        'Index': '230',
        'Name': 'RRON ',
        'sex': 'boy',
        'n': '3',
        'rank': '4685'
    },
    {
        'Index': '231',
        'Name': 'MALCOM ',
        'sex': 'boy',
        'n': '3',
        'rank': '4685'
    },
    {
        'Index': '232',
        'Name': 'LINCON ',
        'sex': 'boy',
        'n': '3',
        'rank': '4685'
    },
    {
        'Index': '233',
        'Name': 'ISREAL ',
        'sex': 'boy',
        'n': '3',
        'rank': '4685'
    },
    {
        'Index': '234',
        'Name': 'ADAAM ',
        'sex': 'boy',
        'n': '3',
        'rank': '4685'
    },
    {
        'Index': '235',
        'Name': 'LYNCON ',
        'sex': 'boy',
        'n': '4',
        'rank': '3822'
    },
    {
        'Index': '236',
        'Name': 'TYGER ',
        'sex': 'boy',
        'n': '5',
        'rank': '3315'
    },
    {
        'Index': '237',
        'Name': 'JAXXON ',
        'sex': 'boy',
        'n': '5',
        'rank': '3315'
    },
    {
        'Index': '238',
        'Name': 'JAXX ',
        'sex': 'boy',
        'n': '10',
        'rank': '2055'
    },
    {
        'Index': '239',
        'Name': 'ALEKS ',
        'sex': 'boy',
        'n': '19',
        'rank': '1294'
    },
    {
        'Index': '240',
        'Name': 'DEEN ',
        'sex': 'boy',
        'n': '33',
        'rank': '882'
    },
    {
        'Index': '241',
        'Name': 'AADAM ',
        'sex': 'boy',
        'n': '109',
        'rank': '373'
    },
    {
        'Index': '242',
        'Name': 'ALANS ',
        'sex': 'boy',
        'n': '3',
        'rank': '4685'
    },
    {
        'Index': '243',
        'Name': 'TIBER ',
        'sex': 'boy',
        'n': '3',
        'rank': '4685'
    },
    {
        'Index': '244',
        'Name': 'ROME ',
        'sex': 'boy',
        'n': '27',
        'rank': '1024'
    },
    {
        'Index': '245',
        'Name': 'MILAN ',
        'sex': 'boy',
        'n': '97',
        'rank': '420'
    },
    {
        'Index': '246',
        'Name': 'SUCCESS ',
        'sex': 'boy',
        'n': '3',
        'rank': '4685'
    },
    {
        'Index': '247',
        'Name': 'LUCKY ',
        'sex': 'boy',
        'n': '3',
        'rank': '4685'
    },
    {
        'Index': '248',
        'Name': 'BERK ',
        'sex': 'boy',
        'n': '3',
        'rank': '4685'
    },
    {
        'Index': '249',
        'Name': 'NADIR ',
        'sex': 'boy',
        'n': '4',
        'rank': '3822'
    },
    {
        'Index': '250',
        'Name': 'T ',
        'sex': 'boy',
        'n': '4',
        'rank': '3822'
    },
    {
        'Index': '251',
        'Name': 'LJ ',
        'sex': 'boy',
        'n': '5',
        'rank': '3315'
    },
    {
        'Index': '252',
        'Name': 'J ',
        'sex': 'boy',
        'n': '6',
        'rank': '2954'
    },
    {
        'Index': '253',
        'Name': 'TJ ',
        'sex': 'boy',
        'n': '7',
        'rank': '2660'
    },
    {
        'Index': '254',
        'Name': 'JJ ',
        'sex': 'boy',
        'n': '7',
        'rank': '2660'
    },
    {
        'Index': '255',
        'Name': 'C-JAY ',
        'sex': 'boy',
        'n': '7',
        'rank': '2660'
    },
    {
        'Index': '256',
        'Name': 'A ',
        'sex': 'boy',
        'n': '7',
        'rank': '2660'
    },
    {
        'Index': '257',
        'Name': 'CJ ',
        'sex': 'boy',
        'n': '8',
        'rank': '2403'
    },
    {
        'Index': '258',
        'Name': 'A-JAY ',
        'sex': 'boy',
        'n': '8',
        'rank': '2403'
    },
    {
        'Index': '259',
        'Name': 'CEEJAY ',
        'sex': 'boy',
        'n': '9',
        'rank': '2216'
    },
    {
        'Index': '260',
        'Name': 'AJ ',
        'sex': 'boy',
        'n': '29',
        'rank': '976'
    },
    {
        'Index': '261',
        'Name': 'TITO ',
        'sex': 'boy',
        'n': '3',
        'rank': '4685'
    },
    {
        'Index': '262',
        'Name': 'ROMMEL ',
        'sex': 'boy',
        'n': '3',
        'rank': '4685'
    },
    {
        'Index': '263',
        'Name': 'PTOLEMY ',
        'sex': 'boy',
        'n': '3',
        'rank': '4685'
    },
    {
        'Index': '264',
        'Name': 'MING ',
        'sex': 'boy',
        'n': '3',
        'rank': '4685'
    },
    {
        'Index': '265',
        'Name': 'CASTRO ',
        'sex': 'boy',
        'n': '3',
        'rank': '4685'
    },
    {
        'Index': '266',
        'Name': 'OCTAVIAN ',
        'sex': 'boy',
        'n': '4',
        'rank': '3822'
    },
    {
        'Index': '267',
        'Name': 'ATILLA ',
        'sex': 'boy',
        'n': '4',
        'rank': '3822'
    },
    {
        'Index': '268',
        'Name': 'TIBERIUS ',
        'sex': 'boy',
        'n': '10',
        'rank': '2055'
    },
    {
        'Index': '269',
        'Name': 'KAISER ',
        'sex': 'boy',
        'n': '16',
        'rank': '1462'
    },
    {
        'Index': '270',
        'Name': 'CHE ',
        'sex': 'boy',
        'n': '21',
        'rank': '1183'
    },
    {
        'Index': '271',
        'Name': 'KAIN ',
        'sex': 'boy',
        'n': '22',
        'rank': '1147'
    },
    {
        'Index': '272',
        'Name': 'RHYTHM ',
        'sex': 'boy',
        'n': '3',
        'rank': '4685'
    },
    {
        'Index': '273',
        'Name': 'WOLFGANG ',
        'sex': 'boy',
        'n': '3',
        'rank': '4685'
    },
    {
        'Index': '274',
        'Name': 'LYRIC ',
        'sex': 'boy',
        'n': '4',
        'rank': '3822'
    },
    {
        'Index': '275',
        'Name': 'AMADEUS ',
        'sex': 'boy',
        'n': '4',
        'rank': '3822'
    },
    {
        'Index': '276',
        'Name': 'ORPHEUS ',
        'sex': 'boy',
        'n': '3',
        'rank': '4685'
    },
    {
        'Index': '277',
        'Name': 'NIMROD ',
        'sex': 'boy',
        'n': '3',
        'rank': '4685'
    },
    {
        'Index': '278',
        'Name': 'MUSE ',
        'sex': 'boy',
        'n': '3',
        'rank': '4685'
    },
    {
        'Index': '279',
        'Name': 'ACHILLES ',
        'sex': 'boy',
        'n': '3',
        'rank': '4685'
    },
    {
        'Index': '280',
        'Name': 'MERLIN ',
        'sex': 'boy',
        'n': '4',
        'rank': '3822'
    },
    {
        'Index': '281',
        'Name': 'PERSEUS ',
        'sex': 'boy',
        'n': '6',
        'rank': '2954'
    },
    {
        'Index': '282',
        'Name': 'ZEUS ',
        'sex': 'boy',
        'n': '7',
        'rank': '2660'
    },
    {
        'Index': '283',
        'Name': 'TROY ',
        'sex': 'boy',
        'n': '127',
        'rank': '329'
    },
    {
        'Index': '284',
        'Name': 'MATISSE ',
        'sex': 'boy',
        'n': '3',
        'rank': '4685'
    },
    {
        'Index': '285',
        'Name': 'MICHELANGELO ',
        'sex': 'boy',
        'n': '4',
        'rank': '3822'
    },
    {
        'Index': '286',
        'Name': 'RAFFAEL ',
        'sex': 'boy',
        'n': '5',
        'rank': '3315'
    },
    {
        'Index': '287',
        'Name': 'REAGAN ',
        'sex': 'boy',
        'n': '68',
        'rank': '538'
    },
    {
        'Index': '288',
        'Name': 'LINCOLN ',
        'sex': 'boy',
        'n': '271',
        'rank': '204'
    },
    {
        'Index': '289',
        'Name': 'KENNEDY ',
        'sex': 'boy',
        'n': '5',
        'rank': '3315'
    },
    {
        'Index': '290',
        'Name': 'LYNDON ',
        'sex': 'boy',
        'n': '22',
        'rank': '1147'
    },
    {
        'Index': '291',
        'Name': 'KING-DAVID ',
        'sex': 'boy',
        'n': '3',
        'rank': '4685'
    },
    {
        'Index': '292',
        'Name': 'JERICHO ',
        'sex': 'boy',
        'n': '3',
        'rank': '4685'
    },
    {
        'Index': '293',
        'Name': 'GOSPEL ',
        'sex': 'boy',
        'n': '3',
        'rank': '4685'
    },
    {
        'Index': '294',
        'Name': 'SAMPSON ',
        'sex': 'boy',
        'n': '5',
        'rank': '3315'
    },
    {
        'Index': '295',
        'Name': 'LAZARUS ',
        'sex': 'boy',
        'n': '5',
        'rank': '3315'
    },
    {
        'Index': '296',
        'Name': 'AMEN ',
        'sex': 'boy',
        'n': '6',
        'rank': '2954'
    },
    {
        'Index': '297',
        'Name': 'DRE ',
        'sex': 'boy',
        'n': '13',
        'rank': '1706'
    },
    {
        'Index': '298',
        'Name': 'PHARRELL ',
        'sex': 'boy',
        'n': '28',
        'rank': '1001'
    },
    {
        'Index': '299',
        'Name': 'JOHN-JACK ',
        'sex': 'boy',
        'n': '3',
        'rank': '4685'
    },
    {
        'Index': '300',
        'Name': 'ROYAL ',
        'sex': 'boy',
        'n': '3',
        'rank': '4685'
    },
    {
        'Index': '301',
        'Name': 'TREASURE ',
        'sex': 'boy',
        'n': '4',
        'rank': '3822'
    },
    {
        'Index': '302',
        'Name': 'PRECIOUS ',
        'sex': 'boy',
        'n': '4',
        'rank': '3822'
    },
    {
        'Index': '303',
        'Name': 'STERLING ',
        'sex': 'boy',
        'n': '6',
        'rank': '2954'
    },
    {
        'Index': '304',
        'Name': 'PROSPER ',
        'sex': 'boy',
        'n': '7',
        'rank': '2660'
    },
    {
        'Index': '305',
        'Name': 'DIAMOND ',
        'sex': 'boy',
        'n': '7',
        'rank': '2660'
    },
    {
        'Index': '306',
        'Name': 'RONSON ',
        'sex': 'boy',
        'n': '3',
        'rank': '4685'
    },
    {
        'Index': '307',
        'Name': 'JOVI ',
        'sex': 'boy',
        'n': '3',
        'rank': '4685'
    },
    {
        'Index': '308',
        'Name': 'JAGGER ',
        'sex': 'boy',
        'n': '3',
        'rank': '4685'
    },
    {
        'Index': '309',
        'Name': 'ELTON ',
        'sex': 'boy',
        'n': '3',
        'rank': '4685'
    },
    {
        'Index': '310',
        'Name': 'ABBA ',
        'sex': 'boy',
        'n': '3',
        'rank': '4685'
    },
    {
        'Index': '311',
        'Name': 'SLADE ',
        'sex': 'boy',
        'n': '4',
        'rank': '3822'
    },
    {
        'Index': '312',
        'Name': 'RAMONE ',
        'sex': 'boy',
        'n': '4',
        'rank': '3822'
    },
    {
        'Index': '313',
        'Name': 'OZZI ',
        'sex': 'boy',
        'n': '4',
        'rank': '3822'
    },
    {
        'Index': '314',
        'Name': 'BOWIE ',
        'sex': 'boy',
        'n': '5',
        'rank': '3315'
    },
    {
        'Index': '315',
        'Name': 'ALEX-JAMES ',
        'sex': 'boy',
        'n': '6',
        'rank': '2954'
    },
    {
        'Index': '316',
        'Name': 'REEF ',
        'sex': 'boy',
        'n': '12',
        'rank': '1796'
    },
    {
        'Index': '317',
        'Name': 'JIMI ',
        'sex': 'boy',
        'n': '12',
        'rank': '1796'
    },
    {
        'Index': '318',
        'Name': 'OZZY ',
        'sex': 'boy',
        'n': '24',
        'rank': '1086'
    },
    {
        'Index': '319',
        'Name': 'HENDRIX ',
        'sex': 'boy',
        'n': '41',
        'rank': '771'
    },
    {
        'Index': '320',
        'Name': 'AXEL ',
        'sex': 'boy',
        'n': '54',
        'rank': '632'
    },
    {
        'Index': '321',
        'Name': 'DEEP ',
        'sex': 'boy',
        'n': '3',
        'rank': '4685'
    },
    {
        'Index': '322',
        'Name': 'HORACE ',
        'sex': 'boy',
        'n': '4',
        'rank': '3822'
    },
    {
        'Index': '323',
        'Name': 'MILTON ',
        'sex': 'boy',
        'n': '5',
        'rank': '3315'
    },
    {
        'Index': '324',
        'Name': 'CATO ',
        'sex': 'boy',
        'n': '5',
        'rank': '3315'
    },
    {
        'Index': '325',
        'Name': 'WISDOM ',
        'sex': 'boy',
        'n': '9',
        'rank': '2216'
    },
    {
        'Index': '326',
        'Name': 'BREN ',
        'sex': 'boy',
        'n': '3',
        'rank': '4685'
    },
    {
        'Index': '327',
        'Name': 'REMINGTON ',
        'sex': 'boy',
        'n': '4',
        'rank': '3822'
    },
    {
        'Index': '328',
        'Name': 'MACE ',
        'sex': 'boy',
        'n': '4',
        'rank': '3822'
    },
    {
        'Index': '329',
        'Name': 'TALON ',
        'sex': 'boy',
        'n': '5',
        'rank': '3315'
    },
    {
        'Index': '330',
        'Name': 'COLT ',
        'sex': 'boy',
        'n': '10',
        'rank': '2055'
    },
    {
        'Index': '331',
        'Name': 'SHIV ',
        'sex': 'boy',
        'n': '35',
        'rank': '850'
    },
    {
        'Index': '332',
        'Name': 'ARCHER ',
        'sex': 'boy',
        'n': '100',
        'rank': '407'
    },
    {
        'Index': '333',
        'Name': 'KOHL ',
        'sex': 'boy',
        'n': '4',
        'rank': '3822'
    },
    {
        'Index': '334',
        'Name': 'HEATHCLIFF ',
        'sex': 'boy',
        'n': '4',
        'rank': '3822'
    },
    {
        'Index': '335',
        'Name': 'SOUL ',
        'sex': 'boy',
        'n': '5',
        'rank': '3315'
    },
    {
        'Index': '336',
        'Name': 'RANDY ',
        'sex': 'boy',
        'n': '5',
        'rank': '3315'
    },
    {
        'Index': '337',
        'Name': 'LONDON ',
        'sex': 'boy',
        'n': '5',
        'rank': '3315'
    },
    {
        'Index': '338',
        'Name': 'VICTORY ',
        'sex': 'boy',
        'n': '6',
        'rank': '2954'
    },
    {
        'Index': '339',
        'Name': 'MIRACLE ',
        'sex': 'boy',
        'n': '6',
        'rank': '2954'
    },
    {
        'Index': '340',
        'Name': 'GLORY ',
        'sex': 'boy',
        'n': '6',
        'rank': '2954'
    },
    {
        'Index': '341',
        'Name': 'DESTINY ',
        'sex': 'boy',
        'n': '6',
        'rank': '2954'
    },
    {
        'Index': '342',
        'Name': 'PRAISE ',
        'sex': 'boy',
        'n': '7',
        'rank': '2660'
    },
    {
        'Index': '343',
        'Name': 'FAVOUR ',
        'sex': 'boy',
        'n': '9',
        'rank': '2216'
    },
    {
        'Index': '344',
        'Name': 'BLESSING ',
        'sex': 'boy',
        'n': '9',
        'rank': '2216'
    },
    {
        'Index': '345',
        'Name': 'JUSTICE ',
        'sex': 'boy',
        'n': '13',
        'rank': '1706'
    },
    {
        'Index': '346',
        'Name': 'HENLEY ',
        'sex': 'boy',
        'n': '97',
        'rank': '420'
    },
    {
        'Index': '347',
        'Name': 'CHRISTOPHER-JAMES ',
        'sex': 'boy',
        'n': '4',
        'rank': '3822'
    }
];
//namesJ = JSON.parse(names);
return names;
}

function loadCategories(){
	categories = [
    {
        "Number": "1",
        "Category": "beckham"
    },
    {
        "Number": "2",
        "Category": "brand"
    },
    {
        "Number": "3",
        "Category": "car"
    },
    {
        "Number": "4",
        "Category": "cockney"
    },
    {
        "Number": "5",
        "Category": "computer game"
    },
    {
        "Number": "6",
        "Category": "confusing"
    },
    {
        "Number": "7",
        "Category": "football"
    },
    {
        "Number": "8",
        "Category": "future"
    },
    {
        "Number": "9",
        "Category": "hippy"
    },
    {
        "Number": "10",
        "Category": "hollywood"
    },
    {
        "Number": "11",
        "Category": "innovative spelling"
    },
    {
        "Number": "12",
        "Category": "Italy"
    },
    {
        "Number": "13",
        "Category": "doomed"
    },
    {
        "Number": "14",
        "Category": "lazy"
    },
    {
        "Number": "15",
        "Category": "monster"
    },
    {
        "Number": "16",
        "Category": "music"
    },
    {
        "Number": "17",
        "Category": "myth"
    },
    {
        "Number": "18",
        "Category": "art"
    },
    {
        "Number": "19",
        "Category": "president"
    },
    {
        "Number": "20",
        "Category": "random bible page"
    },
    {
        "Number": "21",
        "Category": "rap"
    },
    {
        "Number": "22",
        "Category": "redundant"
    },
    {
        "Number": "23",
        "Category": "rich"
    },
    {
        "Number": "24",
        "Category": "rock"
    },
    {
        "Number": "25",
        "Category": "thinker"
    },
    {
        "Number": "26",
        "Category": "weapon"
    },
    {
        "Number": "27",
        "Category": "misc"
    },
    {
        "Number": "28",
        "Category": "geography"
    },
    {
        "Number": "29",
        "Category": "hyperbole"
    },
    {
        "Number": "30",
        "Category": "long"
    },
    {
        "Number": "31",
        "Category": "booze"
    },
    {
        "Number": "32",
        "Category": "France"
    },
    {
        "Number": "33",
        "Category": "geek"
    },
    {
        "Number": "34",
        "Category": "law enforcement"
    },
    {
        "Number": "35",
        "Category": "olympics"
    },
    {
        "Number": "36",
        "Category": "season/vegetation"
    },
    {
        "Number": "37",
        "Category": "tomboy"
    },
    {
        "Number": "38",
        "Category": "vegetation"
    },
    {
        "Number": "39",
        "Category": "weather"
    },
    {
        "Number": "40",
        "Category": "hyperbole"
    },
    {
        "Number": "41",
        "Category": "colour"
    },
    {
        "Number": "42",
        "Category": "royal"
    },
    {
        "Number": "43",
        "Category": "hyphen"
    },
    {
        "Number": "44",
        "Category": "game of thrones"
    },
    {
        "Number": "45",
        "Category": "gladiators"
    },
    {
        "Number": "46",
        "Category": "hero"
    },
    {
        "Number": "47",
        "Category": "sport"
    },
    {
        "Number": "48",
        "Category": "gender"
    },
    {
        "Number": "49",
        "Category": "rolling stones"
    },
    {
        "Number": "50",
        "Category": "abstract"
    },
    {
        "Number": "51",
        "Category": "irony"
    },
    {
        "Number": "52",
        "Category": "punctuation"
    },
    {
        "Number": "53",
        "Category": "animal"
    },
    {
        "Number": "54",
        "Category": "plural"
    },
    {
        "Number": "55",
        "Category": "history"
    },
    {
        "Number": "56",
        "Category": "childish"
    }
];
return categories;
}

function loadEdges(){
	edges = [
    {
        "number": "1",
        "name": "DALI ",
        "category": "art"
    },
    {
        "number": "2",
        "name": "CRUZ ",
        "category": "beckham"
    },
    {
        "number": "3",
        "name": "BROOKE-LYNN ",
        "category": "beckham"
    },
    {
        "number": "4",
        "name": "CHARDONNAY ",
        "category": "booze"
    },
    {
        "number": "5",
        "name": "SHERRY ",
        "category": "booze"
    },
    {
        "number": "6",
        "name": "CHANEL ",
        "category": "brand"
    },
    {
        "number": "7",
        "name": "DIOR ",
        "category": "brand"
    },
    {
        "number": "8",
        "name": "OAKLEY ",
        "category": "brand"
    },
    {
        "number": "9",
        "name": "VOGUE ",
        "category": "brand"
    },
    {
        "number": "10",
        "name": "DISNEY ",
        "category": "brand"
    },
    {
        "number": "11",
        "name": "RILEY ",
        "category": "car"
    },
    {
        "number": "12",
        "name": "KIA ",
        "category": "car"
    },
    {
        "number": "13",
        "name": "PORSCHE ",
        "category": "car"
    },
    {
        "number": "14",
        "name": "LOTUS ",
        "category": "car"
    },
    {
        "number": "15",
        "name": "MERCEDEZ ",
        "category": "car"
    },
    {
        "number": "16",
        "name": "HARLI ",
        "category": "car"
    },
    {
        "number": "17",
        "name": "COOPER ",
        "category": "car"
    },
    {
        "number": "18",
        "name": "ELAN ",
        "category": "car "
    },
    {
        "number": "19",
        "name": "CAPRI ",
        "category": "car "
    },
    {
        "number": "20",
        "name": "EOS ",
        "category": "car "
    },
    {
        "number": "21",
        "name": "BLIMI ",
        "category": "cockney"
    },
    {
        "number": "22",
        "name": "ZELDA ",
        "category": "computer games"
    },
    {
        "number": "23",
        "name": "VEGA ",
        "category": "computer games"
    },
    {
        "number": "24",
        "name": "ISIS ",
        "category": "doomed"
    },
    {
        "number": "25",
        "name": "PERDITA ",
        "category": "doomed"
    },
    {
        "number": "26",
        "name": "LOLITA ",
        "category": "doomed"
    },
    {
        "number": "27",
        "name": "ATLANTIS ",
        "category": "doomed"
    },
    {
        "number": "28",
        "name": "SHAM ",
        "category": "doomed"
    },
    {
        "number": "29",
        "name": "HEAVENLY ",
        "category": "doomed"
    },
    {
        "number": "30",
        "name": "ANGELIC ",
        "category": "doomed"
    },
    {
        "number": "31",
        "name": "RIO ",
        "category": "football"
    },
    {
        "number": "32",
        "name": "DEJA ",
        "category": "France"
    },
    {
        "number": "33",
        "name": "BRITTANY ",
        "category": "France"
    },
    {
        "number": "34",
        "name": "XENA ",
        "category": "geek"
    },
    {
        "number": "35",
        "name": "SARON ",
        "category": "geek"
    },
    {
        "number": "36",
        "name": "TIRION ",
        "category": "geek"
    },
    {
        "number": "37",
        "name": "IO ",
        "category": "geek"
    },
    {
        "number": "38",
        "name": "DAENERYS ",
        "category": "geek"
    },
    {
        "number": "39",
        "name": "PERL ",
        "category": "geek"
    },
    {
        "number": "40",
        "name": "META ",
        "category": "geek"
    },
    {
        "number": "41",
        "name": "EMMY ",
        "category": "hollywood"
    },
    {
        "number": "42",
        "name": "INDIANA ",
        "category": "hollywood"
    },
    {
        "number": "43",
        "name": "INDIANNA ",
        "category": "hollywood"
    },
    {
        "number": "44",
        "name": "MONROE ",
        "category": "hollywood"
    },
    {
        "number": "45",
        "name": "JOLIE ",
        "category": "hollywood"
    },
    {
        "number": "46",
        "name": "TATUM ",
        "category": "hollywood"
    },
    {
        "number": "47",
        "name": "MIRREN ",
        "category": "hollywood"
    },
    {
        "number": "48",
        "name": "DYNASTY ",
        "category": "hollywood"
    },
    {
        "number": "49",
        "name": "DALLAS ",
        "category": "hollywood"
    },
    {
        "number": "50",
        "name": "RIPLEY ",
        "category": "hollywood"
    },
    {
        "number": "51",
        "name": "REN ",
        "category": "hollywood"
    },
    {
        "number": "52",
        "name": "DIAZ ",
        "category": "hollywood"
    },
    {
        "number": "53",
        "name": "ITALIA ",
        "category": "Italy"
    },
    {
        "number": "54",
        "name": "SI ",
        "category": "Italy"
    },
    {
        "number": "55",
        "name": "DIVA ",
        "category": "Italy"
    },
    {
        "number": "56",
        "name": "DOLCE ",
        "category": "Italy"
    },
    {
        "number": "57",
        "name": "MIO ",
        "category": "Italy"
    },
    {
        "number": "58",
        "name": "VENICE ",
        "category": "Italy"
    },
    {
        "number": "59",
        "name": "AMORE ",
        "category": "Italy"
    },
    {
        "number": "60",
        "name": "DEA ",
        "category": "law enforcement"
    },
    {
        "number": "61",
        "name": "CIA ",
        "category": "law enforcement"
    },
    {
        "number": "62",
        "name": "STARR ",
        "category": "music"
    },
    {
        "number": "63",
        "name": "JAZMYN ",
        "category": "music"
    },
    {
        "number": "64",
        "name": "JAZZ ",
        "category": "music"
    },
    {
        "number": "65",
        "name": "JUDE ",
        "category": "music"
    },
    {
        "number": "66",
        "name": "LENNON ",
        "category": "music"
    },
    {
        "number": "67",
        "name": "JAZZLYN ",
        "category": "music"
    },
    {
        "number": "68",
        "name": "OLYMPIA ",
        "category": "olympics"
    },
    {
        "number": "69",
        "name": "ENNIS ",
        "category": "olympics"
    },
    {
        "number": "70",
        "name": "KYRIE ",
        "category": "random bible page"
    },
    {
        "number": "71",
        "name": "HEAVEN ",
        "category": "random bible page"
    },
    {
        "number": "72",
        "name": "AMEN ",
        "category": "random bible page"
    },
    {
        "number": "73",
        "name": "HALO ",
        "category": "random bible page"
    },
    {
        "number": "74",
        "name": "MAGI ",
        "category": "random bible page"
    },
    {
        "number": "75",
        "name": "BETHLEHEM ",
        "category": "random bible page"
    },
    {
        "number": "76",
        "name": "ZION ",
        "category": "random bible page"
    },
    {
        "number": "77",
        "name": "NASREEN ",
        "category": "random bible page"
    },
    {
        "number": "78",
        "name": "EVERLY ",
        "category": "rock"
    },
    {
        "number": "79",
        "name": "DYLAN ",
        "category": "rock"
    },
    {
        "number": "80",
        "name": "PRESLEY ",
        "category": "rock"
    },
    {
        "number": "81",
        "name": "NIRVANA ",
        "category": "rock"
    },
    {
        "number": "82",
        "name": "SANTANA ",
        "category": "rock"
    },
    {
        "number": "83",
        "name": "JOVI ",
        "category": "rock"
    },
    {
        "number": "84",
        "name": "RUBY-TUESDAY ",
        "category": "rock"
    },
    {
        "number": "85",
        "name": "SUMMER-ROSE ",
        "category": "season/vegetation"
    },
    {
        "number": "86",
        "name": "WINTER-ROSE ",
        "category": "season/vegetation"
    },
    {
        "number": "87",
        "name": "AUTUMN-WILLOW ",
        "category": "season/vegetation"
    },
    {
        "number": "88",
        "name": "TOBY ",
        "category": "tomboy"
    },
    {
        "number": "89",
        "name": "RUDY ",
        "category": "tomboy"
    },
    {
        "number": "90",
        "name": "MAN ",
        "category": "tomboy"
    },
    {
        "number": "91",
        "name": "LOUIE ",
        "category": "tomboy"
    },
    {
        "number": "92",
        "name": "EVAN ",
        "category": "tomboy"
    },
    {
        "number": "93",
        "name": "RORY ",
        "category": "tomboy"
    },
    {
        "number": "94",
        "name": "PIP ",
        "category": "tomboy"
    },
    {
        "number": "95",
        "name": "LAUREL ",
        "category": "vegetation"
    },
    {
        "number": "96",
        "name": "PETAL ",
        "category": "vegetation"
    },
    {
        "number": "97",
        "name": "PEONY ",
        "category": "vegetation"
    },
    {
        "number": "98",
        "name": "MYRTLE ",
        "category": "vegetation"
    },
    {
        "number": "99",
        "name": "BRACKEN ",
        "category": "vegetation"
    },
    {
        "number": "100",
        "name": "MAPLE ",
        "category": "vegetation"
    },
    {
        "number": "101",
        "name": "MAIZE ",
        "category": "vegetation"
    },
    {
        "number": "102",
        "name": "AMARYLLIS ",
        "category": "vegetation"
    },
    {
        "number": "103",
        "name": "SNOW ",
        "category": "weather"
    },
    {
        "number": "104",
        "name": "MISTY ",
        "category": "weather"
    },
    {
        "number": "105",
        "name": "RAIN ",
        "category": "weather"
    },
    {
        "number": "106",
        "name": "SOL ",
        "category": "weather"
    },
    {
        "number": "107",
        "name": "SOLEIL ",
        "category": "weather"
    },
    {
        "number": "108",
        "name": "OCEAN ",
        "category": "geography"
    },
    {
        "number": "109",
        "name": "RIVER ",
        "category": "geography"
    },
    {
        "number": "110",
        "name": "DIVINE ",
        "category": "hyperbole"
    },
    {
        "number": "111",
        "name": "TEMPERANCE ",
        "category": "doomed"
    },
    {
        "number": "112",
        "name": "MIRACLE ",
        "category": "hyperbole"
    },
    {
        "number": "113",
        "name": "LADY ",
        "category": "redundant"
    },
    {
        "number": "114",
        "name": "GLORY ",
        "category": "hyperbole"
    },
    {
        "number": "115",
        "name": "PEACE ",
        "category": "hyperbole"
    },
    {
        "number": "116",
        "name": "OPAL ",
        "category": "rich"
    },
    {
        "number": "117",
        "name": "MARVELLOUS ",
        "category": "hyperbole"
    },
    {
        "number": "118",
        "name": "LUX ",
        "category": "brand"
    },
    {
        "number": "119",
        "name": "KITANA ",
        "category": "weapon"
    },
    {
        "number": "120",
        "name": "ECHO ",
        "category": "music"
    },
    {
        "number": "121",
        "name": "VICTORY ",
        "category": "hyperbole"
    },
    {
        "number": "122",
        "name": "UNIQUE ",
        "category": "redundant"
    },
    {
        "number": "123",
        "name": "TREASURE ",
        "category": "hyperbole"
    },
    {
        "number": "124",
        "name": "PURITY ",
        "category": "doomed"
    },
    {
        "number": "125",
        "name": "LOVEDAY ",
        "category": "hippy"
    },
    {
        "number": "126",
        "name": "CYAN ",
        "category": "colour"
    },
    {
        "number": "127",
        "name": "BOADICEA ",
        "category": "royal"
    },
    {
        "number": "128",
        "name": "YUMI ",
        "category": "confusing"
    },
    {
        "number": "129",
        "name": "QUEEN ",
        "category": "royal"
    },
    {
        "number": "130",
        "name": "NON ",
        "category": "confusing"
    },
    {
        "number": "131",
        "name": "HAVANAH ",
        "category": "geography"
    },
    {
        "number": "132",
        "name": "GLORIOUS ",
        "category": "hyperbole"
    },
    {
        "number": "133",
        "name": "DUCHESS ",
        "category": "royal"
    },
    {
        "number": "134",
        "name": "VELVET ",
        "category": "confusing"
    },
    {
        "number": "135",
        "name": "SHY ",
        "category": "confusing"
    },
    {
        "number": "136",
        "name": "SHARN ",
        "category": "innovative spelling"
    },
    {
        "number": "137",
        "name": "ROUX ",
        "category": "France"
    },
    {
        "number": "138",
        "name": "QI ",
        "category": "hippy"
    },
    {
        "number": "139",
        "name": "PROMISE ",
        "category": "confusing"
    },
    {
        "number": "140",
        "name": "LUMEN ",
        "category": "geek"
    },
    {
        "number": "141",
        "name": "LILIBET ",
        "category": "royal"
    },
    {
        "number": "142",
        "name": "LAMA ",
        "category": "confusing"
    },
    {
        "number": "143",
        "name": "LA' ",
        "category": "confusing"
    },
    {
        "number": "144",
        "name": "KOKO ",
        "category": "doomed"
    },
    {
        "number": "145",
        "name": "KIT ",
        "category": "tomboy"
    },
    {
        "number": "146",
        "name": "HARLEM ",
        "category": "geography"
    },
    {
        "number": "147",
        "name": "FEDORA ",
        "category": "confusing"
    },
    {
        "number": "148",
        "name": "CHARM ",
        "category": "hyperbole"
    },
    {
        "number": "149",
        "name": "ANNES ",
        "category": "innovative spelling"
    },
    {
        "number": "150",
        "name": "AMELIA-ELIZABETH ",
        "category": "long"
    },
    {
        "number": "151",
        "name": "ECHO ",
        "category": "abstract"
    },
    {
        "number": "152",
        "name": "QI ",
        "category": "abstract"
    },
    {
        "number": "153",
        "name": "PROMISE ",
        "category": "abstract"
    },
    {
        "number": "154",
        "name": "LAMA ",
        "category": "animal"
    },
    {
        "number": "155",
        "name": "KIT ",
        "category": "animal"
    },
    {
        "number": "156",
        "name": "STARR ",
        "category": "beatles"
    },
    {
        "number": "157",
        "name": "JUDE ",
        "category": "beatles"
    },
    {
        "number": "158",
        "name": "LENNON ",
        "category": "beatles"
    },
    {
        "number": "159",
        "name": "TEMPERANCE ",
        "category": "booze"
    },
    {
        "number": "160",
        "name": "OPAL ",
        "category": "car"
    },
    {
        "number": "161",
        "name": "REN ",
        "category": "cartoon"
    },
    {
        "number": "162",
        "name": "DISNEY ",
        "category": "childish"
    },
    {
        "number": "163",
        "name": "YUMI ",
        "category": "childish"
    },
    {
        "number": "164",
        "name": "LILIBET ",
        "category": "childish"
    },
    {
        "number": "165",
        "name": "CHANEL ",
        "category": "clothes"
    },
    {
        "number": "166",
        "name": "DIOR ",
        "category": "clothes"
    },
    {
        "number": "167",
        "name": "OAKLEY ",
        "category": "clothes"
    },
    {
        "number": "168",
        "name": "VOGUE ",
        "category": "clothes"
    },
    {
        "number": "169",
        "name": "SHAM ",
        "category": "confusing"
    },
    {
        "number": "170",
        "name": "DEA ",
        "category": "confusing"
    },
    {
        "number": "171",
        "name": "CIA ",
        "category": "confusing"
    },
    {
        "number": "172",
        "name": "MAN ",
        "category": "confusing"
    },
    {
        "number": "173",
        "name": "BRACKEN ",
        "category": "confusing"
    },
    {
        "number": "174",
        "name": "CRUZ ",
        "category": "football"
    },
    {
        "number": "175",
        "name": "BROOKE-LYNN ",
        "category": "football"
    },
    {
        "number": "176",
        "name": "NON ",
        "category": "France"
    },
    {
        "number": "177",
        "name": "RIPLEY ",
        "category": "geek"
    },
    {
        "number": "178",
        "name": "LUX ",
        "category": "geek"
    },
    {
        "number": "179",
        "name": "LADY ",
        "category": "gender"
    },
    {
        "number": "180",
        "name": "BRITTANY ",
        "category": "geography"
    },
    {
        "number": "181",
        "name": "BETHLEHEM ",
        "category": "geography"
    },
    {
        "number": "182",
        "name": "RIO ",
        "category": "gladiators"
    },
    {
        "number": "183",
        "name": "INDIANA ",
        "category": "hero"
    },
    {
        "number": "184",
        "name": "ENNIS ",
        "category": "hero"
    },
    {
        "number": "185",
        "name": "BOADICEA ",
        "category": "history"
    },
    {
        "number": "186",
        "name": "VEGA ",
        "category": "hollywood"
    },
    {
        "number": "187",
        "name": "LOLITA ",
        "category": "hollywood"
    },
    {
        "number": "188",
        "name": "SARON ",
        "category": "hollywood"
    },
    {
        "number": "189",
        "name": "TIRION ",
        "category": "hollywood"
    },
    {
        "number": "190",
        "name": "DAENERYS ",
        "category": "hollywood"
    },
    {
        "number": "191",
        "name": "HEAVENLY ",
        "category": "hyperbole"
    },
    {
        "number": "192",
        "name": "ANGELIC ",
        "category": "hyperbole"
    },
    {
        "number": "193",
        "name": "SUMMER-ROSE ",
        "category": "hyphen"
    },
    {
        "number": "194",
        "name": "WINTER-ROSE ",
        "category": "hyphen"
    },
    {
        "number": "195",
        "name": "AUTUMN-WILLOW ",
        "category": "hyphen"
    },
    {
        "number": "196",
        "name": "AMELIA-ELIZABETH ",
        "category": "hyphen"
    },
    {
        "number": "197",
        "name": "PERL ",
        "category": "innovative spelling"
    },
    {
        "number": "198",
        "name": "INDIANNA ",
        "category": "innovative spelling"
    },
    {
        "number": "199",
        "name": "JAZMYN ",
        "category": "innovative spelling"
    },
    {
        "number": "200",
        "name": "JAZZLYN ",
        "category": "innovative spelling"
    },
    {
        "number": "201",
        "name": "UNIQUE ",
        "category": "irony"
    },
    {
        "number": "202",
        "name": "CAPRI ",
        "category": "Italy"
    },
    {
        "number": "203",
        "name": "PERDITA ",
        "category": "Italy"
    },
    {
        "number": "204",
        "name": "HARLI ",
        "category": "motorbike"
    },
    {
        "number": "205",
        "name": "EVERLY ",
        "category": "music"
    },
    {
        "number": "206",
        "name": "DYLAN ",
        "category": "music"
    },
    {
        "number": "207",
        "name": "PRESLEY ",
        "category": "music"
    },
    {
        "number": "208",
        "name": "NIRVANA ",
        "category": "music"
    },
    {
        "number": "209",
        "name": "SANTANA ",
        "category": "music"
    },
    {
        "number": "210",
        "name": "JOVI ",
        "category": "music"
    },
    {
        "number": "211",
        "name": "RUBY-TUESDAY ",
        "category": "music"
    },
    {
        "number": "212",
        "name": "EOS ",
        "category": "myth"
    },
    {
        "number": "213",
        "name": "ISIS ",
        "category": "myth"
    },
    {
        "number": "214",
        "name": "ATLANTIS ",
        "category": "myth"
    },
    {
        "number": "215",
        "name": "XENA ",
        "category": "myth"
    },
    {
        "number": "216",
        "name": "IO ",
        "category": "myth"
    },
    {
        "number": "217",
        "name": "OLYMPIA ",
        "category": "myth"
    },
    {
        "number": "218",
        "name": "ANNES ",
        "category": "plural"
    },
    {
        "number": "219",
        "name": "LA`",
        "category": "punctuation"
    },
    {
        "number": "220",
        "name": "TREASURE ",
        "category": "rich"
    },
    {
        "number": "221",
        "name": "ZELDA ",
        "category": "royal"
    },
    {
        "number": "222",
        "name": "SI ",
        "category": "tomboy"
    },
    {
        "number": "223",
        "name": "LOTUS ",
        "category": "vegetation"
    },
    {
        "number": "224",
        "name": "RILEY ",
        "category": "brand"
    },
    {
        "number": "225",
        "name": "PORSCHE ",
        "category": "brand"
    },
    {
        "number": "226",
        "name": "MERCEDEZ ",
        "category": "brand"
    },
    {
        "number": "227",
        "name": "LOTUS ",
        "category": "brand"
    },
    {
        "number": "228",
        "name": "KIA ",
        "category": "brand"
    },
    {
        "number": "229",
        "name": "HARLI ",
        "category": "brand"
    },
    {
        "number": "230",
        "name": "EOS ",
        "category": "brand"
    },
    {
        "number": "231",
        "name": "ELAN ",
        "category": "brand"
    },
    {
        "number": "232",
        "name": "COOPER ",
        "category": "brand"
    },
    {
        "number": "233",
        "name": "CAPRI ",
        "category": "brand"
    },
    {
        "number": "234",
        "name": "SI ",
        "category": "confusing"
    },
    {
        "number": "235",
        "name": "ANNES ",
        "category": "confusing"
    },
    {
        "number": "236",
        "name": "TIRION ",
        "category": "game of thrones"
    },
    {
        "number": "237",
        "name": "DAENERYS ",
        "category": "game of thrones"
    },
    {
        "number": "238",
        "name": "MAN ",
        "category": "gender"
    },
    {
        "number": "239",
        "name": "VOGUE ",
        "category": "gladiators"
    },
    {
        "number": "240",
        "name": "STARR ",
        "category": "hero"
    },
    {
        "number": "241",
        "name": "BOADICEA ",
        "category": "hero"
    },
    {
        "number": "242",
        "name": "XENA ",
        "category": "hollywood"
    },
    {
        "number": "243",
        "name": "BROOKE-LYNN ",
        "category": "hyphen"
    },
    {
        "number": "244",
        "name": "RUBY-TUESDAY ",
        "category": "rolling stones"
    },
    {
        "number": "245",
        "name": "OLYMPIA ",
        "category": "sport"
    },
    {
        "number": "246",
        "name": "ENNIS ",
        "category": "sport"
    },
    {
        "number": "247",
        "name": "BROOKE-LYNN ",
        "category": "geography"
    },
    {
        "number": "248",
        "name": "RUBY-TUESDAY ",
        "category": "hyphen"
    },
    {
        "number": "249",
        "name": "HARLI ",
        "category": "innovative spelling"
    },
    {
        "number": "250",
        "name": "XENA ",
        "category": "royal"
    },
    {
        "number": "251",
        "name": "BROOKE-LYNN ",
        "category": "innovative spelling"
    },
    {
        "number": "252",
        "name": "BECKHAM ",
        "category": "beckham"
    },
    {
        "number": "253",
        "name": "KRUZ ",
        "category": "beckham"
    },
    {
        "number": "254",
        "name": "CRUZE ",
        "category": "beckham"
    },
    {
        "number": "255",
        "name": "CRUZ ",
        "category": "beckham"
    },
    {
        "number": "256",
        "name": "BROOKLYN ",
        "category": "beckham"
    },
    {
        "number": "257",
        "name": "ROMEO ",
        "category": "beckham"
    },
    {
        "number": "258",
        "name": "DIOR ",
        "category": "brand"
    },
    {
        "number": "259",
        "name": "DIESEL ",
        "category": "brand"
    },
    {
        "number": "260",
        "name": "TIMOTEI ",
        "category": "brand"
    },
    {
        "number": "261",
        "name": "OAKLEE ",
        "category": "brand"
    },
    {
        "number": "262",
        "name": "OAKLEY ",
        "category": "brand"
    },
    {
        "number": "263",
        "name": "VEYRON ",
        "category": "car"
    },
    {
        "number": "264",
        "name": "KIA ",
        "category": "car"
    },
    {
        "number": "265",
        "name": "ASTON-JAMES ",
        "category": "car"
    },
    {
        "number": "266",
        "name": "ALONZO ",
        "category": "car"
    },
    {
        "number": "267",
        "name": "FORD ",
        "category": "car"
    },
    {
        "number": "268",
        "name": "ROYCE ",
        "category": "car"
    },
    {
        "number": "269",
        "name": "LEYLAND ",
        "category": "car"
    },
    {
        "number": "270",
        "name": "HERBIE ",
        "category": "car"
    },
    {
        "number": "271",
        "name": "ASTON ",
        "category": "car"
    },
    {
        "number": "272",
        "name": "BENTLEY ",
        "category": "car"
    },
    {
        "number": "273",
        "name": "COOPER ",
        "category": "car"
    },
    {
        "number": "274",
        "name": "JENSEN ",
        "category": "car"
    },
    {
        "number": "275",
        "name": "MORGAN ",
        "category": "car"
    },
    {
        "number": "276",
        "name": "HARLEY ",
        "category": "car"
    },
    {
        "number": "277",
        "name": "RILEY ",
        "category": "car"
    },
    {
        "number": "278",
        "name": "TONY-JUNIOR ",
        "category": "cockney"
    },
    {
        "number": "279",
        "name": "DUTCH ",
        "category": "cockney"
    },
    {
        "number": "280",
        "name": "DEL ",
        "category": "cockney"
    },
    {
        "number": "281",
        "name": "FRANKIE-J ",
        "category": "cockney"
    },
    {
        "number": "282",
        "name": "JOHNBOY ",
        "category": "cockney"
    },
    {
        "number": "283",
        "name": "MATE ",
        "category": "cockney"
    },
    {
        "number": "284",
        "name": "DANISH ",
        "category": "cockney"
    },
    {
        "number": "285",
        "name": "VINNIE ",
        "category": "cockney"
    },
    {
        "number": "286",
        "name": "RYU ",
        "category": "computer game"
    },
    {
        "number": "287",
        "name": "LINK ",
        "category": "computer game"
    },
    {
        "number": "288",
        "name": "RAIDEN ",
        "category": "computer game"
    },
    {
        "number": "289",
        "name": "MARIO ",
        "category": "computer game"
    },
    {
        "number": "290",
        "name": "THE ",
        "category": "confusing"
    },
    {
        "number": "291",
        "name": "JACK-DANIEL ",
        "category": "confusing"
    },
    {
        "number": "292",
        "name": "PAPA ",
        "category": "confusing"
    },
    {
        "number": "293",
        "name": "MD. ",
        "category": "confusing"
    },
    {
        "number": "294",
        "name": "SUAREZ ",
        "category": "football"
    },
    {
        "number": "295",
        "name": "RAMIREZ ",
        "category": "football"
    },
    {
        "number": "296",
        "name": "DAVID-JAMES ",
        "category": "football"
    },
    {
        "number": "297",
        "name": "CHRISTIANO ",
        "category": "football"
    },
    {
        "number": "298",
        "name": "MESSI ",
        "category": "football"
    },
    {
        "number": "299",
        "name": "XAVI ",
        "category": "football"
    },
    {
        "number": "300",
        "name": "ZIDANE ",
        "category": "football"
    },
    {
        "number": "301",
        "name": "NEON ",
        "category": "future"
    },
    {
        "number": "302",
        "name": "LAZAR ",
        "category": "future"
    },
    {
        "number": "303",
        "name": "LAZER ",
        "category": "future"
    },
    {
        "number": "304",
        "name": "JETSON ",
        "category": "future"
    },
    {
        "number": "305",
        "name": "JET ",
        "category": "future"
    },
    {
        "number": "306",
        "name": "ZEN ",
        "category": "hippy"
    },
    {
        "number": "307",
        "name": "STORM ",
        "category": "hippy"
    },
    {
        "number": "308",
        "name": "OCEAN ",
        "category": "hippy"
    },
    {
        "number": "309",
        "name": "ZEBEDEE ",
        "category": "hippy"
    },
    {
        "number": "310",
        "name": "ZEPHYR ",
        "category": "hippy"
    },
    {
        "number": "311",
        "name": "ROGEN ",
        "category": "hollywood"
    },
    {
        "number": "312",
        "name": "HARLEY-DEAN ",
        "category": "hollywood"
    },
    {
        "number": "313",
        "name": "WESTLEY ",
        "category": "hollywood"
    },
    {
        "number": "314",
        "name": "ROMERO ",
        "category": "hollywood"
    },
    {
        "number": "315",
        "name": "LOXLEY ",
        "category": "hollywood"
    },
    {
        "number": "316",
        "name": "KALLEL ",
        "category": "hollywood"
    },
    {
        "number": "317",
        "name": "TOMMYLEE ",
        "category": "hollywood"
    },
    {
        "number": "318",
        "name": "RIPLEY ",
        "category": "hollywood"
    },
    {
        "number": "319",
        "name": "JESSE-JAMES ",
        "category": "hollywood"
    },
    {
        "number": "320",
        "name": "CAINE ",
        "category": "hollywood"
    },
    {
        "number": "321",
        "name": "KALEL ",
        "category": "hollywood"
    },
    {
        "number": "322",
        "name": "MONROE ",
        "category": "hollywood"
    },
    {
        "number": "323",
        "name": "KAL-EL ",
        "category": "hollywood"
    },
    {
        "number": "324",
        "name": "MAVERICK ",
        "category": "hollywood"
    },
    {
        "number": "325",
        "name": "FOX ",
        "category": "hollywood"
    },
    {
        "number": "326",
        "name": "KEANU ",
        "category": "hollywood"
    },
    {
        "number": "327",
        "name": "ROCKY ",
        "category": "hollywood"
    },
    {
        "number": "328",
        "name": "TOMMY-LEE ",
        "category": "hollywood"
    },
    {
        "number": "329",
        "name": "KEATON ",
        "category": "hollywood"
    },
    {
        "number": "330",
        "name": "RIVER ",
        "category": "hollywood"
    },
    {
        "number": "331",
        "name": "RRON ",
        "category": "innovative spelling"
    },
    {
        "number": "332",
        "name": "MALCOM ",
        "category": "innovative spelling"
    },
    {
        "number": "333",
        "name": "LINCON ",
        "category": "innovative spelling"
    },
    {
        "number": "334",
        "name": "ISREAL ",
        "category": "innovative spelling"
    },
    {
        "number": "335",
        "name": "ADAAM ",
        "category": "innovative spelling"
    },
    {
        "number": "336",
        "name": "LYNCON ",
        "category": "innovative spelling"
    },
    {
        "number": "337",
        "name": "TYGER ",
        "category": "innovative spelling"
    },
    {
        "number": "338",
        "name": "JAXXON ",
        "category": "innovative spelling"
    },
    {
        "number": "339",
        "name": "JAXX ",
        "category": "innovative spelling"
    },
    {
        "number": "340",
        "name": "ALEKS ",
        "category": "innovative spelling"
    },
    {
        "number": "341",
        "name": "DEEN ",
        "category": "innovative spelling"
    },
    {
        "number": "342",
        "name": "AADAM ",
        "category": "innovative spelling"
    },
    {
        "number": "343",
        "name": "ALANS ",
        "category": "innovative spelling"
    },
    {
        "number": "344",
        "name": "TIBER ",
        "category": "Italy"
    },
    {
        "number": "345",
        "name": "ROME ",
        "category": "Italy"
    },
    {
        "number": "346",
        "name": "MILAN ",
        "category": "Italy"
    },
    {
        "number": "347",
        "name": "SUCCESS ",
        "category": "doomed"
    },
    {
        "number": "348",
        "name": "LUCKY ",
        "category": "doomed"
    },
    {
        "number": "349",
        "name": "BERK ",
        "category": "doomed"
    },
    {
        "number": "350",
        "name": "NADIR ",
        "category": "doomed"
    },
    {
        "number": "351",
        "name": "T ",
        "category": "lazy"
    },
    {
        "number": "352",
        "name": "LJ ",
        "category": "lazy"
    },
    {
        "number": "353",
        "name": "J ",
        "category": "lazy"
    },
    {
        "number": "354",
        "name": "TJ ",
        "category": "lazy"
    },
    {
        "number": "355",
        "name": "JJ ",
        "category": "lazy"
    },
    {
        "number": "356",
        "name": "C-JAY ",
        "category": "lazy"
    },
    {
        "number": "357",
        "name": "A ",
        "category": "lazy"
    },
    {
        "number": "358",
        "name": "CJ ",
        "category": "lazy"
    },
    {
        "number": "359",
        "name": "A-JAY ",
        "category": "lazy"
    },
    {
        "number": "360",
        "name": "CEEJAY ",
        "category": "lazy"
    },
    {
        "number": "361",
        "name": "AJ ",
        "category": "lazy"
    },
    {
        "number": "362",
        "name": "TITO ",
        "category": "monster"
    },
    {
        "number": "363",
        "name": "ROMMEL ",
        "category": "monster"
    },
    {
        "number": "364",
        "name": "PTOLEMY ",
        "category": "monster"
    },
    {
        "number": "365",
        "name": "MING ",
        "category": "monster"
    },
    {
        "number": "366",
        "name": "CASTRO ",
        "category": "monster"
    },
    {
        "number": "367",
        "name": "OCTAVIAN ",
        "category": "monster"
    },
    {
        "number": "368",
        "name": "ATILLA ",
        "category": "monster"
    },
    {
        "number": "369",
        "name": "TIBERIUS ",
        "category": "monster"
    },
    {
        "number": "370",
        "name": "KAISER ",
        "category": "monster"
    },
    {
        "number": "371",
        "name": "CHE ",
        "category": "monster"
    },
    {
        "number": "372",
        "name": "KAIN ",
        "category": "monster"
    },
    {
        "number": "373",
        "name": "RHYTHM ",
        "category": "music"
    },
    {
        "number": "374",
        "name": "WOLFGANG ",
        "category": "music"
    },
    {
        "number": "375",
        "name": "LYRIC ",
        "category": "music"
    },
    {
        "number": "376",
        "name": "AMADEUS ",
        "category": "music"
    },
    {
        "number": "377",
        "name": "ORPHEUS ",
        "category": "myth"
    },
    {
        "number": "378",
        "name": "NIMROD ",
        "category": "myth"
    },
    {
        "number": "379",
        "name": "MUSE ",
        "category": "myth"
    },
    {
        "number": "380",
        "name": "ACHILLES ",
        "category": "myth"
    },
    {
        "number": "381",
        "name": "MERLIN ",
        "category": "myth"
    },
    {
        "number": "382",
        "name": "PERSEUS ",
        "category": "myth"
    },
    {
        "number": "383",
        "name": "ZEUS ",
        "category": "myth"
    },
    {
        "number": "384",
        "name": "TROY ",
        "category": "myth"
    },
    {
        "number": "385",
        "name": "MATISSE ",
        "category": "art"
    },
    {
        "number": "386",
        "name": "MICHELANGELO ",
        "category": "art"
    },
    {
        "number": "387",
        "name": "RAFFAEL ",
        "category": "art"
    },
    {
        "number": "388",
        "name": "REAGAN ",
        "category": "president"
    },
    {
        "number": "389",
        "name": "LINCOLN ",
        "category": "president"
    },
    {
        "number": "390",
        "name": "KENNEDY ",
        "category": "president"
    },
    {
        "number": "391",
        "name": "LYNDON ",
        "category": "president"
    },
    {
        "number": "392",
        "name": "KING-DAVID ",
        "category": "random bible page"
    },
    {
        "number": "393",
        "name": "JERICHO ",
        "category": "random bible page"
    },
    {
        "number": "394",
        "name": "GOSPEL ",
        "category": "random bible page"
    },
    {
        "number": "395",
        "name": "SAMPSON ",
        "category": "random bible page"
    },
    {
        "number": "396",
        "name": "LAZARUS ",
        "category": "random bible page"
    },
    {
        "number": "397",
        "name": "AMEN ",
        "category": "random bible page"
    },
    {
        "number": "398",
        "name": "DRE ",
        "category": "rap"
    },
    {
        "number": "399",
        "name": "PHARRELL ",
        "category": "rap"
    },
    {
        "number": "400",
        "name": "JOHN-JACK ",
        "category": "redundant"
    },
    {
        "number": "401",
        "name": "ROYAL ",
        "category": "rich"
    },
    {
        "number": "402",
        "name": "TREASURE ",
        "category": "rich"
    },
    {
        "number": "403",
        "name": "PRECIOUS ",
        "category": "rich"
    },
    {
        "number": "404",
        "name": "STERLING ",
        "category": "rich"
    },
    {
        "number": "405",
        "name": "PROSPER ",
        "category": "rich"
    },
    {
        "number": "406",
        "name": "DIAMOND ",
        "category": "rich"
    },
    {
        "number": "407",
        "name": "RONSON ",
        "category": "music"
    },
    {
        "number": "408",
        "name": "JOVI ",
        "category": "rock"
    },
    {
        "number": "409",
        "name": "JAGGER ",
        "category": "rock"
    },
    {
        "number": "410",
        "name": "ELTON ",
        "category": "rock"
    },
    {
        "number": "411",
        "name": "ABBA ",
        "category": "music"
    },
    {
        "number": "412",
        "name": "SLADE ",
        "category": "rock"
    },
    {
        "number": "413",
        "name": "RAMONE ",
        "category": "rock"
    },
    {
        "number": "414",
        "name": "OZZI ",
        "category": "rock"
    },
    {
        "number": "415",
        "name": "BOWIE ",
        "category": "rock"
    },
    {
        "number": "416",
        "name": "ALEX-JAMES ",
        "category": "rock"
    },
    {
        "number": "417",
        "name": "REEF ",
        "category": "rock"
    },
    {
        "number": "418",
        "name": "JIMI ",
        "category": "rock"
    },
    {
        "number": "419",
        "name": "OZZY ",
        "category": "rock"
    },
    {
        "number": "420",
        "name": "HENDRIX ",
        "category": "rock"
    },
    {
        "number": "421",
        "name": "AXEL ",
        "category": "rock"
    },
    {
        "number": "422",
        "name": "DEEP ",
        "category": "thinker"
    },
    {
        "number": "423",
        "name": "HORACE ",
        "category": "thinker"
    },
    {
        "number": "424",
        "name": "MILTON ",
        "category": "thinker"
    },
    {
        "number": "425",
        "name": "CATO ",
        "category": "thinker"
    },
    {
        "number": "426",
        "name": "WISDOM ",
        "category": "thinker"
    },
    {
        "number": "427",
        "name": "BREN ",
        "category": "weapon"
    },
    {
        "number": "428",
        "name": "REMINGTON ",
        "category": "weapon"
    },
    {
        "number": "429",
        "name": "MACE ",
        "category": "weapon"
    },
    {
        "number": "430",
        "name": "TALON ",
        "category": "weapon"
    },
    {
        "number": "431",
        "name": "COLT ",
        "category": "weapon"
    },
    {
        "number": "432",
        "name": "SHIV ",
        "category": "weapon"
    },
    {
        "number": "433",
        "name": "ARCHER ",
        "category": "weapon"
    },
    {
        "number": "434",
        "name": "KOHL ",
        "category": "misc"
    },
    {
        "number": "435",
        "name": "HEATHCLIFF ",
        "category": "misc"
    },
    {
        "number": "436",
        "name": "SOUL ",
        "category": "music"
    },
    {
        "number": "437",
        "name": "RANDY ",
        "category": "misc"
    },
    {
        "number": "438",
        "name": "LONDON ",
        "category": "geography"
    },
    {
        "number": "439",
        "name": "VICTORY ",
        "category": "hyperbole"
    },
    {
        "number": "440",
        "name": "MIRACLE ",
        "category": "hyperbole"
    },
    {
        "number": "441",
        "name": "GLORY ",
        "category": "hyperbole"
    },
    {
        "number": "442",
        "name": "DESTINY ",
        "category": "hyperbole"
    },
    {
        "number": "443",
        "name": "PRAISE ",
        "category": "hyperbole"
    },
    {
        "number": "444",
        "name": "FAVOUR ",
        "category": "hyperbole"
    },
    {
        "number": "445",
        "name": "BLESSING ",
        "category": "hyperbole"
    },
    {
        "number": "446",
        "name": "JUSTICE ",
        "category": "hyperbole"
    },
    {
        "number": "447",
        "name": "HENLEY ",
        "category": "geography"
    },
    {
        "number": "448",
        "name": "CHRISTOPHER-JAMES ",
        "category": "long"
    },
    {
        "number": "449",
        "name": "THE ",
        "category": "abstract"
    },
    {
        "number": "450",
        "name": "NADIR ",
        "category": "abstract"
    },
    {
        "number": "451",
        "name": "RHYTHM ",
        "category": "abstract"
    },
    {
        "number": "452",
        "name": "LYRIC ",
        "category": "abstract"
    },
    {
        "number": "453",
        "name": "SOUL ",
        "category": "abstract"
    },
    {
        "number": "454",
        "name": "FOX ",
        "category": "animal"
    },
    {
        "number": "455",
        "name": "TYGER ",
        "category": "animal"
    },
    {
        "number": "456",
        "name": "COLT ",
        "category": "animal"
    },
    {
        "number": "457",
        "name": "JACK-DANIEL ",
        "category": "booze"
    },
    {
        "number": "458",
        "name": "DIESEL ",
        "category": "car"
    },
    {
        "number": "459",
        "name": "BERK ",
        "category": "confusing"
    },
    {
        "number": "460",
        "name": "DEEP ",
        "category": "confusing"
    },
    {
        "number": "461",
        "name": "NIMROD ",
        "category": "doomed"
    },
    {
        "number": "462",
        "name": "BECKHAM ",
        "category": "football"
    },
    {
        "number": "463",
        "name": "KRUZ ",
        "category": "football"
    },
    {
        "number": "464",
        "name": "CRUZE ",
        "category": "football"
    },
    {
        "number": "465",
        "name": "CRUZ ",
        "category": "football"
    },
    {
        "number": "466",
        "name": "BROOKLYN ",
        "category": "football"
    },
    {
        "number": "467",
        "name": "ROMEO ",
        "category": "football"
    },
    {
        "number": "468",
        "name": "NEON ",
        "category": "geek"
    },
    {
        "number": "469",
        "name": "RIPLEY ",
        "category": "geek"
    },
    {
        "number": "470",
        "name": "KAL-EL ",
        "category": "geek"
    },
    {
        "number": "471",
        "name": "DUTCH ",
        "category": "geography"
    },
    {
        "number": "472",
        "name": "DANISH ",
        "category": "geography"
    },
    {
        "number": "473",
        "name": "OCEAN ",
        "category": "geography"
    },
    {
        "number": "474",
        "name": "RIVER ",
        "category": "geography"
    },
    {
        "number": "475",
        "name": "TIBER ",
        "category": "geography"
    },
    {
        "number": "476",
        "name": "JET ",
        "category": "gladiators"
    },
    {
        "number": "477",
        "name": "STORM ",
        "category": "gladiators"
    },
    {
        "number": "478",
        "name": "RYU ",
        "category": "hero"
    },
    {
        "number": "479",
        "name": "LINK ",
        "category": "hero"
    },
    {
        "number": "480",
        "name": "RAIDEN ",
        "category": "hero"
    },
    {
        "number": "481",
        "name": "MARIO ",
        "category": "hero"
    },
    {
        "number": "482",
        "name": "WESTLEY ",
        "category": "hero"
    },
    {
        "number": "483",
        "name": "ACHILLES ",
        "category": "hero"
    },
    {
        "number": "484",
        "name": "PERSEUS ",
        "category": "hero"
    },
    {
        "number": "485",
        "name": "SAMPSON ",
        "category": "hero"
    },
    {
        "number": "486",
        "name": "TITO ",
        "category": "history"
    },
    {
        "number": "487",
        "name": "ROMMEL ",
        "category": "history"
    },
    {
        "number": "488",
        "name": "PTOLEMY ",
        "category": "history"
    },
    {
        "number": "489",
        "name": "CASTRO ",
        "category": "history"
    },
    {
        "number": "490",
        "name": "OCTAVIAN ",
        "category": "history"
    },
    {
        "number": "491",
        "name": "ATILLA ",
        "category": "history"
    },
    {
        "number": "492",
        "name": "TIBERIUS ",
        "category": "history"
    },
    {
        "number": "493",
        "name": "KAISER ",
        "category": "history"
    },
    {
        "number": "494",
        "name": "CHE ",
        "category": "history"
    },
    {
        "number": "495",
        "name": "WOLFGANG ",
        "category": "history"
    },
    {
        "number": "496",
        "name": "AMADEUS ",
        "category": "history"
    },
    {
        "number": "497",
        "name": "TROY ",
        "category": "history"
    },
    {
        "number": "498",
        "name": "MATISSE ",
        "category": "history"
    },
    {
        "number": "499",
        "name": "MICHELANGELO ",
        "category": "history"
    },
    {
        "number": "500",
        "name": "RAFFAEL ",
        "category": "history"
    },
    {
        "number": "501",
        "name": "REAGAN ",
        "category": "history"
    },
    {
        "number": "502",
        "name": "LINCOLN ",
        "category": "history"
    },
    {
        "number": "503",
        "name": "KENNEDY ",
        "category": "history"
    },
    {
        "number": "504",
        "name": "LYNDON ",
        "category": "history"
    },
    {
        "number": "505",
        "name": "JETSON ",
        "category": "hollywood"
    },
    {
        "number": "506",
        "name": "MING ",
        "category": "hollywood"
    },
    {
        "number": "507",
        "name": "TREASURE ",
        "category": "hyperbole"
    },
    {
        "number": "508",
        "name": "PRECIOUS ",
        "category": "hyperbole"
    },
    {
        "number": "509",
        "name": "DIAMOND ",
        "category": "hyperbole"
    },
    {
        "number": "510",
        "name": "ASTON-JAMES ",
        "category": "hyphen"
    },
    {
        "number": "511",
        "name": "TONY-JUNIOR ",
        "category": "hyphen"
    },
    {
        "number": "512",
        "name": "DAVID-JAMES ",
        "category": "hyphen"
    },
    {
        "number": "513",
        "name": "JESSE-JAMES ",
        "category": "hyphen"
    },
    {
        "number": "514",
        "name": "TOMMY-LEE ",
        "category": "hyphen"
    },
    {
        "number": "515",
        "name": "C-JAY ",
        "category": "hyphen"
    },
    {
        "number": "516",
        "name": "A-JAY ",
        "category": "hyphen"
    },
    {
        "number": "517",
        "name": "KING-DAVID ",
        "category": "hyphen"
    },
    {
        "number": "518",
        "name": "JOHN-JACK ",
        "category": "hyphen"
    },
    {
        "number": "519",
        "name": "CHRISTOPHER-JAMES ",
        "category": "hyphen"
    },
    {
        "number": "520",
        "name": "OAKLEE ",
        "category": "innovative spelling"
    },
    {
        "number": "521",
        "name": "LAZAR ",
        "category": "innovative spelling"
    },
    {
        "number": "522",
        "name": "LAZER ",
        "category": "innovative spelling"
    },
    {
        "number": "523",
        "name": "KALLEL ",
        "category": "innovative spelling"
    },
    {
        "number": "524",
        "name": "KALEL ",
        "category": "innovative spelling"
    },
    {
        "number": "525",
        "name": "CEEJAY ",
        "category": "innovative spelling"
    },
    {
        "number": "526",
        "name": "SUAREZ ",
        "category": "monster"
    },
    {
        "number": "527",
        "name": "HARLEY ",
        "category": "motorbikes"
    },
    {
        "number": "528",
        "name": "HARLEY-DEAN ",
        "category": "motorbikes"
    },
    {
        "number": "529",
        "name": "ORPHEUS ",
        "category": "music"
    },
    {
        "number": "530",
        "name": "MUSE ",
        "category": "music"
    },
    {
        "number": "531",
        "name": "DRE ",
        "category": "music"
    },
    {
        "number": "532",
        "name": "PHARRELL ",
        "category": "music"
    },
    {
        "number": "533",
        "name": "JOVI ",
        "category": "music"
    },
    {
        "number": "534",
        "name": "JAGGER ",
        "category": "music"
    },
    {
        "number": "535",
        "name": "ELTON ",
        "category": "music"
    },
    {
        "number": "536",
        "name": "SLADE ",
        "category": "music"
    },
    {
        "number": "537",
        "name": "RAMONE ",
        "category": "music"
    },
    {
        "number": "538",
        "name": "OZZI ",
        "category": "music"
    },
    {
        "number": "539",
        "name": "BOWIE ",
        "category": "music"
    },
    {
        "number": "540",
        "name": "ALEX-JAMES ",
        "category": "music"
    },
    {
        "number": "541",
        "name": "REEF ",
        "category": "music"
    },
    {
        "number": "542",
        "name": "JIMI ",
        "category": "music"
    },
    {
        "number": "543",
        "name": "OZZY ",
        "category": "music"
    },
    {
        "number": "544",
        "name": "HENDRIX ",
        "category": "music"
    },
    {
        "number": "545",
        "name": "AXEL ",
        "category": "music"
    },
    {
        "number": "546",
        "name": "ALANS ",
        "category": "plural"
    },
    {
        "number": "547",
        "name": "LINCON ",
        "category": "president"
    },
    {
        "number": "548",
        "name": "LYNCON ",
        "category": "president"
    },
    {
        "number": "549",
        "name": "MD. ",
        "category": "punctuation"
    },
    {
        "number": "550",
        "name": "KAIN ",
        "category": "random bible page"
    },
    {
        "number": "551",
        "name": "ROYAL ",
        "category": "royal"
    },
    {
        "number": "552",
        "name": "ALONZO ",
        "category": "sport"
    },
    {
        "number": "553",
        "name": "RAMIREZ ",
        "category": "sport"
    },
    {
        "number": "554",
        "name": "CHRISTIANO ",
        "category": "sport"
    },
    {
        "number": "555",
        "name": "MESSI ",
        "category": "sport"
    },
    {
        "number": "556",
        "name": "XAVI ",
        "category": "sport"
    },
    {
        "number": "557",
        "name": "ZIDANE ",
        "category": "sport"
    },
    {
        "number": "558",
        "name": "HARLEY-DEAN ",
        "category": "brand"
    },
    {
        "number": "559",
        "name": "JETSON ",
        "category": "cartoon"
    },
    {
        "number": "560",
        "name": "RYU ",
        "category": "geek"
    },
    {
        "number": "561",
        "name": "LINK ",
        "category": "geek"
    },
    {
        "number": "562",
        "name": "RAIDEN ",
        "category": "geek"
    },
    {
        "number": "563",
        "name": "MARIO ",
        "category": "geek"
    },
    {
        "number": "564",
        "name": "DIESEL ",
        "category": "gladiators"
    },
    {
        "number": "565",
        "name": "FOX ",
        "category": "gladiators"
    },
    {
        "number": "566",
        "name": "RIPLEY ",
        "category": "hero"
    },
    {
        "number": "567",
        "name": "JIMI ",
        "category": "hero"
    },
    {
        "number": "568",
        "name": "HENDRIX ",
        "category": "hero"
    },
    {
        "number": "569",
        "name": "JACK-DANIEL ",
        "category": "hyphen"
    },
    {
        "number": "570",
        "name": "KAL-EL ",
        "category": "hyphen"
    },
    {
        "number": "571",
        "name": "ALEX-JAMES ",
        "category": "hyphen"
    },
    {
        "number": "572",
        "name": "KAIN ",
        "category": "innovative spelling"
    },
    {
        "number": "573",
        "name": "JAGGER ",
        "category": "rolling stones"
    },
    {
        "number": "574",
        "name": "BECKHAM ",
        "category": "sport"
    },
    {
        "number": "575",
        "name": "SUAREZ ",
        "category": "sport"
    },
    {
        "number": "576",
        "name": "DAVID-JAMES ",
        "category": "sport"
    },
    {
        "number": "577",
        "name": "STORM ",
        "category": "weather"
    }
];
return edges;
}