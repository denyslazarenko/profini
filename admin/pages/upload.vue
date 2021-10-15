<template>
  <v-row>
    <v-col cols="6">
      <v-text-field
        v-model="tokenAddress"
        label="Profini Address"
      ></v-text-field>
      <h3>Metadata CSV</h3>
      <v-file-input
        v-model="metadata"
        accept=".csv"
        counter
        show-size
        truncate-length="15"
      ></v-file-input>
    </v-col>

    <v-col cols="6">
      <v-text-field
        v-model="boosterAddress"
        label="Booster Address"
      ></v-text-field>
      <h3>Card Images</h3>
      <v-file-input
        v-model="images"
        accept="image/png, image/jpeg, image/bmp"
        counter
        multiple
        show-size
        truncate-length="15"
      ></v-file-input>
    </v-col>
    <v-col cols="12" @click="upload"> <v-btn>Upload!</v-btn> </v-col>
  </v-row>
</template>

<script>
import { ethers } from 'ethers'
import { create } from 'ipfs-http-client'
import all from 'it-all'

import Papa from 'papaparse'
// import { NFTStorage } from 'nft.storage'
import abis from '~/assets/abis'

import connectProvider from '~/services/provider'

const ipfs = create(
  'http://ec2-3-67-80-249.eu-central-1.compute.amazonaws.com:5001'
)

// const apiKey =
//   'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweEE5MzRCNGZiNTREOGFCMDk5NzY4NzU5YjU5OWYwYWI5Mjc3NGYyOUMiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTYyOTA0NzcyMzk0MSwibmFtZSI6ImFzZGZzYWYifQ.sFlkePbfV7ayYupL6JJER2utyQLY5UrSelHxWPHv7FM'
// const client = new NFTStorage({ token: apiKey })

const rarityMapping = { Basic: 100, Rare: 10, Unique: 1 }

export default {
  data() {
    return {
      tokenAddress: '',
      boosterAddress: '',
      numVouchers: 10,
      signer: null,
      provider: null,
      chainId: 0,
      connected: false,
      images: null,
      metadata: null,
    }
  },
  mounted() {
    this.connect()
  },
  methods: {
    replaceUmlauts(string) {
      // let value = string.toLowerCase()

      // value = value.replace(/\u00DC/g, 'ue')
      // value = value.replace(/\u00FC/g, 'ue')
      // value = value.replace(/ü/g, 'ue')
      // value = value.replace(/Ü/g, 'ue')
      // value = value.replace(/&uuml;/g, 'ue')

      // value = value.replace(/\u00C4/g, 'ae')
      // value = value.replace(/\u00E4/g, 'ae')
      // value = value.replace(/ä/g, 'ae')
      // value = value.replace(/Ä/g, 'ae')
      // value = value.replace(/&auml;/g, 'ae')

      // value = value.replace(/\u00D6/g, 'oe')
      // value = value.replace(/\u00F6/g, 'oe')
      // value = value.replace(/ö/g, 'oe')
      // value = value.replace(/Ö/g, 'oe')
      // value = value.replace(/&ouml/g, 'oe')

      // value = value.replace(/\u00DF/g, 'ss')
      // value = value.replace(/ß/g, 'ss')

      // value = value.replace(
      //   /^[\u00C0-\u017Fa-zA-Z'][\u00C0-\u017Fa-zA-Z-' ]+[\u00C0-\u017Fa-zA-Z']?$/,
      //   '__'
      // )

      // value = encodeURI(value)

      // value = value.replace(/\u00DF/g, 'ss')

      // return value
      return string
    },
    async mint(urls, amounts) {
      const profiniContract = new ethers.Contract(
        this.tokenAddress,
        abis.Profini.abi,
        this.provider
      )

      const signer = profiniContract.connect(this.signer)

      const transaction = await signer.mintBatch(
        this.boosterAddress,
        amounts,
        urls,
        []
      )

      const response = await transaction.wait()
      console.log(`Submit transaction ${response}`)
      this.currentTask++

      // ===========================
      this.loading = false
      this.success = true

      this.currentTask = 0
    },
    async storeData(file, data) {
      let cid = await ipfs.add(file)
      console.log(cid)
      const metadata = {
        name: `${
          data['Rarity Level'] !== 'Basic' ? data['Rarity Level'] + ' ' : ''
        }${data['First Name']} ${data['Last Name']}`,
        description:
          'Profini is the professors’ panini. A blockchain-based trading card game for users to collect and trade NFT cards of real-life researchers. At the same time, the cards show the human side of the researchers through their hobby and book and gain public visibility by being part of a visionary project.',
        image: `ipfs://${cid.path}`,
        attributes: [
          {
            trait_type: 'University',
            value: data.University,
          },
          {
            trait_type: 'Rarity',
            value: data['Rarity Level'],
          },
          {
            trait_type: 'Rank',
            value: data.Rank,
          },
          {
            trait_type: 'Chair',
            value: data.Chair,
          },
          {
            trait_type: 'Edition',
            value: '2021 - 10',
          },
        ],
      }
      cid = await ipfs.add(metadata)
      return `ipfs://${cid.path}`
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
    // async so
    upload() {
      // Parse local CSV file
      Papa.parse(this.metadata, {
        complete: async (results) => {
          const d = results.data
          const header = d[0]
          const body = d.slice(1)

          const dataFrame = {}
          for (let i = 0; i < body.length; i++) {
            const row = body[i]
            const rowFrame = {}
            for (let j = 0; j < header.length; j++) {
              rowFrame[header[j]] = row[j]
            }
            const completeFileName = this.replaceUmlauts(
              rowFrame['Complete File Name']
            )
            dataFrame[completeFileName] = rowFrame
          }

          console.log(header)
          console.log('data', dataFrame)
          console.log(this.images)

          const imgs = {}
          for (const img of this.images) {
            imgs[this.replaceUmlauts(img.name)] = img
          }

          console.log(imgs)

          const metas = []
          const files = []
          const amounts = []

          for (const [fileName, file] of Object.entries(imgs)) {
            const meta = dataFrame[fileName]
            console.log(fileName)
            console.log(meta)
            metas.push(meta)
            files.push(file)
            const amount = rarityMapping[meta['Rarity Level']]
            amounts.push(amount)
          }
          // const urls = await Promise.all(promises)
          // console.log(urls)
          console.log('uploading imgs')
          console.log(files)
          const cids = await all(ipfs.addAll(files))
          console.log(cids)
          console.log('uploading done')

          const jsons = []
          for (let i = 0; i < cids.length; i++) {
            const cid = cids[i].path
            const data = metas[i]
            const json = JSON.stringify({
              name: `${
                data['Rarity Level'] !== 'Basic'
                  ? data['Rarity Level'] + ' '
                  : ''
              }${data['First Name']} ${data['Last Name']}`,
              description:
                'Profini is the professors’ panini. A blockchain-based trading card game for users to collect and trade NFT cards of real-life researchers. At the same time, the cards show the human side of the researchers through their hobby and book and gain public visibility by being part of a visionary project.',
              image: `ipfs://${cid}`,
              attributes: [
                {
                  trait_type: 'University',
                  value: data.University,
                },
                {
                  trait_type: 'Rarity',
                  value: data['Rarity Level'],
                },
                {
                  trait_type: 'Rank',
                  value: data.Rank,
                },
                {
                  trait_type: 'Chair',
                  value: data.Chair,
                },
                {
                  trait_type: 'Edition',
                  value: '2021 - 10',
                },
              ],
            })
            jsons.push(json)
          }

          let urls = await all(ipfs.addAll(jsons))
          urls = urls.map((e) => `ipfs://${e.path}`)
          console.log(urls)
          await this.mint(urls, amounts)
        },
      })
    },
  },
}
</script>

<style>
</style>