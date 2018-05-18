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
  password: "deloitte1234#",
  apiVersion: 'v42.0',
  environment: 'sandbox',
});
var username = 'blitzappintegration@deloitte.com.blitzapp.lghexpdev'
var password =  "deloitte1234#"
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
	  			res.send({data:resp})
	  		}
		 	
		})
	})
}


module.exports.updateBlitzPlanDetails= function(req,res){

	/*Update the blitz plans details*/

	var blitzPlanId = req.params.blitzPlanId
	var status = req.params.status
	org.authenticate({ username:username, password:password}, function(err, resp){
	  // the oauth object was stored in the connection object

		var q = "Select Id, Status__c from Capability_Personnel__c where id  = '"+blitzPlanId+"'"
		return org.query({ query: q }, function(err, resp){
		  
		  if(!err && resp.records) {
		    var acc = resp.records[0];
		    acc.set('Status__c', 'Available');
		 
		    org.update({ sobject: acc }, function(err, resp){
		      if(!err){
		      	  res.send(200)
			      res.send({"message":"Update was done","Success":true,"response":resp})
		      } else{
	  			res.status(500)
	  			res.send({"message":"Some thing went wrong","error":err})

		      }
		    });
		 
		  }
		});

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

	  	var q = "Select Id, Name, Status__c, Upcoming_Blitz__c,Upcoming_Blitz__r.Name, Location__c,Upcoming_Blitz__r.Blitz_Planned_Date__c, Upcoming_Blitz__r.Service_Line__c, Upcoming_Blitz__r.Service_Line_Capability__c, Passkey__c from Capability_Personnel__c where Email__c = '"+email+"' AND Active__c = TRUE AND RecordTypeId = '012360000003Bkf'";
	  	return org.query({ query: q }, function(err, resp){
	  		if(err){
	  			res.status(500)
	  			res.send({"message":"Some thing went wrong","error":err})
	  		}else{
	  			res.status(200)
	  			var responseData = {"panalistdetails":resp}
	  			var capPersonalId = responseData.panalistdetails.records['0']._fields.id
	  			console.log("-------------id value is-----------",capPersonalId)
			  	var q = "Select Blitz_Plan__c, Blitz_Plan__r.name,Capability_Personnel__r.Location__c,Blitz_Plan__r.Blitz_Planned_Date__c, Blitz_Plan__r.Service_Line__c, Blitz_Plan__r.Service_Line_Capability__c   from Blitz_Capability_Personnel__c where Capability_Personnel__c  = '"+capPersonalId+"'"
			  	return org.query({ query: q }, function(err, resp){
			  		if(err){
			  			res.status(500)
			  			res.send({"message":"Some thing went wrong","error":err})
			  		}else{
			  			res.status(200)
			  			responseData.pastblitz = resp
			  			res.send({data:responseData})
			  		}
				})
	  		}
		});

	})
		
}
}