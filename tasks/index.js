var schedule = require('node-schedule');
var { split, forEach, hasIn, invoke, keys } = require('lodash');

var projectTask = require('./projectTask')


const TASK_LIST = process.env.TASK_LIST;

const tasks = {  
 projectTask: [
    { rule: '0 * * * * *', action:projectTask.task, invokeImmediate: false }
  ]
}

module.exports = {
  start: () => {
    console.log('Task list =>', TASK_LIST);
    console.log('Available Tasks =>', keys(tasks));
    if (TASK_LIST) {
      let parts = split(TASK_LIST, ',');
      forEach(parts, function (taskName) {
        if (hasIn(tasks, taskName)) {
          forEach(tasks[taskName], function (data) {
            schedule.scheduleJob(data.rule, data.action);
            data.invokeImmediate && data.action();
          });
        }
      });
    }
  }
}