<style lang="scss">
  @import "_styles/dashboard";
</style>

<template>
  <div class="dashboard">
    <button class="run-scan" @click="runScan">Run scan</button>
    <span v-if="scanMessage"> {{ scanMessage }}</span>
    <h3 class="title">Dashboard</h3>
    <b-table
      :items="items"
      :fields="fields"
      striped
      :per-page="perPage"
      :current-page="currentPage"
      responsive="sm">
      <template v-slot:cell(show_details)="row">
        <b-button size="sm" @click="showDetails(row, row.detailsShowing)" class="mr-2">
          {{ row.detailsShowing ? 'Hide' : 'Show'}} Details
        </b-button>
      </template>

      <template v-slot:row-details="row">
        <b-card>
          <b-row class="mb-2">
            <ul class="list">
              <li class="list-item" v-for="item in row.item.meta" :key="item">
                <div>Status: {{ item.status }}</div>
                <div>Failure introduced: {{ item.failure_introduced }}</div>
                <div>Message: {{ item.message }}</div>
                <div>Account: {{ item.account }}</div>
                <div>Region: {{ item.region }}</div>
                <div>Description: {{ item.description }}</div>
                <div>Group Id: {{ item.group_id }}</div>
                <div>Group Name: {{ item.group_name }}</div>
                <div>VPC Id: {{ item.vpc_id }}</div>
                <hr/>
              </li>
            </ul>
          </b-row>
        </b-card>
      </template>
    </b-table>
    <b-pagination
      v-model="currentPage"
      :total-rows="rows"
      :per-page="perPage"
      aria-controls="my-table" />
  </div>
</template>

<script>
import { BTable, BPagination } from 'bootstrap-vue';
import axios from 'axios';

export default {
  name: 'dashboard',
  components: {
    'b-table': BTable,
    'b-pagination': BPagination
  },
  data() {
    return {
      currentPage: 1,
      perPage: 2,
      rule: {},
      fields: ['rule', 'service', 'categories', 'riskLevel', 'counts', 'show_details'],
      items: [],
      scanMessage: ''
    }
  },
  computed: {
    rows () {
      return this.items.length;
    }
  },
  methods: {
    showDetails (row, detailShowing) {
      row.toggleDetails();
      if (!detailShowing) {
        this.items.forEach(item => {
          return (item.id !== row.item.id) ? item._showDetails = false : row.item._showDetails = true;
        });
      } else {
        row.item._showDetails = false;
      }
    },
    getDashboardDetails () {
      axios.get('https://kcloud-server-app.herokuapp.com/api/dashboard')
      .then((response) => {
        this.items = response.data[0].data;
      });
    },
    runScan () {
      this.scanMessage = 'Running...';
      axios.get('https://kcloud-server-app.herokuapp.com/api/services')
      .then((response) => {
        if (response) {
          this.scanMessage = 'Ran successfully';
          window.location.assign('/dashboard');
        }
      });
    }
  },
  mounted () {
    this.getDashboardDetails();
  }
};
</script>