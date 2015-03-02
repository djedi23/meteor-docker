Meteor.startup(function () {
    Notifications.settings.animationSpeed = 500;
    _.extend(Notifications.defaultOptions, {
        timeout: 3000
    });

    Notifications.defaultOptionsByType[Notifications.TYPES.ERROR] =
        _.defaults({
            timeout: 10000
        }, Notifications.defaultOptions);

    Meteor.call('dtcVersion', function(err, result){
        if (!err)
            dtcVersion.set(result);
    });
});