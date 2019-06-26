"use strict";

System.register(["app/plugins/sdk", "lodash", "app/core/core", "app/core/utils/kbn", "./color_legend", "./rendering", "./options_editor", "./color_mode_discrete"], function (_export, _context) {
  "use strict";

  var MetricsPanelCtrl, _, contextSrv, kbn, rendering, statusHeatmapOptionsEditor, ColorModeDiscrete, CANVAS, SVG, VALUE_INDEX, TIME_INDEX, panelDefaults, renderer, colorSchemes, colorModes, opacityScales, StatusHeatmapCtrl;

  function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

  function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

  function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

  function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

  function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

  function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

  function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  return {
    setters: [function (_appPluginsSdk) {
      MetricsPanelCtrl = _appPluginsSdk.MetricsPanelCtrl;
    }, function (_lodash) {
      _ = _lodash.default;
    }, function (_appCoreCore) {
      contextSrv = _appCoreCore.contextSrv;
    }, function (_appCoreUtilsKbn) {
      kbn = _appCoreUtilsKbn.default;
    }, function (_color_legend) {}, function (_rendering) {
      rendering = _rendering.default;
    }, function (_options_editor) {
      statusHeatmapOptionsEditor = _options_editor.statusHeatmapOptionsEditor;
    }, function (_color_mode_discrete) {
      ColorModeDiscrete = _color_mode_discrete.ColorModeDiscrete;
    }],
    execute: function () {
      CANVAS = 'CANVAS';
      SVG = 'SVG';
      VALUE_INDEX = 0;
      TIME_INDEX = 1;
      panelDefaults = {
        // aggregate: aggregates.AVG,
        // fragment: fragments.HOUR,
        color: {
          mode: 'spectrum',
          cardColor: '#b4ff00',
          colorScale: 'sqrt',
          exponent: 0.5,
          colorScheme: 'interpolateGnYlRd',
          // discrete mode settings
          defaultColor: '#757575',
          thresholds: [] // manual colors

        },
        cards: {
          cardMinWidth: 5,
          cardVSpacing: 2,
          cardHSpacing: 2,
          cardRound: null
        },
        xAxis: {
          show: true,
          showWeekends: true,
          minBucketWidthToShowWeekends: 4,
          showCrosshair: true,
          labelFormat: '%a %m/%d'
        },
        yAxis: {
          show: true,
          showCrosshair: false
        },
        tooltip: {
          show: true
        },
        legend: {
          show: true
        },
        data: {
          unitFormat: 'short',
          decimals: null
        },
        // how null points should be handled
        nullPointMode: 'as empty',
        yAxisSort: 'metrics',
        highlightCards: true,
        useMax: true
      };
      renderer = CANVAS;
      colorSchemes = [// Diverging
      {
        name: 'Spectral',
        value: 'interpolateSpectral',
        invert: 'always'
      }, {
        name: 'RdYlGn',
        value: 'interpolateRdYlGn',
        invert: 'always'
      }, {
        name: 'GnYlRd',
        value: 'interpolateGnYlRd',
        invert: 'always'
      }, // Sequential (Single Hue)
      {
        name: 'Blues',
        value: 'interpolateBlues',
        invert: 'dark'
      }, {
        name: 'Greens',
        value: 'interpolateGreens',
        invert: 'dark'
      }, {
        name: 'Greys',
        value: 'interpolateGreys',
        invert: 'dark'
      }, {
        name: 'Oranges',
        value: 'interpolateOranges',
        invert: 'dark'
      }, {
        name: 'Purples',
        value: 'interpolatePurples',
        invert: 'dark'
      }, {
        name: 'Reds',
        value: 'interpolateReds',
        invert: 'dark'
      }, // Sequential (Multi-Hue)
      {
        name: 'BuGn',
        value: 'interpolateBuGn',
        invert: 'dark'
      }, {
        name: 'BuPu',
        value: 'interpolateBuPu',
        invert: 'dark'
      }, {
        name: 'GnBu',
        value: 'interpolateGnBu',
        invert: 'dark'
      }, {
        name: 'OrRd',
        value: 'interpolateOrRd',
        invert: 'dark'
      }, {
        name: 'PuBuGn',
        value: 'interpolatePuBuGn',
        invert: 'dark'
      }, {
        name: 'PuBu',
        value: 'interpolatePuBu',
        invert: 'dark'
      }, {
        name: 'PuRd',
        value: 'interpolatePuRd',
        invert: 'dark'
      }, {
        name: 'RdPu',
        value: 'interpolateRdPu',
        invert: 'dark'
      }, {
        name: 'YlGnBu',
        value: 'interpolateYlGnBu',
        invert: 'dark'
      }, {
        name: 'YlGn',
        value: 'interpolateYlGn',
        invert: 'dark'
      }, {
        name: 'YlOrBr',
        value: 'interpolateYlOrBr',
        invert: 'dark'
      }, {
        name: 'YlOrRd',
        value: 'interpolateYlOrRd',
        invert: 'dark'
      }];
      colorModes = ['opacity', 'spectrum', 'discrete'];
      opacityScales = ['linear', 'sqrt'];

      _export("StatusHeatmapCtrl", StatusHeatmapCtrl =
      /*#__PURE__*/
      function (_MetricsPanelCtrl) {
        _inherits(StatusHeatmapCtrl, _MetricsPanelCtrl);

        /** @ngInject */
        function StatusHeatmapCtrl($scope, $injector, $rootScope, timeSrv, annotationsSrv) {
          var _this;

          _classCallCheck(this, StatusHeatmapCtrl);

          _this = _possibleConstructorReturn(this, _getPrototypeOf(StatusHeatmapCtrl).call(this, $scope, $injector));

          _defineProperty(_assertThisInitialized(_this), "onRenderComplete", function (data) {
            _this.graph.chartWidth = data.chartWidth;

            _this.renderingCompleted();
          });

          _defineProperty(_assertThisInitialized(_this), "calculateInterval", function () {
            var panelWidth = Math.ceil($(window).width() * (_this.panel.gridPos.w / 24)); // approximate chartWidth because y axis ticks not rendered yet on first data receive.

            var chartWidth = _.max([panelWidth - 200, panelWidth / 2]);

            var minCardWidth = _this.panel.cards.cardMinWidth;
            var minSpacing = _this.panel.cards.cardHSpacing;
            var maxCardsCount = Math.ceil((chartWidth - minCardWidth) / (minCardWidth + minSpacing));
            var intervalMs;

            var rangeMs = _this.range.to.valueOf() - _this.range.from.valueOf(); // this is minimal interval! kbn.round_interval will lower it.


            intervalMs = _this.discreteHelper.roundIntervalCeil(rangeMs / maxCardsCount); // Calculate low limit of interval

            var lowLimitMs = 1; // 1 millisecond default low limit

            var intervalOverride = _this.panel.interval; // if no panel interval check datasource

            if (intervalOverride) {
              intervalOverride = _this.templateSrv.replace(intervalOverride, _this.panel.scopedVars);
            } else if (_this.datasource && _this.datasource.interval) {
              intervalOverride = _this.datasource.interval;
            }

            if (intervalOverride) {
              if (intervalOverride[0] === '>') {
                intervalOverride = intervalOverride.slice(1);
              }

              lowLimitMs = kbn.interval_to_ms(intervalOverride);
            }

            if (lowLimitMs > intervalMs) {
              intervalMs = lowLimitMs;
            }

            _this.intervalMs = intervalMs;
            _this.interval = kbn.secondsToHms(intervalMs / 1000);
          });

          _defineProperty(_assertThisInitialized(_this), "issueQueries", function (datasource) {
            _this.annotationsPromise = _this.annotationsSrv.getAnnotations({
              dashboard: _this.dashboard,
              panel: _this.panel,
              range: _this.range
            });
            /* Wait for annotationSrv requests to get datasources to
             * resolve before issuing queries. This allows the annotations
             * service to fire annotations queries before graph queries
             * (but not wait for completion). This resolves
             * issue 11806.
             */
            // 5.x before 5.4 doesn't have dataPromises

            if ("undefined" !== typeof _this.annotationsSrv.datasourcePromises) {
              return _this.annotationsSrv.datasourcePromises.then(function (r) {
                return _get(_getPrototypeOf(StatusHeatmapCtrl.prototype), "issueQueries", _assertThisInitialized(_this)).call(_assertThisInitialized(_this), datasource);
              });
            } else {
              return _get(_getPrototypeOf(StatusHeatmapCtrl.prototype), "issueQueries", _assertThisInitialized(_this)).call(_assertThisInitialized(_this), datasource);
            }
          });

          _defineProperty(_assertThisInitialized(_this), "onDataReceived", function (dataList) {
            _this.data = dataList;
            _this.cardsData = _this.convertToCards(_this.data);

            _this.annotationsPromise.then(function (result) {
              _this.loading = false; //this.alertState = result.alertState;

              if (result.annotations && result.annotations.length > 0) {
                _this.annotations = result.annotations;
              } else {
                _this.annotations = null;
              }

              _this.render();
            }, function () {
              _this.loading = false;
              _this.annotations = null;

              _this.render();
            }); //this.render();

          });

          _defineProperty(_assertThisInitialized(_this), "onInitEditMode", function () {
            _this.addEditorTab('Options', statusHeatmapOptionsEditor, 2);

            _this.unitFormats = kbn.getUnitFormats();
          });

          _defineProperty(_assertThisInitialized(_this), "onRender", function () {
            if (!_this.data) {
              return;
            }

            _this.multipleValues = false;

            if (!_this.panel.useMax) {
              if (_this.cardsData) {
                _this.multipleValues = _this.cardsData.multipleValues;
              }
            }

            _this.noColorDefined = false;

            if (_this.panel.color.mode === 'discrete') {
              _this.discreteHelper.updateCardsValuesHasColorInfo();

              if (_this.cardsData) {
                _this.noColorDefined = _this.cardsData.noColorDefined;
              }
            }
          });

          _defineProperty(_assertThisInitialized(_this), "onCardColorChange", function (newColor) {
            _this.panel.color.cardColor = newColor;

            _this.render();
          });

          _defineProperty(_assertThisInitialized(_this), "onDataError", function () {
            _this.data = [];
            _this.annotations = [];

            _this.render();
          });

          _defineProperty(_assertThisInitialized(_this), "postRefresh", function () {
            _this.noColorDefined = false;
          });

          _defineProperty(_assertThisInitialized(_this), "onEditorAddThreshold", function () {
            _this.panel.color.thresholds.push({
              color: _this.panel.defaultColor
            });

            _this.render();
          });

          _defineProperty(_assertThisInitialized(_this), "onEditorRemoveThreshold", function (index) {
            _this.panel.color.thresholds.splice(index, 1);

            _this.render();
          });

          _defineProperty(_assertThisInitialized(_this), "onEditorRemoveThresholds", function () {
            _this.panel.color.thresholds = [];

            _this.render();
          });

          _defineProperty(_assertThisInitialized(_this), "onEditorAddThreeLights", function () {
            _this.panel.color.thresholds.push({
              color: "red",
              value: 2,
              tooltip: "error"
            });

            _this.panel.color.thresholds.push({
              color: "yellow",
              value: 1,
              tooltip: "warning"
            });

            _this.panel.color.thresholds.push({
              color: "green",
              value: 0,
              tooltip: "ok"
            });

            _this.render();
          });

          _defineProperty(_assertThisInitialized(_this), "onEditorAddSolarized", function () {
            _this.panel.color.thresholds.push({
              color: "#b58900",
              value: 0,
              tooltip: "yellow"
            });

            _this.panel.color.thresholds.push({
              color: "#cb4b16",
              value: 1,
              tooltip: "orange"
            });

            _this.panel.color.thresholds.push({
              color: "#dc322f",
              value: 2,
              tooltip: "red"
            });

            _this.panel.color.thresholds.push({
              color: "#d33682",
              value: 3,
              tooltip: "magenta"
            });

            _this.panel.color.thresholds.push({
              color: "#6c71c4",
              value: 4,
              tooltip: "violet"
            });

            _this.panel.color.thresholds.push({
              color: "#268bd2",
              value: 5,
              tooltip: "blue"
            });

            _this.panel.color.thresholds.push({
              color: "#2aa198",
              value: 6,
              tooltip: "cyan"
            });

            _this.panel.color.thresholds.push({
              color: "#859900",
              value: 7,
              tooltip: "green"
            });

            _this.render();
          });

          _defineProperty(_assertThisInitialized(_this), "link", function (scope, elem, attrs, ctrl) {
            rendering(scope, elem, attrs, ctrl);
          });

          _defineProperty(_assertThisInitialized(_this), "convertToCards", function (data) {
            var cardsData = {
              cards: [],
              xBucketSize: 0,
              yBucketSize: 0,
              maxValue: 0,
              minValue: 0,
              multipleValues: false,
              noColorDefined: false,
              targets: [],
              // array of available unique targets
              targetIndex: {} // indices in data array for each of available unique targets

            };

            if (!data || data.length == 0) {
              return cardsData;
            } // Collect uniq timestamps from data and spread over targets and timestamps
            // collect uniq targets and their indices


            _.map(data, function (d, i) {
              cardsData.targetIndex[d.target] = _.concat(_.toArray(cardsData.targetIndex[d.target]), i);
            }); // TODO add some logic for targets heirarchy


            cardsData.targets = _.keys(cardsData.targetIndex);
            cardsData.yBucketSize = cardsData.targets.length; // Maximum number of buckets over x axis

            cardsData.xBucketSize = _.max(_.map(data, function (d) {
              return d.datapoints.length;
            })); // Collect all values for each bucket from datapoints with similar target.
            // TODO aggregate values into buckets over datapoint[TIME_INDEX] not over datapoint index (j).

            for (var i = 0; i < cardsData.targets.length; i++) {
              var target = cardsData.targets[i];

              for (var j = 0; j < cardsData.xBucketSize; j++) {
                var card = {
                  id: i * cardsData.xBucketSize + j,
                  values: [],
                  multipleValues: false,
                  noColorDefined: false,
                  y: target,
                  x: -1
                }; // collect values from all timeseries with target

                for (var si = 0; si < cardsData.targetIndex[target].length; si++) {
                  var s = data[cardsData.targetIndex[target][si]];

                  if (s.datapoints.length <= j) {
                    continue;
                  }

                  var datapoint = s.datapoints[j];

                  if (card.values.length === 0) {
                    card.x = datapoint[TIME_INDEX];
                  }

                  card.values.push(datapoint[VALUE_INDEX]);
                }

                card.minValue = _.min(card.values);
                card.maxValue = _.max(card.values);

                if (card.values.length > 1) {
                  cardsData.multipleValues = true;
                  card.multipleValues = true;
                  card.value = card.maxValue; // max value by default
                } else {
                  card.value = card.maxValue; // max value by default
                }

                if (cardsData.maxValue < card.maxValue) cardsData.maxValue = card.maxValue;
                if (cardsData.minValue > card.minValue) cardsData.minValue = card.minValue;

                if (card.x != -1) {
                  cardsData.cards.push(card);
                }
              }
            }

            return cardsData;
          });

          _.defaultsDeep(_this.panel, panelDefaults);

          _this.opacityScales = opacityScales;
          _this.colorModes = colorModes;
          _this.colorSchemes = colorSchemes; // default graph width for discrete card width calculation

          _this.graph = {
            "chartWidth": -1
          };
          _this.multipleValues = false;
          _this.noColorDefined = false;
          _this.discreteHelper = new ColorModeDiscrete($scope);
          _this.dataWarnings = {
            "noColorDefined": {
              title: 'Data has value with undefined color',
              tip: 'Check metric values, color values or define a new color'
            },
            "multipleValues": {
              title: 'Data has multiple values for one target',
              tip: 'Change targets definitions or set "use max value"'
            }
          };
          _this.annotations = [];
          _this.annotationsSrv = annotationsSrv;

          _this.events.on('data-received', _this.onDataReceived);

          _this.events.on('data-snapshot-load', _this.onDataReceived);

          _this.events.on('data-error', _this.onDataError);

          _this.events.on('init-edit-mode', _this.onInitEditMode);

          _this.events.on('render', _this.onRender);

          _this.events.on('refresh', _this.postRefresh); // custom event from rendering.js


          _this.events.on('render-complete', _this.onRenderComplete);

          return _this;
        }

        return StatusHeatmapCtrl;
      }(MetricsPanelCtrl));

      _defineProperty(StatusHeatmapCtrl, "templateUrl", 'module.html');
    }
  };
});
//# sourceMappingURL=status_heatmap_ctrl.js.map
