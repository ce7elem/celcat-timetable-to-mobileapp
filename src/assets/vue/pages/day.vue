<template>
  <div>
    <f7-block-title>{{ day.date }}</f7-block-title>
    <div class="timeline">
      <div style="overflow-y: scroll">
        <div 
          class="timeline-item"
          v-for="course of day.courses"
        >
          <div class="timeline-item-date"><small>{{ course.starttime }}</small></div>
          <div class="timeline-item-divider"></div>
          <div class="timeline-item-content">
            <div class="timeline-item-inner">
              <div class="timeline-item-time">{{ course.starttime }} - {{ course.endtime }}</div>
              <div class="timeline-item-title">{{ course.module }}</div>
              <div class="timeline-item-subtitle">{{ course.teacher }}</div>
              <div class="timeline-item-text">
                {{ course.group }}
              </div>
            </div>
            <div v-if="course.room" class="card no-safe-areas">
              <div class="card-footer">{{ course.room}}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { f7Navbar, f7Page, f7BlockTitle } from 'framework7-vue';
export default {
  components: {
    f7Navbar,
    f7Page,
    f7BlockTitle,
  },
  name: "day",
  props: ["day"],

  /*
    day = {
      date: date,
      courses : [
        ...,
        {
          colour: course._attributes.colour,
          day: course.day._text,
          starttime: course.starttime._text,
          endtime: course.endtime._text,
          group: course.resources.group ? course.resources.group.item._text : undefined,
          module: course.resources.module ? course.resources.module.item._text : undefined,
          teacher: course.resources.staff ? course.resources.staff.item._text : undefined,
          room: course.resources.room ? course.resources.room.item._text : undefined,
        }
      ]
    }
  */

  data(){
    return{
      lessons: [
        {
          hour: "12:30 - 13:00",
          teacher: "Pablo Olivera",
          name: "Système d'exploitation",
          room: "205",
          // remarque
        },
        {
          hour: "13:00 - 19:00",
          teacher: "Yasper",
          name: "Structure des Ordinateurs",
          room: "Cours en Distanciel",
          // remarque
        }
      ]
    }
  }
};
</script>