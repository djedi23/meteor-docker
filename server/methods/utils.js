filterSwarmManager = function(engines){
  return _.filter(_.pairs(engines),function(engine){
           var hid = engine[0];
           var host = Hosts.findOne({_id:hid},{fields:{'info.Swarm':1}});
           return host.info && host.info.Swarm &&host.info.Swarm.Managers > 0;
         });
};