

if (modules.containers === undefined)
  modules.containers = {};

modules.containers.status = {
  up: 0,
  restarting: 1,
  paused: 2,
  exited: 3
};

modules.containers.statusParser = function (status) {
  if (/Paused/.test(status))
    return modules.containers.status.paused;
  else if (/^Up/.test(status))
    return modules.containers.status.up;
  else if (/^Restarting/.test(status))
    return modules.containers.status.restarting;
  else if (/^Exited/.test(status))
    return modules.containers.status.exited;
  return -1;
};
