var request = require("request")
var jsforce = require('jsforce');
var nforce = require('nforce');
var q = require('q')
var _ = require('underscore')


var org = nforce.createConnection({
  clientId: '3MVG9FG3dvS828gKYna4zEZF7gY056ZjtUXzIWLNOZ_Ybs7_rZHh3yPtLi0hztcwtKWcKUz.6H7j1jGLNTAFt',
  clientSecret: '4033454936191911844',
  redirectUri: 'http://localhost:4321/api/sf/callback',
  mode: 'single',
  username:'blitzappintegration@deloitte.com.blitzapp.lghexpdev',
  password: "deloitte12345#",
  apiVersion: 'v42.0',
  environment: 'sandbox',
});
var username = 'blitzappintegration@deloitte.com.blitzapp.lghexpdev'
var password =  "deloitte12345#"
//var conn = require("./sfconnect_service")
module.exports.checkPanelistEmail = function(req,res){
	  var email_pattern = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	  var email = req.params.emailid

	if(!email_pattern.test(email)){
		res.status(400);
		res.send({message:"Please provide valid emailid"})
	}else{
	var securityToken = null
	org.authenticate({ username:username, password:password}, function(err, resp){
	  // the oauth object was stored in the connection object
	  	var q = "select name,id,Upcoming_Blitz__c,Email__c  from Capability_Personnel__c where Email__c = '"+email+"' AND Active__c = TRUE ";
	  	return org.query({ query: q }, function(err, resp){
	  		if(err){
	  			res.status(500)
	  			res.send({"message":"Some thing went wrong","error":err})
	  		}else{
	  			res.status(200)
	  			res.send({data:resp})
	  		}
		});

	})
		
}
}

module.exports.checkUpcomingBlitz= function(req,res){

	var upcomingBlitzId = req.params.upcomingBlitzId
	org.authenticate({ username:username, password:password}, function(err, resp){
	  // the oauth object was stored in the connection object
	  	var q = "Select Id,  Name, Blitz_Planned_Date__c, Blitz_Location__c, Service_Line__c, Service_Line_Capability__c, Blitz_Panelist_Location__c, Telephonic_Locations__c from Blitz_Plan__c where Id = '"+upcomingBlitzId+"'"
	  	return org.query({ query: q }, function(err, resp){
	  		if(err){
	  			res.status(500)
	  			res.send({"message":"Some thing went wrong","error":err})
	  		}else{
	  			res.status(200)
	  			res.send({data:resp})
	  		}
		})
	})
}


module.exports.checkPastBlitz= function(req,res){

	/*Get the list of blitz plans panelist has been part of from below query*/

	var capPersonalId = req.params.capPersonalId
	org.authenticate({ username:username, password:password}, function(err, resp){
	  // the oauth object was stored in the connection object
	  	var q = "Select Blitz_Plan__c  from Blitz_Capability_Personnel__c where Capability_Personnel__c  = '"+capPersonalId+"'"
	  	return org.query({ query: q }, function(err, resp){
	  		if(err){
	  			res.status(500)
	  			res.send({"message":"Some thing went wrong","error":err})
	  		}else{
	  			res.status(200)
	  			res.send({data:resp})
	  		}
		})
	})
}

module.exports.checkBlitzPlanDetails= function(req,res){

	/*Get the list of blitz plans panelist has been part of from below query*/

	var blitzPlanId = req.params.blitzPlanId
	org.authenticate({ username:username, password:password}, function(err, resp){
	  // the oauth object was stored in the connection object
	  	var q = "Select Id,  Name, Blitz_Planned_Date__c, Blitz_Location__c, Service_Line__c, Service_Line_Capability__c, Blitz_Panelist_Location__c, Telephonic_Locations__c from Blitz_Plan__c where Id   = '"+blitzPlanId+"'"
	  	return org.query({ query: q }, function(err, resp){
	  		if(err){
	  			res.status(500)
	  			res.send({"message":"Some thing went wrong","error":err})
	  		}else{
				  res.status(200)
				  let planDetailArr = [];
				  resp.records.map((planDetailItem, i) => {
					  const planDetailObj = {
						"blitzPlanId": planDetailItem._fields.id,
						"blitzPlanName": planDetailItem._fields.name,
						"blitzPlanType": planDetailItem.attributes.type,
						"blitzPlanUrl": planDetailItem.attributes.url,
						"blitzPlannedDate": planDetailItem._fields.blitz_planned_date__c,
						"blitzLocation": planDetailItem._fields.blitz_location__c,
						"serviceLine": planDetailItem._fields.service_line__c,
						"serviceLineCapability": planDetailItem._fields.service_line_capability__c,
						"blitzPanelistLocation": planDetailItem._fields.blitz_panelist_location__c,
						"telephonicLocations": planDetailItem._fields.telephonic_locations__c,
						"blitzChanged": planDetailItem._changed,
						"blitzPrevious": planDetailItem._previous
					  };
					planDetailArr.push(planDetailObj);
				  });
				  const planDetailData = {
					"totalSize": resp.totalSize,
					"done": resp.done,
					"planDetailsList": planDetailArr
				  };
				  console.log('planDetail: ' ,planDetailData);
	  			res.send({data:planDetailData})
	  		}
		 	
		})
	})
}


module.exports.updateBlitzPlanDetails= function(req,res){

	/*Update the blitz plans details
		content-type:application/json
		body:
		{
			"blitzPlanId":"11212",
			"status":"Available"	
		}

	*/

	var blitzPlanId = req.body.blitzPlanId
	var status = req.body.status
	org.authenticate({ username:username, password:password}, function(err, resp){
	  // the oauth object was stored in the connection object

		var q = "Select Id, Status__c from Capability_Personnel__c where id  = '"+blitzPlanId+"'"

		return org.query({ query: q }, function(err, resp){
		  
		  if(!err && resp.records) {
		    var acc = resp.records[0];
		    acc.set('Status__c', status);
		 
		    org.update({ sobject: acc }, function(err, resp){
		      if(!err){
		      	  res.status(200)
			      res.send({"message":"Update was done","Success":true,"response":resp,"update":"DOne"})
		      } else{
	  			res.status(500)
	  			res.send({"message":"Some thing went wrong","error":err})

		      }
		    });
		 
		  }
		});
	})
}

module.exports.getAssignedCandidates= function(req,res){

	/*Get the list of assigned candidate details from below query*/

	const blitzPlanId = req.query.blitzPlanId;
	const panelistId = req.query.panelistId;
	// const blitzPlanId = req.body.blitzPlanId;
	// const panelistId = req.body.panelistId;
	org.authenticate({ username:username, password:password}, function(err, resp){
	  // the oauth object was stored in the connection object
	//   console.log('blitzPlanId: ' ,blitzPlanId);
	//   console.log('panelistId: ' ,panelistId);
		  // var q = "Select Id,  Name, Blitz_Planned_Date__c, Blitz_Location__c, Service_Line__c, Service_Line_Capability__c, Blitz_Panelist_Location__c, Telephonic_Locations__c from Blitz_Plan__c where Id   = '"+blitzPlanId+"'";
		const q = "Select Id, Candidate__r.First_Name__c, Candidate__r.Last_Name__c, Candidate__r.Phone__c, Candidate__r.Email__c , Candidate__r.Capability__c, Candidate__r.Source__c, Versant_Status__c, Stage__c, Candidate__r.Blitz_Date__c from Blitz_Attendees__c where Blitz_Plan__c ='"+blitzPlanId+"' AND ((Status__c ='Candidate Arrived' AND Capability_Panelist_Round_1__c ='"+panelistId+"') OR (Status__c ='Technical Interview-I completed' AND Capability_Panelist_Round_2__c ='"+panelistId+"') OR (Status__c ='Technical Interview-II completed' AND Capability_Panelists_Round_3__c ='"+panelistId+"')) ORDER BY Lastmodifieddate DESC LIMIT 1";  
	  	return org.query({ query: q }, function(err, resp){
	  		if(err){
	  			res.status(500)
	  			res.send({"message":"Some thing went wrong","error":err})
	  		}else{
				//   console.log('res for assigned cand: ' ,resp.records[0]._fields.candidate__r);
				  res.status(200)
				  const responseData = resp.records;
				  let cadidatesListArr = [];
				  responseData.map((candidateItem, i) => {
					  const candidateDetail = {
						  "blitzType": candidateItem.attributes.type,
						  "blitzUrl": candidateItem.attributes.url,
						  "changedState": candidateItem._changed,
						  "PreviousState": candidateItem._previous,
						  "candidateId": candidateItem._fields.id,
						  "candidateType": candidateItem._fields.candidate__r.attributes.type,
						  "candidateUrl": candidateItem._fields.candidate__r.attributes.url,
						  "candidateFirstName": candidateItem._fields.candidate__r.First_Name__c,
						  "candidateLastName": candidateItem._fields.candidate__r.Last_Name__c,
						  "candidatePhoneNum": candidateItem._fields.candidate__r.Phone__c,
						  "candidateEmail": candidateItem._fields.candidate__r.Email__c,
						  "candidateCapability": candidateItem._fields.candidate__r.Capability__c,
						  "candidateSource": candidateItem._fields.candidate__r.Source__c,
						  "candidateBlitzDate": candidateItem._fields.candidate__r.Blitz_Date__c,
						  "candidateVersantStatus": candidateItem._fields.versant_status__c,
						  "candidateId": candidateItem._fields.stage__c
					  };
					cadidatesListArr.push(candidateDetail);
				  });
				  const candidatesList = {
					"totalSize": resp.totalSize,
					"done": resp.done,
					"cadidatesList": cadidatesListArr.length ? cadidatesListArr : []
				  }
	  			res.send({data:candidatesList})
	  		}
		 	
		})
	})
}

module.exports.getPrevRoundFeedback = function(req,res){

	/*Get the previous round feedback details from below query*/

	const attendeeId = req.query.attendeeId;
	const roundNum = req.query.round;
	org.authenticate({ username:username, password:password}, function(err, resp){
	  // the oauth object was stored in the connection object
	  console.log('attendeeId: ' ,attendeeId);
	  console.log('roundNum: ' ,roundNum);
		const q = "Select Id, Blitz_Attendees__c, Capability_Panelist__c, Round__c, Desired_Position__c, Relevant_Months_of_Exp__c, Service_Skills__c, Service_Comments__c, Communication_Skills__c, Communication_Comments__c, Technical_Skills__c, Technical_Skills_Comments__c, Leadership_Skills_Evaluation__c, Management_Skills__c, Management_Comments__c, Interview_Recommendation__c, Overall_Comments__c from Candidate_Assesment__c where  Blitz_Attendees__c ='"+attendeeId+"' and Round__c ='"+roundNum+"'";
	  	return org.query({ query: q }, function(err, resp){
	  		if(err) {
	  			res.status(500)
	  			res.send({"message":"Some thing went wrong","error":err})
	  		} else {
				//   console.log('res for assigned cand: ' ,resp.records[0]._fields);
				  let candidateFeedbackArr = [];
				  resp.records.map(feedbackItem => {
					feedbackItem = feedbackItem._fields;
					  feedbackInfo = {
						"id": feedbackItem.id,
						"blitzAttendees": feedbackItem.blitz_attendees__c,
						"capabilityPanelist": feedbackItem.capability_panelist__c,
						"roundNum": feedbackItem.round__c,
						"desiredPosition": feedbackItem.desired_position__c,
						"relevantMonthsExp": feedbackItem.relevant_months_of_exp__c,
						"serviceSkills": feedbackItem.service_skills__c,
						"serviceComments": feedbackItem.service_comments__c,
						"communicationSkills": feedbackItem.communication_skills__c,
						"communicationComments": feedbackItem.communication_comments__c,
						"technicalSkills": feedbackItem.technical_skills__c,
						"technicalskillsComments": feedbackItem.technical_skills_comments__c,
						"leadershipSkillsEval": feedbackItem.leadership_skills_evaluation__c,
						"managementSkills": feedbackItem.management_skills__c,
						"managementComments": feedbackItem.management_comments__c,
						"interviewRecommendation": feedbackItem.interview_recommendation__c,
						"overallComments": feedbackItem.overall_comments__c
					  }
					candidateFeedbackArr.push(feedbackInfo)
				  });
				  const feedbackResponse = {
					  "totalSize": resp.totalSize,
					  "done": resp.done,
					  "feedbackDetail": candidateFeedbackArr
				  };
	  			res.status(200)
	  			res.send({data:feedbackResponse})
	  		}
		 	
		})
	})
}

module.exports.checkPanelistEmailWithPastBlitz = function(req,res){
	  var email_pattern = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	  var email = req.params.emailid

	if(!email_pattern.test(email)){
		res.status(400);
		res.send({message:"Please provide valid emailid"})
  	}else{
  	var securityToken = null
  	org.authenticate({ username:username, password:password}, function(err, resp){

		var q = "Select Id, Name,Status__c,QR_Link__c,Upcoming_Blitz__c,Upcoming_Blitz__r.Name, Location__c,Upcoming_Blitz__r.Blitz_Planned_Date__c, Upcoming_Blitz__r.Service_Line__c, Upcoming_Blitz__r.Service_Line_Capability__c, Passkey__c, Upcoming_Blitz__r.Blitz_Location__c from Capability_Personnel__c where Email__c = '"+email+"' AND Active__c = TRUE AND RecordTypeId = '012360000003Bkf'";
		return org.query({ query: q }, function(err, resp){
			if(err){
				res.status(500)
				res.send({"message":"Some thing went wrong","error":err})
			}else{
				res.status(200)
				var responseData = {"panalistdetails":resp}
				var capPersonalId = responseData.panalistdetails.records['0']._fields.id
				console.log("-------------id value is-----------",capPersonalId)
				var q = "Select Blitz_Plan__c, Blitz_Plan__r.name,Capability_Personnel__r.Location__c,Blitz_Plan__r.Blitz_Planned_Date__c, Blitz_Plan__r.Service_Line__c, Blitz_Plan__r.Service_Line_Capability__c, Blitz_Plan__r.Blitz_Location__c from Blitz_Capability_Personnel__c where Capability_Personnel__c  = '"+capPersonalId+"'"
				return org.query({ query: q }, function(err, resp){
					if(err){
						res.status(500)
						res.send({"message":"Some thing went wrong","error":err})
					}else{
						res.status(200)
						responseData.pastblitz = resp
						// let upcomingBlitzInfo = responseData.panalistdetails.records[0]._fields;
						let pastBlitzArr = [];
						responseData.pastblitz.records.map(pastblitzItem => {
							pastblitzItem = pastblitzItem._fields;
							let pastblitzObj = {
								"blitzid": pastblitzItem.blitz_plan__c ? pastblitzItem.blitz_plan__c : '',
								"blitztype": pastblitzItem.blitz_plan__r ? pastblitzItem.blitz_plan__r.attributes.type : '',
								"blitzurl": pastblitzItem.blitz_plan__r ? pastblitzItem.blitz_plan__r.attributes.url : '',
								"blitzname": pastblitzItem.blitz_plan__r ? pastblitzItem.blitz_plan__r.Name : '',
								"blitzdate": pastblitzItem.blitz_plan__r ? pastblitzItem.blitz_plan__r.Blitz_Planned_Date__c : '',
								"blitzserviceline": pastblitzItem.blitz_plan__r ? pastblitzItem.blitz_plan__r.Service_Line__c : '',
								"blitzcapability": pastblitzItem.blitz_plan__r ? pastblitzItem.blitz_plan__r.Service_Line_Capability__c : '',
								"blitzlocation": pastblitzItem.blitz_plan__r ? pastblitzItem.blitz_plan__r.Blitz_Location__c: '',
								"blitzcapabilitytype": pastblitzItem.capability_personnel__r ? pastblitzItem.capability_personnel__r.attributes.type : '',
								"blitzcapabilityurl": pastblitzItem.capability_personnel__r ? pastblitzItem.capability_personnel__r.attributes.url : '',
								"blitzcapabilitylocation": pastblitzItem.capability_personnel__r ? pastblitzItem.capability_personnel__r.Location__c : ''
							};
						  pastBlitzArr.push(pastblitzObj);
						});
						const fieldValues = responseData.panalistdetails.records[0]._fields ? responseData.panalistdetails.records[0]._fields : '';
						let upcomingBlitzInfo = [{
							"blitzcode": fieldValues.upcoming_blitz__c ? fieldValues.upcoming_blitz__c : '',
							"type": fieldValues.upcoming_blitz__r ? fieldValues.upcoming_blitz__r.attributes.type : '',
							"url": fieldValues.upcoming_blitz__r ? fieldValues.upcoming_blitz__r.attributes.url : '',
							"blitzname": fieldValues.upcoming_blitz__r ? fieldValues.upcoming_blitz__r.Name : '',
							"blitzplanneddate": fieldValues.upcoming_blitz__r ? fieldValues.upcoming_blitz__r.Blitz_Planned_Date__c : '',
							"serviceline": fieldValues.upcoming_blitz__r ? fieldValues.upcoming_blitz__r.Service_Line__c : '',
							"servicelinecapability": fieldValues.upcoming_blitz__r ? fieldValues.upcoming_blitz__r.Service_Line_Capability__c : '',
							"blitzlocation": fieldValues.upcoming_blitz__r ? fieldValues.upcoming_blitz__r.Blitz_Location__c : ''
						}];
						let panelistEmailObj = {
							 "panelistDetails": {
							    "name": fieldValues.name,
							    "status": fieldValues.status__c,
							  	"totalSize": responseData.panalistdetails.totalSize,
							  	"done": responseData.panalistdetails.done,
							    "passkey": fieldValues.passkey__c,
								"id": fieldValues.id,
								"qrlink": fieldValues.qr_link__c
							 },
							 "upcomingBlitz": upcomingBlitzInfo,
							 "pastBlitz":{  
								"totalSize": responseData.pastblitz.totalSize,
								"records":pastBlitzArr
							 }
					   };
						console.log('response pastblitz: ' ,panelistEmailObj);
						res.send({data:panelistEmailObj})
					}
			  })
			}
	  });

  })
	  
}
}

/* Post call for Assesment Submission */
module.exports.submitAssesment= function(req,res){

	/*Update the blitz plans details
		content-type:application/json
		body:
		{
			"blitzPlanId":"11212",
			"status":"Available"	
		}

	*/
	let reqObj = req.body;
	var assesmentObj = {
		"Blitz_Attendees__c": reqObj.blitzId,
		"Capability_Panelist__c": reqObj.panelistId,
		"Round__c": reqObj.roundNum,
		"Desired_Position__c": reqObj.desiredPos,
		"Relevant_Months_of_Exp__c": reqObj.relMonthsExp,
		"Service_Skills__c": reqObj.serviceSkills,
		"Service_Comments__c": reqObj.serviceComments,
		"Communication_Skills__c": reqObj.commSkills,
		"Communication_Comments__c": reqObj.commcommnets,
		"Technical_Skills__c": reqObj.techSkills,
		"Technical_Skills_Comments__c": reqObj.techSkillsComments,
		"Leadership_Skills_Evaluation__c": reqObj.leadSkillsEval,
		"Management_Skills__c": reqObj.managementSkills,
		"Management_Comments__c": reqObj.managementComments,
		"Interview_Recommendation__c": reqObj.interviewRecom,
		"Overall_Comments__c": reqObj.overallComments,
	};
	org.authenticate({ username:username, password:password}, function(err, resp){
	  // the oauth object was stored in the connection object
	  console.log('req: ' ,req.body);
		// org.insert({ sobject: assesmentObj }, function(err, resp) {
		// 	console.log('inside insert fn');
		// });
	//   var q = "Select Id, Status__c from Capability_Personnel__c where id  = '"+blitzPlanId+"'"

	// 	return org.query({ query: q }, function(err, resp){
		  
	// 	  if(!err && resp.records) {
	// 	    var acc = resp.records[0];
	// 	    acc.set('Status__c', status);
		 
	// 	    org.update({ sobject: acc }, function(err, resp){
	// 	      if(!err){
	// 	      	  res.status(200)
	// 		      res.send({"message":"Update was done","Success":true,"response":resp,"update":"DOne"})
	// 	      } else{
	//   			res.status(500)
	//   			res.send({"message":"Some thing went wrong","error":err})

	// 	      }
	// 	    });
		 
	// 	  }
	// 	});

	})
}
