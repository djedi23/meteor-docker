
filter_content = function(host, content){
    if (content.n === 'Image')
        content.link = '/images/'+host+'/'+content.p+'/inspect';
    
    if (! (_.isString(content.p) || _.isNumber(content.p)))
	content.p = EJSON.stringify(content.p);
    if (_.isEmpty(content.p) && ! _.isNumber(content.p))
	content.p = '--';

    return content;    
};
