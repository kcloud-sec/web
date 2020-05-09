<template>
  <div>
    <h2>EC2 security groups</h2>
    <!-- Loop region name, list of permissions -->
    <div v-for="(inbound, inboundIndex) in inboundRules" :key="inboundIndex">
      <h4>Region - {{ inbound.region }}</h4>
      <p v-if="inbound.rules.length === 1">No rules found</p>
      <ul class="inbound-rules">
        <li
          :class="{'card': rule.IpProtocol === 'tcp', 'highlight': recommendations(rule).length}"
          v-for="(rule, ruleIndex) in inbound.rules" :key="ruleIndex">
          <!-- show only tcp related rules -->
          <div v-if="rule.IpProtocol === 'tcp'">
            <div>
              Protocol: {{ rule.IpProtocol }}
            </div>
            <div>
              Port: {{ displayPort(rule) }}
            </div>
            <div v-if="rule.IpRanges && rule.IpRanges.length">
              IP: {{ rule.IpRanges[0].CidrIp }}
            </div>
            <div v-if="rule.Ipv6Ranges && rule.Ipv6Ranges.length">
              IPV6: {{ rule.Ipv6Ranges[0].CidrIpv6 }}
            </div>
            <div class="inbound-rules__recommendations" v-if="recommendations(rule).length">
              <b>Recommendations</b>:
              <span v-for="(msg, recommendationIndex) in recommendations(rule)" :key="recommendationIndex">
                <p>{{ msg }}</p>
              </span>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import AWS from 'aws-sdk';

export default {
  name: 'HelloWorld',
  data() {
    return {
      inboundRules: [],
      allRegions: []
    };
  },
  computed: {
  },
  methods: {
    loadUserCredential() {
      return AWS.config.update({
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_KEY,
      });
    },
    loadUserRegion(region) {
      return new AWS.EC2({
        region: region
      });
    },
    displayPort (rule) {
      if (rule.FromPort === rule.ToPort) {
        return rule.FromPort;
      } else {
        return `${rule.FromPort}-${rule.ToPort}`;
      }
    },
    recommendations (rule) {
      let infos = [];
      if (rule.IpRanges && rule.IpRanges.length && rule.IpRanges[0].CidrIp === '0.0.0.0/0') {
        infos.push('IP has localhost reference, please specify desired ip');
      }
      if (rule.Ipv6Ranges && rule.Ipv6Ranges.length && rule.Ipv6Ranges[0].CidrIpv6 === '::/0') {
        infos.push('IPV6 has localhost reference, please specify desired ip');
      }
      if (rule.FromPort === 0 && rule.ToPort === 65535) {
        infos.push('All ports are public, please specify desired ports');
      }
      return infos;
    }
  },
  async mounted() {
    this.loadUserCredential();
    let ec2Region = this.loadUserRegion('ap-south-1');
    await ec2Region.describeRegions( (regionErr, regionData) => {
      if (regionErr) {
        console.log(regionErr);
      } else {
        regionData.Regions.forEach((region) => {
          if (region.RegionName) {
            let ec2SecurityGroups = this.loadUserRegion(region.RegionName);
            ec2SecurityGroups.describeSecurityGroups((securityGroupErr, securityGroupData) => {
              if (securityGroupErr) {
                console.log('error', securityGroupErr);
              } else {
                if (securityGroupData && securityGroupData.SecurityGroups && securityGroupData.SecurityGroups[0] && securityGroupData.SecurityGroups[0].IpPermissions) {
                  this.inboundRules.push({
                    region: region.RegionName ,
                    rules: securityGroupData.SecurityGroups[0].IpPermissions
                  });
                }
              }
            });
          }
        });
      }
    });
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.inbound-rules {
  margin-left: 35%;
}

.inbound-rules li {
 list-style: none;
}

.card {
  list-style: none;
  background: gray;
  width: 400px;
  margin-bottom: 20px;
  box-shadow: 4px 4px lightgray;
  text-align: left;
  padding-left: 20px;
  padding-top: 10px;
}

.highlight {
  border: 3px solid red;
}

.inbound-rules__recommendations {
  padding-top: 10px;
  padding-bottom: 10px;
}
</style>
