Template["afArrayField_ulimits"].helpers({
    Name: function(){
        return this.name+".Name";
    },
    Soft: function(){
        return this.name+".Soft";
    },
    Hard: function(){
        return this.name+".Hard";
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
