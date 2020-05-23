<style lang="scss">
  @import "_styles/dashboard";
</style>

<template>
  <div class="dashboard">
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
            <b-col>{{ row.item }}</b-col>
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
      fields: ['rule', 'service', 'categories', 'show_details'],
      items: [
        { id: 1, rule: 'AMI Naming Conventions', service: 'EC2', categories: 'Security', _showDetails: false },
        { id: 2, rule: 'AWS AMI Encryption', service: 'EC2', categories: 'Security', _showDetails: false },
        { id: 3, rule: 'Account Instance Limit', service: 'EC2', categories: 'Security', _showDetails: false },
        { id: 4, rule: 'App-Tier EC2 Instance Using IAM Roles', service: 'EC2', categories: 'Security', _showDetails: false },
        { id: 5, rule: 'App-Tier Publicly Shared AMI', service: 'EC2', categories: 'Security', _showDetails: false },
        { id: 6, rule: 'Publicly Shared AMI', service: 'EC2', categories: 'Security', _showDetails: false }
      ]
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
    }
  }
};
</script>