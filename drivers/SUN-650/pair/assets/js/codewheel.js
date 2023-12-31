/* eslint-disable strict */
(function($) {
  $.fn.codewheel = function(options) {
    const self = this;
    const seriesItemElements = [];

    options = $.extend({
      series: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P'],
      selectedIndex: 0,
      quadrants: [],
      mapOddToDot: true,
      onChange: null,
    }, options);

    self
      .addClass('codewheel')
      .append('<div class="series"></div>')
      .append('<div class="quadrants"></div>')
      .append('<div class="codewheel-inner"></div>')
      .find('.codewheel-inner')
      .append('<div class="arrow"></div>');

    if (options.mapOddToDot) {
      options.series = options.series.map((seriesItem, i) => {
        if (i % 2 === 1) return '&bull;';
        return seriesItem;
      });
    }

    if (options.quadrants.length !== 4) options.quadrants = [];

    options.quadrants.forEach((quadrantItem, i, arr) => {
      const quadrantItemEl = $(`<div class="item">${quadrantItem}</div>`);

      self
        .find('.quadrants')
        .append(quadrantItemEl);
    });

    self.setCodewheelIndex = function(index) {
      self._value = index;

      // set active class
      self.find('.series .item.active').removeClass('active');
      $(seriesItemElements[index]).addClass('active');

      let offset = 0;
      if (options.quadrants.length === 4) {
        offset = 14;
      }

      self.find('.codewheel-inner .arrow').css({
        transform: `rotate(${index / options.series.length * 360 + offset}deg)`,
      });
    };

    options.series.forEach((seriesItem, i, arr) => {
      const seriesItemEl = $(`<div class="item"><div class="item-inner">${seriesItem}</div></div>`);
      const percentage = i / arr.length;
      let offset = 0.5 * Math.PI;
      if (options.quadrants.length === 4) {
        offset = 0.425 * Math.PI;
      }

      seriesItemElements.push(seriesItemEl);

      $(seriesItemEl)
        .css({
          top: `${60 + Math.sin(percentage * 2 * Math.PI - offset) * 60}px`,
          left: `${60 + Math.cos(percentage * 2 * Math.PI - offset) * 60}px`,
        });


      $(seriesItemEl).click(() => {
        self.setCodewheelIndex(i);

        if (typeof options.onChange === 'function') {
          options.onChange.call(self, self.getValue());
        }
      });

      self
        .find('.series')
        .append(seriesItemEl);
    });

    self.setCodewheelIndex(options.selectedIndex);

    self._value = 0;

    self.getValue = function() {
      return self._value;
    };

    return self;
  };
}(jQuery));
