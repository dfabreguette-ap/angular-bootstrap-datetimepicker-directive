'use strict'
angular.module('datetimepicker', [])

.provider('datetimepicker', ->
  default_options = {focusOnShow: false}

  @setOptions = (options) ->
    default_options = options
    return

  @$get = ->
    getOptions: ->
      default_options

  return

).directive 'dateTimePicker', ($timeout, datetimepicker) ->
    default_options = datetimepicker.getOptions()
    {
      require: '?ngModel'
      restrict: 'AE'
      scope: datetimepickerOptions: '@'

      link: ($scope, $element, $attrs, ngModelCtrl) ->
        passed_in_options = $scope.$eval($attrs.datetimepickerOptions)
        options = jQuery.extend({}, default_options, passed_in_options)

        # Prevents from bubbling issue
        $($element).on 'click', (e) ->
          e.stopPropagation()
          return false

        setPickerValue = ->
          date = options.defaultDate or null
          if ngModelCtrl and ngModelCtrl.$viewValue
            date = ngModelCtrl.$viewValue
          $element.data('DateTimePicker').date date
          return

        $element.on('dp.change', (e) ->
          if ngModelCtrl
            $timeout ->
              ngModelCtrl.$setViewValue e.target.value
              return
          return
        ).datetimepicker options


        if ngModelCtrl

          ngModelCtrl.$render = ->
            setPickerValue()
            return

        $timeout ->
          setPickerValue()
        return

    }
