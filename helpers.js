compare2 = function(prop1, prop2){
	
	var combinedInput1 = [];
	var combinedInput2 = [];
	
	var cont = [];
	var onlyp1 = [];
	var onlyp2 = [];
	var common = [];
	
	$.each(prop1.entities, function(k,entity){
	    combinedInput1.push({'name':entity.text.toLowerCase(),'score':entity.sentiment.score});
	});
	
	
    $.each(prop1.keywords, function(k,keyword){
        add = true;
        for(i in combinedInput1){
            if(keyword.text.toLowerCase()==combinedInput1[i].name){
                add = false;
            }
        }
        if(add){
            combinedInput1.push({'name':keyword.text.toLowerCase(),'score':keyword.sentiment.score});
        } 
	});
	
	
	$.each(prop2.entities, function(k,entity){
	    combinedInput2.push({'name':entity.text.toLowerCase(),'score':entity.sentiment.score});
	});
	
    $.each(prop2.keywords, function(k,keyword){
	    add = true;
        for(i in combinedInput2){
            if(keyword.text.toLowerCase()==combinedInput2[i].name){
                add = false;
            }
        }
        if(add){
            combinedInput2.push({'name':keyword.text.toLowerCase(),'score':keyword.sentiment.score});
        }
	});
	

	for(i in combinedInput1){
		var inOther = false;
		for(j in combinedInput2){
			if(combinedInput1[i].name==combinedInput1[j].name){
				if(combinedInput1[i].score>0 && combinedInput1[j].score > 0){
					common.push({'name':combinedInput1[i].name,'score':(parseFloat(combinedInput1[i].score)+parseFloat(combinedInput1[j].score))});
				} else if (combinedInput1[i].score < 0 && combinedInput1[j].score < 0){
					common.push({'name':combinedInput1[i].text,'score':(parseFloat(combinedInput1[i].score)+parseFloat(combinedInput1[j].score))});
				} else {
					cont.push({'name':combinedInput1[i].text,'score1':combinedInput1[i].score,'score2':combinedInput1[j].score});
				}
				inOther = true;
			}
		}
		
		if(inOther == false){
			onlyp1.push({'name':combinedInput1[i].text,'score1':combinedInput1[i].score});
		}
	}
	
	//janky but test cases are small
	for(i in combinedInput2){
		var inOther = false;
		for(j in combinedInput1){
			if(combinedInput1[i].name==combinedInput1[j].name){
				inOther = true;
			}
		}
		
		if(inOther == false){
			onlyp2.push({'name':combinedInput1[j].text,'score1':combinedInput1[j].score});
		}
	}
	
	return {
	    "common": common,
	    "unique": onlyp1.concat(onlyp2),
	    "cont": cont
	};
}
