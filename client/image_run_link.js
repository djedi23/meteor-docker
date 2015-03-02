Template["afArrayField_links"].helpers({
    container_name: function(){
        return this.name+".container_name";
    },
    alias: function(){
        return this.name+".alias";
    },
    rightColumnClass: function () {
        var atts = this.atts || {};
        return atts['input-col-class'] || "";
    },
    afFieldLabelAtts: function () {
        // Use only atts beginning with label-
        var labelAtts = {};
        _.each(this.atts, function (val, key) {
            if (key.indexOf("label-") === 0) {
                labelAtts[key.substring(6)] = val;
            }
        });
        // Add bootstrap class
        labelAtts = AutoForm.Utility.addClass(labelAtts, "control-label");
        return labelAtts;
    }
});
