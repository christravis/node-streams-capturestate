var util = require('util');
var events = require('events');
var spawn = require('child_process').spawn;

module.exports = CaptureState;

function CaptureState (cluster, instance) {
	this.cluster = cluster;
	this.instance = instance;
	this.interval = 10;

	events.EventEmitter.call(this);
	this.schedule();
}
util.inherits(CaptureState, events.EventEmitter);

CaptureState.prototype.schedule = function () {
	var self = this;
	setTimeout(function(){
		self.get();
	}, this.interval * 1000);
};

CaptureState.prototype.get = function () {
	var self = this;
	var xml = '';
	var ps = spawn('streamtool', [
		'capturestate',
		'-i',
		this.instance,
		'--select',
		'jobs=all'
	]);
	ps.stdout.on('data', function(data){
		xml += data.toString();
	});
	ps.stderr.on('data', function(data){
		console.error('ERROR running capturestate command: ' + data.toString());
	});
	ps.on('close', function(code){
		self.emit('xml', {
			cluster: self.cluster,
			instance: self.instance,
			xml: xml
		});
		self.schedule();
	});
};
