
EventPlayer = function(options) {
	this.options = options || {};

	this.currentIndex = 0;
	this.events = [];

	this.currentTime = 0.0;
}

EventPlayer.Forwards = 'forwards';
EventPlayer.Backwards = 'backwards';

// Helper function to format time given in seconds as a human readable string.
EventPlayer.formatTime = function(time) {
	var seconds = time % 60;
	time -= seconds;

	if (time > 0) {
		var minutes = time / 60;
		return minutes.toString() + "m " + seconds.toString() + "s";
	} else {
		return seconds.toString() + "s";
	}
}

// An event object must have two parameters: time and callback.
// When that time has passed, the callback will be invoked.
// Argument 2 of the callback is either 'forwards' or 'backwards'
// depending on the state of the travel of the play head.
EventPlayer.prototype.addEvents = function(events) {
	this.events = this.events.concat(events);

	this.events.sort(function(a, b){
		return a.time - b.time;
	});
	
	// If events are added dynamically, we need to determine whether it should be fired or not.
	for (var i = 0; i < events.length; i += 1) {
		
	}
}

EventPlayer.prototype.update = function(newTime) {
	var events = [], direction, index = this.currentIndex;

	if (newTime >= this.currentTime) {
		while (index < this.events.length && this.events[index].time <= newTime) {
			var event = this.events[index];
			event.callback(this, event, EventPlayer.Forwards);
			index += 1;
		}
	} else {
		while (index > 0 && this.events[index-1].time > newTime) {
			index -= 1;
			var event = this.events[index];
			event.callback(this, event, EventPlayer.Backwards);
		}
	}

	this.currentIndex = index;
	this.currentTime = newTime;
}

EventPlayer.prototype.connect = function(element) {
	var eventPlayer = this;
	
	element.addEventListener("timeupdate", function () {
		console.log("time update", element.currentTime);
		eventPlayer.update(element.currentTime);
	});
}

EventPlayer.Segments = function() {
	this.events = [];
}

EventPlayer.Segments.enter = function(eventPlayer, event, direction) {
	if (direction == EventPlayer.Forwards) {
		event.segment.show(eventPlayer, event, direction);
	} else if (direction == EventPlayer.Backwards) {
		event.segment.hide(eventPlayer, event, direction);
	}
}

EventPlayer.Segments.exit = function(eventPlayer, event, direction) {
	if (direction == EventPlayer.Forwards) {
		event.segment.hide(eventPlayer, event, direction);
	} else if (direction == EventPlayer.Backwards) {
		event.segment.show(eventPlayer, event, direction);
	}
}

EventPlayer.Segments.prototype.add = function(segment) {
	if (typeof(segment.enter) != 'undefined') {
		this.events.push({
			time: segment.enter,
			segment: segment,
			callback: EventPlayer.Segments.enter
		});
	}

	if (typeof(segment.exit) != 'undefined') {
		this.events.push({
			time: segment.exit,
			segment: segment,
			callback: EventPlayer.Segments.exit
		});
	}
}

EventPlayer.Segments.parseTime = function(timeString) {
	var time = timeString.split(":"), segment = {};
	
	if (time[0]) {
		var value = parseFloat(time[0]);
		
		if (!isNaN(value))
			segment.enter = value;
	}
	
	if (time[1]) {
		var value = parseFloat(time[1]);
		
		if (!isNaN(value))
			segment.exit = value;
	}
	
	return segment;
}

EventPlayer.Segments.getTimeFromElement = function(element) {
	var timeString = element.getAttribute('time');
	
	if (timeString) {
		return this.parseTime(timeString);
	} else {
		return null;
	}
}
