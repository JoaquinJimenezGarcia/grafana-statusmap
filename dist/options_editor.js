"use strict";

System.register(["app/core/utils/kbn"], function (_export, _context) {
  "use strict";

  var kbn, StatusHeatmapOptionsEditorCtrl;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  function statusHeatmapOptionsEditor() {
    'use strict';

    return {
      restrict: 'E',
      scope: true,
      templateUrl: 'public/plugins/flant-statusmap-panel/partials/options_editor.html',
      controller: StatusHeatmapOptionsEditorCtrl
    };
  }

  _export("statusHeatmapOptionsEditor", statusHeatmapOptionsEditor);

  return {
    setters: [function (_appCoreUtilsKbn) {
      kbn = _appCoreUtilsKbn.default;
    }],
    execute: function () {
      _export("StatusHeatmapOptionsEditorCtrl", StatusHeatmapOptionsEditorCtrl =
      /*#__PURE__*/
      function () {
        function StatusHeatmapOptionsEditorCtrl($scope) {
          _classCallCheck(this, StatusHeatmapOptionsEditorCtrl);

          $scope.editor = this;
          this.panelCtrl = $scope.ctrl;
          this.panel = this.panelCtrl.panel;
          this.unitFormats = kbn.getUnitFormats();
          this.panelCtrl.render();
        }

        _createClass(StatusHeatmapOptionsEditorCtrl, [{
          key: "setUnitFormat",
          value: function setUnitFormat(subItem) {
            this.panel.data.unitFormat = subItem.value;
            this.panelCtrl.render();
          }
        }]);

        return StatusHeatmapOptionsEditorCtrl;
      }());
    }
  };
});
//# sourceMappingURL=options_editor.js.map
