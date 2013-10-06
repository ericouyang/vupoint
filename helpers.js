compare2 = function(prop1, prop2){

	var combinedInput1 = [];
	var combinedInput2 = [];
	
	var common = [];
	var diff = [];
	var uniq = [];
	
	//Grab the name-sentimentScore pair for each input keyword
	$.each(prop1.keywords, function(k,keyword){
		combinedInput1.push({'name':keyword.text.toLowerCase(),'score':parseFloat(keyword.sentiment.score)});
	});
	
	//Grab the name-sentimentScore pair for each input entity, without name duplicates from keywords
	$.each(prop1.entities, function(k,entity){
        	add = true;
        	$.each(combinedInput1, function(h,named){
			if(entity.text.toLowerCase()==named.name){
				add = false;
			}
		});
        
		if(add){
            		combinedInput1.push({'name':entity.text.toLowerCase(),'score':parseFloat(entity.sentiment.score)});
        	} 
	});
	
	//Likewise for the other input object

	$.each(prop2.keywords, function(k,keyword){
		combinedInput2.push({'name':keyword.text.toLowerCase(),'score':parseFloat(keyword.sentiment.score)});
	});
	
	$.each(prop2.entities, function(k,entity){
		add = true;
		$.each(combinedInput2, function(h, named){
			if(entity.text.toLowerCase()==combinedInput2[i].name){
				add = false;
			}
		}
        	
        	if(add){
            	combinedInput2.push({'name':keyword.text.toLowerCase(),'score':parseFloat(keyword.sentiment.score)});
        	}
	});
	
console.log("OUTPUT FOR STORED COMBINEDINPUT1 AND COMBINEDINPUT2");
console.log(combinedInput1);
console.log(combinedInput2);

//Iterate over each pair of elements to detect common elements
	$.each(combinedInput1, function(k, entry1){
		
		var uniq = true;
		$.each(combinedInput2, function(h, entry2){
			if(entry1.name==entry2.name){
				if((entry1.score>0 && entry2.score>0)||(entry1.score<0 && entry2.score<0){
					sum = entry1.score + entry2.score;
					common.push({'name':entry1.name,'score',sum)});
				} else {
					diff.push({'name':entry1.name,'score1':entry1.score,'score2':entry2.score});
				}
				uniq = false; 
			}
		});
		if(uniq) {
			uniq.push({'name':entry1.name, 'score':entry1.score});
		}
	});

//Get unique elements from second input set
	$.each(combinedInput2, function(k,entry1){
		var uniq = true;
		$.each(common, function(h,entry2){
			if(entry1.name==entry2.name){
				uniq = false;
			}
		}
		if(uniq){
			uniq.push({'name':entry1.name,'score':entry1.score});
		}
	}

	
	return {
	    "common": common,
	    "unique": uniq,
	    "diff": diff
	};
}
