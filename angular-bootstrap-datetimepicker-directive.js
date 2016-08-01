angular.module('DTP', []).provider('dateTimePickerProvider', function() {
  var default_options;
  default_options = {
    focusOnShow: false
  };
  this.setOptions = function(options) {
    default_options = options;
  };
  this.$get = function() {
    return {
      getOptions: function() {
        return default_options;
      }
    };
  };
}).directive('dateTimePicker', function($timeout, dateTimePickerProvider) {
  var default_options;
  default_options = dateTimePickerProvider.getOptions();
  return {
    require: '?ngModel',
    restrict: 'AE',
    scope: {
      datetimepickerOptions: '@'
    },
    link: function($scope, $element, $attrs, ngModelCtrl) {
      var options, passed_in_options, setPickerValue;
      passed_in_options = $scope.$eval($attrs.datetimepickerOptions);
      options = jQuery.extend({}, default_options, passed_in_options);
      $($element).on('click', function(e) {
        e.stopPropagation();
        return false;
      });
      setPickerValue = function() {
        var date;
        date = options.defaultDate || null;
        if (ngModelCtrl && ngModelCtrl.$viewValue) {
          date = ngModelCtrl.$viewValue;
        }
        $element.data('DateTimePicker').date(date);
      };
      $element.on('dp.change', function(e) {
        if (ngModelCtrl) {
          $timeout(function() {
            ngModelCtrl.$setViewValue(e.target.value);
          });
        }
      }).datetimepicker(options);
      if (ngModelCtrl) {
        ngModelCtrl.$render = function() {
          setPickerValue();
        };
      }
      $timeout(function() {
        return setPickerValue();
      });
    }
  };
});
