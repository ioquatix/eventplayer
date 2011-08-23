
(function($){
	$.eventPlayer = {};

	$.eventPlayer.defaultOptions = {
		show: function(eventPlayer, event, direction) {
			$(event.segment.element).slideDown();
		},
		hide: function(eventPlayer, event, direction) {
			$(event.segment.element).slideUp();
		},
		
		// Return a jQuery array of subtitle elements.
		subtitles: function(videoElement) {
			return $(videoElement).next('.subtitles').children();
		},
		
		// Given one of the subtitle elements, return a segment.
		segment: function(videoElement, subtitleElement) {
			var segment = EventPlayer.Segments.getTimeFromElement(subtitleElement);
			
			return $.extend({
				show: this.show,
				hide: this.hide,
				element: subtitleElement,
			}, segment);
		}
	}

	var EventPlayerDataKey = 'eventPlayer';

	//	var eventPlayer = $('.video').eventPlayer();
	$.fn.eventPlayer = function(options) {
		options = $.extend({}, $.eventPlayer.defaultOptions, options);

		// Connect the video event to the audio/video timeupdate event.
		return this.each(function() {
			if (!$(this).data(EventPlayerDataKey)) {
				var eventPlayer = new EventPlayer(options);
			
				eventPlayer.connect(this);
			
				$(this).data(EventPlayerDataKey, eventPlayer);
			}
		});
	}
	
	$.fn.subtitles = function(options) {
		options = $.extend({}, $.eventPlayer.defaultOptions, options);

		return this.each(function() {
			var eventPlayer = $(this).data('eventPlayer'),
				subtitles = options.subtitles(this),
				videoElement = this,
				segments = new EventPlayer.Segments();

			subtitles.each(function() {
				segments.add(options.segment(videoElement, this));
			});

			eventPlayer.addEvents(segments.events);
		});
	}
})(jQuery);

