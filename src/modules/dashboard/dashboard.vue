<template>
  <div>
    <b-table :items="items" :fields="fields" striped responsive="sm">
      <template v-slot:cell(show_details)="row">
        <b-button size="sm" @click="showDetails(row)" class="mr-2">
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
  </div>
</template>

<script>
import { BTable } from 'bootstrap-vue';

export default {
  name: 'dashboard',
  components: {
    'b-table': BTable
  },
  data() {
    return {
      rule: {},
      fields: ['rule', 'service', 'categories', 'show_details'],
      items: [
        { id: 1, rule: 'AMI Naming Conventions', service: 'EC2', categories: 'Security', _showDetails: false },
        { id: 2, rule: 'AWS AMI Encryption', service: 'EC2', categories: 'Security', _showDetails: false },
        { id: 3, rule: 'Account Instance Limit', service: 'EC2', categories: 'Security', _showDetails: false },
        { id: 4, rule: 'App-Tier EC2 Instance Using IAM Roles', service: 'EC2', categories: 'Security', _showDetails: false },
        { id: 5, rule: 'App-Tier Publicly Shared AMI', service: 'EC2', categories: 'Security', _showDetails: false }
      ]
    }
  },
  methods: {
    showDetails (row) {
      row.toggleDetails();
      this.items.forEach(item => {
        console.log(item.id, row.item.id);
        return (item.id !== row.item.id) ? item._showDetails = false : row.item._showDetails = true;
      });
    }
  }
};
</script>