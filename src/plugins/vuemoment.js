import Vue from 'vue'
import VueMoment from 'vue-moment'

const moment = require('moment');
require('moment/locale/fr');

Vue.use(VueMoment, { moment });
