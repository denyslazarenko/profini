<template>
  <div>
    <v-text-field
      v-model="boosterAddress"
      label="boosterAddress"
    ></v-text-field>
    <v-text-field
      v-model="numVouchers"
      label="Number of Vouchers"
    ></v-text-field>
    <v-btn @click="generateVouchers"></v-btn>
  </div>
</template>

<script>
import { ethers } from 'ethers'

// import abis from '~/assets/abis'
import connectProvider from '~/services/provider'
export default {
  data() {
    return {
      boosterAddress: '',
      numVouchers: 1,
    }
  },
  methods: {
    mounted() {
      this.connect()
    },
    async connect() {
      this.connected = false
      const { provider, signer, chainId, updateOnChainChange } =
        await connectProvider()
      this.provider = provider
      this.signer = signer
      this.chainId = chainId
      this.connected = true
      updateOnChainChange()
    },
    generateVouchers() {
      const abiCoder = new ethers.utils.AbiCoder()
      const test = abiCoder.encode(['bytes'], ['asdf'])
      ethers.utils.keccak256()
      console.log(test)
    },
  },
}
</script>

<style>
</style>