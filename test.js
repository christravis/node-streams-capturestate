var CaptureState = require('./capturestate.js');

var cs = new CaptureState('TestCluster', 'streams');
cs.on('xml', function(data){
	console.log(data);
});
