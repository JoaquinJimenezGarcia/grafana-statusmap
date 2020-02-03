"use strict";

System.register([], function (_export, _context) {
  "use strict";

  var HelperFormat, HelperFormatValue;

  _export({
    HelperFormat: void 0,
    HelperFormatValue: void 0
  });

  return {
    setters: [],
    execute: function () {
      (function (HelperFormat) {
        HelperFormat["Date"] = "Date";
        HelperFormat["Raw"] = "Raw";
      })(HelperFormat || _export("HelperFormat", HelperFormat = {}));

      (function (HelperFormatValue) {
        HelperFormatValue["Date"] = "YYYY/MM/DD/HH_mm_ss";
        HelperFormatValue["Raw"] = "";
      })(HelperFormatValue || _export("HelperFormatValue", HelperFormatValue = {}));
    }
  };
});
//# sourceMappingURL=helper_format.js.map
