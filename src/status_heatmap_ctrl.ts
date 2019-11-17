import { MetricsPanelCtrl } from 'app/plugins/sdk';
import _ from 'lodash';
import { contextSrv } from 'app/core/core';
import kbn from 'app/core/utils/kbn';

import './color_legend';
import rendering from './rendering';
// import aggregates, { aggregatesMap } from './aggregates';
// import fragments, { fragmentsMap } from './fragments';
// import { labelFormats } from './xAxisLabelFormats';
import {statusHeatmapOptionsEditor} from './options_editor';
import {ColorModeDiscrete} from "./color_mode_discrete";

const CANVAS = 'CANVAS';
const SVG = 'SVG';
const VALUE_INDEX = 0,
      TIME_INDEX = 1;

const panelDefaults = {
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

const renderer = CANVAS;

const colorSchemes = [
  // Diverging
  { name: 'Spectral', value: 'interpolateSpectral', invert: 'always' },
  { name: 'RdYlGn', value: 'interpolateRdYlGn', invert: 'always' },
  { name: 'GnYlRd', value: 'interpolateGnYlRd', invert: 'always' },

  // Sequential (Single Hue)
  { name: 'Blues', value: 'interpolateBlues', invert: 'dark' },
  { name: 'Greens', value: 'interpolateGreens', invert: 'dark' },
  { name: 'Greys', value: 'interpolateGreys', invert: 'dark' },
  { name: 'Oranges', value: 'interpolateOranges', invert: 'dark' },
  { name: 'Purples', value: 'interpolatePurples', invert: 'dark' },
  { name: 'Reds', value: 'interpolateReds', invert: 'dark' },

  // Sequential (Multi-Hue)
  { name: 'BuGn', value: 'interpolateBuGn', invert: 'dark' },
  { name: 'BuPu', value: 'interpolateBuPu', invert: 'dark' },
  { name: 'GnBu', value: 'interpolateGnBu', invert: 'dark' },
  { name: 'OrRd', value: 'interpolateOrRd', invert: 'dark' },
  { name: 'PuBuGn', value: 'interpolatePuBuGn', invert: 'dark' },
  { name: 'PuBu', value: 'interpolatePuBu', invert: 'dark' },
  { name: 'PuRd', value: 'interpolatePuRd', invert: 'dark' },
  { name: 'RdPu', value: 'interpolateRdPu', invert: 'dark' },
  { name: 'YlGnBu', value: 'interpolateYlGnBu', invert: 'dark' },
  { name: 'YlGn', value: 'interpolateYlGn', invert: 'dark' },
  { name: 'YlOrBr', value: 'interpolateYlOrBr', invert: 'dark' },
  { name: 'YlOrRd', value: 'interpolateYlOrRd', invert: 'dark' }
];

let colorModes = ['opacity', 'spectrum', 'discrete'];
let opacityScales = ['linear', 'sqrt'];

interface DataWarning {
  title: string;
  tip: string;
}

interface DataWarnings {
  noColorDefined: DataWarning;
  multipleValues: DataWarning;
}

interface ColorThreshold {

}


// A holder of values
export class Card {
  // uniq
  id: number = 0;
  // Array of values in this bucket
  values: any[] = [];
  // card has multiple values
  multipleValues: boolean = false;
  // card has values that has no color
  noColorDefined: boolean = false;
  //
  y: string = "";
  //
  x: number = 0;
  //
  minValue: number = 0;
  maxValue: number = 0;
  value: number = 0;

}

declare class CardsStorage {
  cards: Card[];
  xBucketSize: number;
  yBucketSize: number;
  maxValue: number;
  minValue: number;
  multipleValues: boolean;
  noColorDefined: boolean;
  targets: string[];
  targetIndex: any;
}

export class StatusHeatmapCtrl extends MetricsPanelCtrl {
  static templateUrl = 'module.html';

  opacityScales: any = [];
  colorModes: any = [];
  colorSchemes: any = [];
  unitFormats: any;
  data: any;
  cardsData: any;
  graph: any;
  multipleValues: boolean;
  noColorDefined: boolean;
  discreteHelper: ColorModeDiscrete;
  dataWarnings: DataWarnings;

  annotations: object[] = [];
  annotationsSrv: any;
  annotationsPromise: any;

  /** @ngInject */
  constructor($scope, $injector, $rootScope, annotationsSrv) {
    super($scope, $injector);

    _.defaultsDeep(this.panel, panelDefaults);

    this.opacityScales = opacityScales;
    this.colorModes = colorModes;
    this.colorSchemes = colorSchemes;

    // default graph width for discrete card width calculation
    this.graph = {
      "chartWidth" : -1
    };

    this.multipleValues = false;
    this.noColorDefined = false;

    this.discreteHelper = new ColorModeDiscrete($scope);

    this.dataWarnings = {
      "noColorDefined": {
        title: 'Data has value with undefined color',
        tip: 'Check metric values, color values or define a new color',
      },
      "multipleValues": {
        title: 'Data has multiple values for one target',
        tip: 'Change targets definitions or set "use max value"',
      }
    };

    this.annotations = [];
    this.annotationsSrv = annotationsSrv;

    this.events.on('render', this.onRender.bind(this));
    this.events.on('data-received', this.onDataReceived.bind(this));
    this.events.on('data-error', this.onDataError.bind(this));
    this.events.on('data-snapshot-load', this.onDataReceived.bind(this));
    this.events.on('init-edit-mode', this.onInitEditMode.bind(this));
    this.events.on('refresh', this.postRefresh.bind(this));
    // custom event from rendering.js
    this.events.on('render-complete', this.onRenderComplete.bind(this));
  }

  onRenderComplete(data):void {
    this.graph.chartWidth = data.chartWidth;
    this.renderingCompleted();
  }

  getChartWidth():number {
    const wndWidth = $(window).width();
    // gripPos.w is a width in grid's measurements. Grid size in Grafana is 24.
    const panelWidthFactor = this.panel.gridPos.w / 24;
    const panelWidth = Math.ceil(wndWidth * panelWidthFactor);
    // approximate chartWidth because y axis ticks not rendered yet on first data receive.
    const chartWidth = _.max([
      panelWidth - 200,
      panelWidth/2
    ]);

    return chartWidth!;
  }

  // override calculateInterval for discrete color mode
  calculateInterval() {

    let chartWidth = this.getChartWidth();

    let minCardWidth = this.panel.cards.cardMinWidth;
    let minSpacing = this.panel.cards.cardHSpacing;
    let maxCardsCount = Math.ceil((chartWidth-minCardWidth) / (minCardWidth + minSpacing));

    let intervalMs;
    let rangeMs = this.range.to.valueOf() - this.range.from.valueOf();

    // this is minimal interval! kbn.round_interval will lower it.
    intervalMs = this.discreteHelper.roundIntervalCeil(rangeMs / maxCardsCount);

    // Calculate low limit of interval
    let lowLimitMs = 1; // 1 millisecond default low limit
    let intervalOverride = this.panel.interval;

    // if no panel interval check datasource
    if (intervalOverride) {
      intervalOverride = this.templateSrv.replace(intervalOverride, this.panel.scopedVars);
    } else if (this.datasource && this.datasource.interval) {
      intervalOverride = this.datasource.interval;
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

    this.intervalMs = intervalMs;
    this.interval = kbn.secondsToHms(intervalMs / 1000);
  }

  issueQueries(datasource) {
    this.annotationsPromise = this.annotationsSrv.getAnnotations({
      dashboard: this.dashboard,
      panel: this.panel,
      range: this.range,
    });

    /* Wait for annotationSrv requests to get datasources to
     * resolve before issuing queries. This allows the annotations
     * service to fire annotations queries before graph queries
     * (but not wait for completion). This resolves
     * issue 11806.
     */
    // 5.x before 5.4 doesn't have dataPromises
    if ("undefined" !== typeof(this.annotationsSrv.datasourcePromises)) {
      console.log("annotationsSrv.datasourcePromises");
      return this.annotationsSrv.datasourcePromises.then(r => {
        return super.issueQueries(datasource);
      });
    } else {
      console.log("NO annotationsSrv.datasourcePromises");
      return super.issueQueries(datasource);
    }
  }


  onDataReceived(dataList) {
    this.data      = dataList;
    this.cardsData = this.convertToCards(this.data);

    console.log("OnDataReceived");

    this.annotationsPromise.then(
      result => {
        this.loading = false;
        //this.alertState = result.alertState;
        if (result.annotations && result.annotations.length > 0) {
          this.annotations = result.annotations;
        } else {
          this.annotations = [];
        }
        console.log("annotationsPromise result " + this.annotations.length + " annotations");
        this.render();
      },
      () => {
        this.loading = false;
        this.annotations = [];
        console.log("annotationsPromise onrejected");
        this.render();
      }
    );

    //this.render();
  }

  onInitEditMode() {
    this.addEditorTab('Options', statusHeatmapOptionsEditor, 2);
    this.unitFormats = kbn.getUnitFormats();
  }

  onRender() {
    if (!this.range || !this.data) { return; }

    this.multipleValues = false;
    if (!this.panel.useMax) {
      if (this.cardsData) {
        this.multipleValues = this.cardsData.multipleValues;
      }
    }

    this.noColorDefined = false;
    if (this.panel.color.mode === 'discrete') {
      this.discreteHelper.updateCardsValuesHasColorInfo();
      if (this.cardsData) {
        this.noColorDefined = this.cardsData.noColorDefined;
      }
    }
  }

  onCardColorChange(newColor) {
    this.panel.color.cardColor = newColor;
    this.render();
  }

  onDataError() {
    this.data = [];
    this.annotations = [];
    this.render();
  }

  postRefresh() {
    this.noColorDefined = false;
  }

  onEditorAddThreshold() {
    this.panel.color.thresholds.push({ color: this.panel.defaultColor });
    this.render();
  }

  onEditorRemoveThreshold(index:number) {
    this.panel.color.thresholds.splice(index, 1);
    this.render();
  }

  onEditorRemoveThresholds() {
    this.panel.color.thresholds = [];
    this.render();
  }

  onEditorAddThreeLights() {
    this.panel.color.thresholds.push({color: "red", value: 2, tooltip: "error" });
    this.panel.color.thresholds.push({color: "yellow", value: 1, tooltip: "warning" });
    this.panel.color.thresholds.push({color: "green", value: 0, tooltip: "ok" });
    this.render();
  }
  
  /* https://ethanschoonover.com/solarized/ */
  onEditorAddSolarized() {
    this.panel.color.thresholds.push({color: "#b58900", value: 0, tooltip: "yellow" });
    this.panel.color.thresholds.push({color: "#cb4b16", value: 1, tooltip: "orange" });
    this.panel.color.thresholds.push({color: "#dc322f", value: 2, tooltip: "red" });
    this.panel.color.thresholds.push({color: "#d33682", value: 3, tooltip: "magenta" });
    this.panel.color.thresholds.push({color: "#6c71c4", value: 4, tooltip: "violet" });
    this.panel.color.thresholds.push({color: "#268bd2", value: 5, tooltip: "blue" });
    this.panel.color.thresholds.push({color: "#2aa198", value: 6, tooltip: "cyan" });
    this.panel.color.thresholds.push({color: "#859900", value: 7, tooltip: "green" });
    this.render();
  }

  link(scope, elem, attrs, ctrl) {
    rendering(scope, elem, attrs, ctrl);
  }

  // group values into buckets by target
  convertToCards(data) {
  let cardsData = <CardsStorage> {
      cards: [],
      xBucketSize: 0,
      yBucketSize: 0,
      maxValue: 0,
      minValue: 0,
      multipleValues: false,
      noColorDefined: false,
      targets: [], // array of available unique targets
      targetIndex: {} // indices in data array for each of available unique targets
    };

    if (!data || data.length == 0) { return cardsData;}

    // Collect uniq timestamps from data and spread over targets and timestamps

    // collect uniq targets and their indices
    _.map(data, (d, i) => {
      cardsData.targetIndex[d.target] = _.concat(_.toArray(cardsData.targetIndex[d.target]), i)
    });

    // TODO add some logic for targets heirarchy
    cardsData.targets = _.keys(cardsData.targetIndex);
    cardsData.yBucketSize = cardsData.targets.length;
    // Maximum number of buckets over x axis
    cardsData.xBucketSize = _.max(_.map(data, d => d.datapoints.length));

    // Collect all values for each bucket from datapoints with similar target.
    // TODO aggregate values into buckets over datapoint[TIME_INDEX] not over datapoint index (j).
    for(let i = 0; i < cardsData.targets.length; i++) {
      let target = cardsData.targets[i];

      for (let j = 0; j < cardsData.xBucketSize; j++) {
        let card = new Card();
        card.id = i*cardsData.xBucketSize + j;
        card.values = [];
        card.y = target;
        card.x = -1;

        // collect values from all timeseries with target
        for (let si = 0; si < cardsData.targetIndex[target].length; si++) {
          let s = data[cardsData.targetIndex[target][si]];
          if (s.datapoints.length <= j) {
            continue;
          }
          let datapoint = s.datapoints[j];
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

        if (cardsData.maxValue < card.maxValue)
          cardsData.maxValue = card.maxValue;

        if (cardsData.minValue > card.minValue)
          cardsData.minValue = card.minValue;

        if (card.x != -1) {
        cardsData.cards.push(card);
        }
      }
    }

    return cardsData;
  }
}
