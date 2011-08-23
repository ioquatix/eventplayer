// Copyright (c) 2011 Samuel G. D. Williams. <http://www.oriontransfer.co.nz>
// 
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
// 
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
// 
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

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

