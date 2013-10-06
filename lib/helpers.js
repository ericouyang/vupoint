function compare2(prop1, prop2){
	
	var combinedInput1 = [];
	var combinedInput2 = [];
	
	var out = [];
	var cont = [];
	var onlyp1 = [];
	var onlyp2 = [];
	var common = [];
	
	for(entity in prop1.entities){
		combinedInputs1.push({'name':entity.text.toLowerCase(),'score':entity.sentiment.score});
	}	
	
	for(keyword in prop1['keyword']){
		combinedInputs.push({'name':keyword.text.toLowerCase(),'score':keyword.sentiment.score});
	}
	
	for(entity in prop2.entities){
		combinedInputs2.push({'name':entity.text.toLowerCase(),'score':entity.sentiment.score});
	}	
	
	for(keyword in prop2.keyword){
		combinedInputs.push({'name':keyword.text.toLowerCase(),'score':keyword.sentiment.score});
	}
	
	for(i in combinedInput1){
		var inOther = false;
		for(j in combinedInput2){
			if(i.text==j.text){
				if(i.score>0 && j.score > 0){
					common.push({'name':i.text,'score':(i.score+j.score)});
				} else if (i.score < 0 && j.score < 0){
					common.push({'name':i.text,'score':(i.score+j.score)});
				} else {
					cont.push({'name':i.text,'score1':i.score,'score2':j.score});
				}
				inOther = true;
			}
		}
		
		if(inOther == false){
			onlyp1.push({'name':i.text,'score1':i.score});
		}
	}
	
	//janky but test cases are small
	for(i in combinedInput2){
		var inOther = false;
		for(j in combinedInput1){
			if(i.text==j.text){
				inOther = true;
			}
		}
		
		if(inOther == false){
			onlyp2.push({'name':i.text,'score1':i.score});
		}
	}
	
	return out.push(common).push(onlyp1.concat(onlyp2)).push(cont);
}