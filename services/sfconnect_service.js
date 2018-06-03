var jsforce        = require('jsforce');
var nforce = require('nforce');
var org = nforce.createConnection({
  clientId: '3MVG9FG3dvS828gKYna4zEZF7gY056ZjtUXzIWLNOZ_Ybs7_rZHh3yPtLi0hztcwtKWcKUz.6H7j1jGLNTAFt',
  clientSecret: '4033454936191911844',
  redirectUri: 'http://localhost:4321/api/sf/callback',
  mode: 'single'
});



/*var conn = new jsforce.Connection({
// you can change loginUrl to connect to sandbox or prerelease env.
 loginUrl : 'https://test.salesforce.com'
});*/
var username = 'blitzappintegration@deloitte.com.blitzapp.lghexpdev';
//var password = 'yourpassword+securitytoken';
var password = "deloitte12345#"
/*conn.login(username, password, function(err, userInfo) {
if (err) { return console.error(err); }
});*/
org.authenticate({ username: username, password: password}, function(err, resp){
  // the oauth object was stored in the connection object
  if(!err) console.log('Cached Token: ' + org.oauth.access_token)
  	console.log('org data: ' + org)
});



module.exports = org

