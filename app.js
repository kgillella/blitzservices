var express        = require( 'express' );
var http           = require( 'http' );
var jsforce        = require('jsforce');
var path = require('path');
var _ = require('underscore');
var bodyParser = require('body-parser')
//var sfconnect = require("./services/sfconnect_service")
var panelLoginService = require("./services/login_service") 

var app = express();

app.set( 'port', process.env.PORT || 4321 );
app.use(bodyParser.json())

app.get('/api/panel/email/:emailid',panelLoginService.checkPanelistEmail);
app.get('/api/panel/blitz/:emailid',panelLoginService.checkPanelistEmailWithPastBlitz);
app.get('/api/blitz/upcoming/:upcomingBlitzId',panelLoginService.checkUpcomingBlitz);
app.get('/api/blitz/past/:capPersonalId',panelLoginService.checkPastBlitz);
app.get('/api/blitz/plandetails/:blitzPlanId',panelLoginService.checkBlitzPlanDetails);
//app.get('/api/blitz/personal/update/:blitzPlanId/status/:status',panelLoginService.updateBlitzPlanDetails);
app.post('/api/blitz/personal/update/status',panelLoginService.updateBlitzPlanDetails);
app.get('/api/blitz/candidates',panelLoginService.getAssignedCandidates);
app.get('/api/blitz/feedback',panelLoginService.getPrevRoundFeedback);
app.post('/api/blitz/submitassesment',panelLoginService.submitAssesment);


app.get('/api/sf/callback',function(req,res){

	res.status(200)
	res.send({message:"Login was done"})
});


http.createServer( app ).listen( app.get( 'port' ), function (){
  console.log( 'Express server listening on port ' + app.get( 'port' ));
});