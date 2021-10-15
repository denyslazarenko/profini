<template>
  <v-row>
    <v-col cols="6">
      <v-text-field
        v-model="boosterAddress"
        label="boosterAddress"
      ></v-text-field>

      <v-text-field
        v-model="numVouchers"
        label="Number of Vouchers"
        type="number"
      ></v-text-field>
      <v-btn @click="generateVouchers">Generate</v-btn>
      <v-divider class="my-6"></v-divider>
      <v-text-field v-model="voucherCode" label="voucherCode"></v-text-field>
      <v-btn @click="claim">Claim</v-btn>
    </v-col>
    <v-col>
      <v-textarea :rows="numVouchers" v-model="preImages"></v-textarea>
    </v-col>
  </v-row>
</template>

<script>
import { ethers } from 'ethers'

import abis from '~/assets/abis'
import connectProvider from '~/services/provider'
export default {
  data() {
    return {
      boosterAddress: '',
      numVouchers: 10,
      signer: null,
      provider: null,
      chainId: 0,
      connected: false,
      voucherCode: '',
      preImages: '',
    }
  },
  mounted() {
    this.connect()
  },
  methods: {
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
    async claim() {
      console.log('start')
      const boosterContract = new ethers.Contract(
        this.boosterAddress,
        abis.BoosterPacks.abi,
        this.provider
      )

      console.log(this.signer)

      const signer = boosterContract.connect(this.signer)
      console.log(signer)

      console.log('estimating gas')

      let transaction
      try {
        transaction = await signer.claimPack(this.voucherCode)
      } catch (error) {
        console.log(error)
      }

      console.log('awaiting tx')

      let response
      try {
        response = await transaction.wait()
      } catch (error) {
        console.log(error)
      }

      console.log(`Submit transaction ${response}`)
      console.log(response)
    },
    randomString(length, n) {
      const out = []
      for (let i = 0; i < n; i++) {
        out.push(Math.random().toString(16).substr(2, length))
      }
      return out
    },
    async generateVouchers() {
      //   const abiCoder = new ethers.utils.AbiCoder()
      //   const test = abiCoder.encode(['string'], ['asdf'])
      //   const hash = ethers.utils.keccak256(test)
      //   console.log(hash)

      const preImages = this.randomString(8, this.numVouchers)

      const hashes = preImages.map((e) =>
        ethers.utils.solidityKeccak256(['string'], [e])
      )

      console.log('start')
      const boosterContract = new ethers.Contract(
        this.boosterAddress,
        abis.BoosterPacks.abi,
        this.provider
      )

      console.log(this.signer)

      const signer = boosterContract.connect(this.signer)
      console.log(signer)

      console.log('estimating gas')

      let transaction
      try {
        transaction = await signer.setVouchers(hashes)
      } catch (error) {
        console.log(error)
      }

      console.log('awaiting tx')

      let response
      try {
        response = await transaction.wait()
      } catch (error) {
        console.log(error)
      }

      console.log(`Submit transaction ${response}`)
      console.log(response)

      this.preImages = preImages.join('\n')
    },
  },
}
</script>

<style>
</style>