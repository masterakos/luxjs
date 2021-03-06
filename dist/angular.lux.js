var Lux = {
  VERSION: '0.0.1'
};

angular
  .module('Lux', [])
  .run(function() {
    if (angular.version.major < 1 || angular.version.minor < 3 || angular.version.dot < 1) {
      console.warn('Lux requires AngularJS version higher than 1.3.1');
    }
  });

Lux.Button = {};

Lux.Button.options = {
  type: ['white', 'light', 'dark', 'black', 'link', 'primary', 'info', 'success', 'warning', 'danger'],
  size: ['small', 'medium', 'large'],
  style: ['outlined', 'inverted'],
  state: ['loading', 'active', 'disabled']
};

Lux.Button.directive = function() {
  return {
    restrict: 'EA',
    link: function(scope, element, attrs) {
      element.addClass('button');
      
      var options = Lux.Button.options;
      
      for (var option in options) {
        attrs.$observe(option, (function(option) {
          return function(val) {
            element.removeClass('is-' + options[option].join(' is-'));
            if (options[option].indexOf(val) > -1) {
              element.addClass('is-' + val);
            }
          };
        })(option));
      }
      
      options.state.forEach(function(state) {
        attrs.$observe(state, function(val) {
          element.removeClass('is-' + state);
          if (val === false || val === 'false') {
            element.removeClass('is-' + state);
          } else {
            element.addClass('is-' + state);
          }
        });
      });
    }
  };
};

angular
  .module('Lux')
  .directive('lbutton', Lux.Button.directive)
  .directive('buttonGroup', function() {
    return {
      restrict: 'A',
      scope: {
        selected: '=buttonGroup'
      },
      link: function(scope, element, attrs) {
        
        var btnGroup = angular.element(element).addClass('control has-addons');
        
        angular.forEach(btnGroup.children(), function(button) {
          angular.element(button).on('click', function() {
            scope.selected = this.dataset.value;
            setTimeout(function() { scope.$apply(); }, 0); // force diggest
          });
        });
        
        scope.$watch('selected', function(newVal, oldVal) {
          angular.element(btnGroup[0].querySelector('[data-value="' + oldVal + '"]')).removeClass('is-active');
          angular.element(btnGroup[0].querySelector('[data-value="' + newVal + '"]')).addClass('is-active');
        });
      }
    };
  })

Lux.Tooltip = {};

Lux.Tooltip.directive = function() {
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      var tooltip = angular.element('<div class="tooltip hidden"></div>');
      tooltip.html(attrs.tooltip);
      document.body.appendChild(tooltip[0]);
      
      attrs.$observe('tooltip', function(value) {
        tooltip.html(value);
      });
      
      var placement = attrs.placement || element.data('placement') || 'auto';
      
      function positionTooltip() {
        var rect = element[0].getBoundingClientRect();
        var position = {
          left: rect.left + window.pageXOffset,
          top: rect.top + window.pageYOffset
        };
        var fixedOffset = 3;
        if (placement == 'auto') {
          if (element[0].getBoundingClientRect().top >= tooltip[0].clientHeight) {
            placement = 'top';
          } else {
            placement = 'bottom';
          }
        }
        switch (placement) {
          case 'top':
            position.left += (element[0].offsetWidth / 2) - (tooltip[0].offsetWidth / 2);
            position.top -= tooltip[0].offsetHeight + fixedOffset;
            break;
          case 'bottom':
            position.left += (element[0].offsetWidth / 2) - (tooltip[0].offsetWidth / 2);
            position.top += tooltip[0].offsetHeight + fixedOffset;
            break;
          case 'left':
            position.left -= tooltip[0].offsetWidth + fixedOffset;
            break;
          case 'right':
            position.left += element[0].offsetWidth + fixedOffset;
            break;
        }
        tooltip.css(position);
      }
      
      var trigger = attrs.trigger || element.data('trigger') || 'hover';
      
      element
        .on('mouseenter', function() {
          if (trigger == 'hover') {
            positionTooltip();
            tooltip.removeClass('hidden');
          }
        })
        .on('mouseleave', function() {
          if (trigger =='hover') {
            tooltip.addClass('hidden');
          }
        })
        .on('click', function() {
          if (trigger == 'click') {
            if (tooltip.hasClass('hidden')) {
              positionTooltip();
              tooltip.removeClass('hidden');
            } else {
              tooltip.addClass('hidden');
            }
          }
        });
    }
  };
};

angular
  .module('Lux')
  .directive('tooltip', Lux.Tooltip.directive);
