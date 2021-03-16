const request = require('request');
const convert = require('xml-js');

request('http://chronos.iut-velizy.uvsq.fr/EDT/g68674.xml', { }, (err, res, body) => {
 	if (err) { return console.log(err); }
	let json = JSON.parse(convert.xml2json(body, {compact: true, spaces: 2}));

	let weeks = {};
	for (let week of json.timetable.span) {
		weeks[week.alleventweeks._text] = {
			startdate: week._attributes.date,
			weekid: week.title._text,
			courses: []
		}
	}

	for (let course of json.timetable.event) {
		weeks[course.rawweeks._text].courses.push({
			colour: course._attributes.colour,
			day: course.day._text,
			starttime: course.starttime._text,
			endtime: course.endtime._text,
			course: {
				group: course.resources.group?.item._text,
				module: course.resources.module?.item._text,
				teacher: course.resources.staff?.item._text,
				room: course.resources.room?.item._text,
			}
		})
	}
	//console.log(require('util').inspect(weeks, false, null, false));
	//
	
	let days = []
    for (let course of json.timetable.event) {
      let od = weeks[course.rawweeks._text].startdate.split('/')
      let d = new Date(od[2], parseInt(od[1])-1, od[0])
      d.setDate(d.getDate() + parseInt(course.day._text))

      let courseid = `${course.starttime._text}+${course.resources.group ? course.resources.group.item._text : 'undefined'}+${course.resources.staff ? course.resources.staff.item._text : 'undefined'}`


      if (!days[d.getTime()]) {
        days[d.getTime()] = {
          date: d.toLocaleDateString('fr', { weekday: 'long', month: 'long', day: 'numeric' }),
          courses : {}
        }
        days[d.getTime()].courses[ courseid ] = {
          colour: course._attributes.colour,
          day: course.day._text,
          starttime: course.starttime._text,
          endtime: course.endtime._text,
          group: course.resources.group ? course.resources.group.item._text : undefined,
          module: course.resources.module ? course.resources.module.item._text : undefined,
          teacher: course.resources.staff ? course.resources.staff.item._text : undefined,
          room: course.resources.room ? course.resources.room.item._text : undefined,
        }
      } else {
        days[d.getTime()].courses[ courseid ] = {
          colour: course._attributes.colour,
          day: course.day._text,
          starttime: course.starttime._text,
          endtime: course.endtime._text,
          group: course.resources.group ? course.resources.group.item._text : undefined,
          module: course.resources.module ? course.resources.module.item._text : undefined,
          teacher: course.resources.staff ? course.resources.staff.item._text : undefined,
          room: course.resources.room ? course.resources.room.item._text : undefined,
        }
      }
    }

  days = Object.keys(days).sort().reduce((a, c) => (a[c] = days[c], a), {})

  console.log(require('util').inspect(days, false, null, false));

});

