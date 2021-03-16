<template>
  <f7-page>
    <f7-page>
      <f7-swiper
        ref="swiper"
        class="is-fullheight"
      >
        <f7-swiper-slide 
          style="min-height: 100%"
          v-for="(day, index) in days"
          :key="index"
        >
          <day
            :day="day"
          />
        </f7-swiper-slide>
      </f7-swiper>
    </f7-page>

    <div class="toolbar toolbar-bottom fab-morph-target">
      <div class="toolbar-inner">
        <a class="link fab-close"
          @click="$refs.swiper.swiper.slideTo(0,100)"
        >
          <i class="icon material-icons md-only">home</i>
          <i class="icon f7-icons if-not-md">home</i>
          &nbsp Aujourd'hui
        </a>
        <a class="link fab-close">Suce moi</a>
        <a class="link fab-close">le chibrax</a>
      </div>
    </div>
    <div class="fab fab-left-bottom fab-morph" data-morph-to=".toolbar">
      <a href="#">
        <i class="icon f7-icons if-not-md">plus</i>
        <i class="icon f7-icons if-not-md">xmark</i>
        <i class="icon material-icons md-only">add</i>
        <i class="icon material-icons md-only">close</i>
      </a>
    </div>

    <f7-popup :opened="popup" swipe-to-close>
      <f7-page>
        <f7-navbar title="Console">
          <f7-nav-right>
            <f7-link popup-close>Close</f7-link>
          </f7-nav-right>
        </f7-navbar>

        <div class="display-flex justify-content-center">
          <div>
            <h3>{{popupContent.title}}</h3>
            <code>{{popupContent.message}}</code>
          </div>
        </div>
      </f7-page>
    </f7-popup>

  </f7-page>
</template>
<script>
  import day from './day'
  const convert = require('xml-js')

  import { f7Fab } from 'framework7-vue';

  export default {
    components: {day},
    name:"edt",
    data(){
      return{

        popupContent: '',
        popup: false,

        days: [],

        isOpen: false
      }
    },

    methods: {
      createPopup(title, message) {

        this.popupContent = {
          title: title,
          message: message
        }

        this.popup = true
      },

      updateCourses(xml) {
        let json = JSON.parse(convert.xml2json(xml, {compact: true, spaces: 2}));

        let weeks = {};
        for (let week of json.timetable.span) {
          weeks[week.alleventweeks._text] = {
            startdate: week._attributes.date,
            weekid: week.title._text,
          }
        }

        let days = [];
        let td = new Date()

        for (let course of json.timetable.event) {
          let od = weeks[course.rawweeks._text].startdate.split('/')
          let d = new Date(od[2], parseInt(od[1])-1, od[0])

          if (d < td) continue;

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

        this.days = Object.keys(days).sort().reduce((a, c) => (a[c] = days[c], a), {})
      },

      fetchEDT(){
        cordova.plugin.http.get('http://chronos.iut-velizy.uvsq.fr/EDT/g68674.xml', {}, {}, (response) => {
          // console.log(response)
          this.updateCourses(response.data)
        }, (response) => {
          this.createPopup('Error while fetching celcat server', JSON.stringify(response))
        });
      }
    },

    mounted() {
      document.addEventListener("deviceready", this.fetchEDT, false);
      this.fetchEDT()
    }
  };
</script>

<style>
* {
  -webkit-touch-callout: none; /* iOS Safari */
    -webkit-user-select: none; /* Safari */
     -khtml-user-select: none; /* Konqueror HTML */
       -moz-user-select: none; /* Old versions of Firefox */
        -ms-user-select: none; /* Internet Explorer/Edge */
            user-select: none;
}
</style>
