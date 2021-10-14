<template>
  <v-row>
    <v-col cols="12" md="6">
      <v-card>
        <v-card-title> Information </v-card-title>
        <v-select  v-model="rarity" :items="rarity_items" label="Rarity"></v-select>
        <v-select v-model="university" :items="university_items" label="University"></v-select>
        <v-card-text>
          <v-file-input
            v-model="input"
            accept="image/*"
            label="Image input"
          ></v-file-input>
          <v-text-field v-model="name" label="Name"></v-text-field>
          <v-text-field v-model="surname" label="Surname"></v-text-field>
          <v-text-field v-model="rank" label="Rank"></v-text-field>
          <v-text-field v-model="chair" label="Chair"></v-text-field>
          <v-text-field v-model="book" label="Favourite book"></v-text-field>
          <v-text-field v-model="hobby" label="Favourite hobby"></v-text-field>
          <v-divider class="my-6"></v-divider>
        </v-card-text>
        <v-card-actions>
          <v-btn @click="create" color="primary"
            >Create Metacards on
            {{
              chainIdName[chainId] ? chainIdName[chainId] : 'Unknown'
            }}!</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-col>
    <v-col cols="12" md="6">
      <div id="capture" class="metacard-preview-container" :style="`background-image: url('/${rarity}.png');`">
        <img class="preview-image" :src="image" />
        <img class="university-image" :src="`${university}.png`" />
        <div class="name">{{ name }}</div>
        <div class="surname">{{ surname }}</div>
        <div class="rank">{{ rank }}</div>
        <div class="chair">{{ chair }}</div>
        <div class="book">{{ book }}</div>
        <div class="hobby">{{ hobby }}</div>
      </div>
    </v-col>
    <v-dialog v-model="loading" persistent width="500px">
      <v-card dark>
        <v-card-title>{{
          !error ? 'Creating your Metacard...' : 'There was an error...'
        }}</v-card-title>
        <v-card-text>
          <v-timeline dense>
            <v-slide-x-reverse-transition group hide-on-leave>
              <v-timeline-item
                v-for="task in tasks.slice(0, currentTask).reverse()"
                :key="task.id"
                fill-dot
                color="white"
              >
                <template v-slot:icon>
                  <v-icon v-if="error" color="red" dark large>
                    mdi-exclamation-thick
                  </v-icon>
                  <v-progress-circular
                    v-else-if="task.id == currentTask"
                    indeterminate
                    color="primary"
                  ></v-progress-circular>

                  <v-icon v-else dark large color="green">
                    mdi-check-bold
                  </v-icon>
                </template>
                {{ task.description }}
              </v-timeline-item>
            </v-slide-x-reverse-transition>
          </v-timeline>
        </v-card-text>
        <v-card-actions>
          <v-btn v-if="error" @click="loading = false"> Close </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="success" width="500px">
      <v-card dark>
        <v-card-title>Your cards were created!</v-card-title>
        <v-card-text>
          <v-btn :to="`/${newLockAddress}`" nuxt> Mint your cards here </v-btn>
          <div class="py-1"></div>
          <v-btn
            href="https://app.unlock-protocol.com/dashboard"
            target="_blanc"
          >
            View your cards on Unlock Protocol</v-btn
          >
        </v-card-text>
        <v-card-actions>
          <v-btn @click="success = false" color="primary"> Close </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import { ethers } from 'ethers'
import html2canvas from 'html2canvas'
import { NFTStorage, File } from 'nft.storage'
import abis from '~/assets/abis'
import connectProvider from '~/services/provider'
import { unlockAddresses, chainIdName, mintProfiniAddress } from '~/assets/networks'

// const Crypto = require('crypto')

// TODO point to our IPFS cloud
const apiKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweEE5MzRCNGZiNTREOGFCMDk5NzY4NzU5YjU5OWYwYWI5Mjc3NGYyOUMiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTYyOTA0NzcyMzk0MSwibmFtZSI6ImFzZGZzYWYifQ.sFlkePbfV7ayYupL6JJER2utyQLY5UrSelHxWPHv7FM'
const client = new NFTStorage({ token: apiKey })

export default {
  data() {
    return {
      chainIdName,
      loading: false,
      success: false,
      input: null,
      name: 'name',
      surname: 'surname',
      rarity: 'Basic',
      university: 'TUM',
      rank: '12',
      chair: 'chair',
      hindex: '11',
      book: 'book book book',
      hobby: 'hobbyhobby hobbyhobby hobby ',
      collectionName: 'profini',
      collectionDescription: '',
      quantity: 1,
      price: 0.01,
      currentTask: 1,
      errorAtTask: 0,
      newLockAddress: '',
      provider: null,
      signer: null,
      chainId: 0,
      connected: false,
      description: "fds",
      university_items: ['TUM', 'LMU'],
      rarity_items: ['Basic', 'Rare', 'Unique'],
      rarityMapping: {'Basic': 10000, 'Rare': 100, 'Unique': 1},
      tasks: [
        {
          id: 1,
          description: 'Uploading your card to IPFS...',
        },
        {
          id: 2,
          description: 'Creating and uploading metadata...',
        },
        {
          id: 3,
          description: 'Creating your contract...',
        },
        {
          id: 4,
          description: 'Connecting contract to metadata...',
        },
      ],
    }
  },
  middleware: 'ethDetected',
  computed: {
    error() {
      return this.currentTask === this.errorAtTask
    },
    image() {
      if (!this.input) return null
      return URL.createObjectURL(this.input)
    },
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

    errorHandler(e) {
      this.errorAtTask = this.currentTask
    },

    async create() {
      this.loading = true

      const canvas = await html2canvas(document.querySelector('#capture'), {
        allowTaint: true,
      })

      canvas.toBlob(async (blob) => {
        try {
          this.currentTask++


          const profiniContract = new ethers.Contract(
            unlockAddresses[this.chainId],
            abis.Profini.abi,
            this.provider
          )

          const signer = profiniContract.connect(this.signer)

          const metadata = await client.store({
            name: `${this.collectionName}`,
            description: this.description,
            image: new File(
              [blob],
              "image",
             { type: 'image/jpg' }
             ),
          })

          console.log(`base URI ${metadata}`)
          this.currentTask++

          const transaction = await signer.mint(
            mintProfiniAddress,
            this.rarityMapping[this.rarity],
            metadata.url,
            []
          )

          const response = await transaction.wait()
          console.log(`Submit transaction ${response}`)
          this.currentTask++

          // ===========================
          this.loading = false
          this.success = true
        } catch (error) {
          console.log(error)
          this.errorHandler(error)
        }
      })
    },
  },
}
</script>

<style scoped>
.metacard-preview-container {
  position: absolute;
  margin-top: 2rem;
  margin-left: 5rem;
  background-size: cover;
  background-color: white;
  border-radius: 1rem;
  width: 338px;
  height: 570px;
}

.preview-image {
  position: absolute;
  z-index: 2;
  top: 60px;
  border-radius: 10px;
  width: 338px;
  height: 320px;
}

.university-image {
  position: absolute;
  z-index: 2;
  top: 15px;
  left: 255px;
  width: 60px;
  height: 30px;
}

.name {
  position: relative;
  left: 80px;
  top: 320px;
  font-weight: bold;
  text-align: center;
  z-index: 6;
  padding-top: 1px;
  color: white;
  font-size: 2em;
  width: 170px;
  height: 23px;
}
.surname {
  position: relative;
  left: 80px;
  top: 340px;
  z-index: 6;
  text-align: center;
  color: white;
  font-size: 1.9em;
  width: 170px;
  height: 23px;
}
.rarity {
  position: relative;
  left: 0px;
  top: 0px;
  z-index: 6;
  text-align: center;
  color: white;
  font-size: 1.9em;
  width: 170px;
  height: 23px;
}
.university {
  position: relative;
  left: 125px;
  top: 340px;
  z-index: 6;
  text-align: center;
  color: white;
  font-size: 1.4em;
  width: 10px;
  height: 3px;
}
.rank {
  position: relative;
  left: 32px;
  top: 415px;
  z-index: 6;
  text-align: center;
  color: white;
  font-size: 1.3em;
  width: 10px;
  height: 3px;
}
.chair {
  position: relative;
  left: 20px;
  top: 475px;
  z-index: 6;
  text-align: center;
  color: white;
  font-size: 1.3em;
  width: 10px;
  height: 3px;
}
.book {
  position: relative;
  left: 150px;
  top: 415px;
  z-index: 6;
  /*text-align: center;*/
  color: white;
  font-size: 1em;
  width: 190px;
  height: 3px;
}
.hobby {
  position: relative;
  left: 150px;
  top: 470px;
  z-index: 6;
  /*text-align: center;*/
  color: white;
  font-size: 1em;
  width: 190px;
  height: 3px;
}
</style>
