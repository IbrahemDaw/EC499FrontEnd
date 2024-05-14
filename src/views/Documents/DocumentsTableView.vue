<script setup>
import { computed, ref, onMounted, watch, reactive } from 'vue'
import { get, post, put, del,postFile } from '@/services/apiServices'
import {
  mdiMonitorCellphone,
  mdiTableBorder,
  mdiTableOff,
  mdiGithub,
  mdiDropbox,
  mdiFaceAgent,
  mdiFormDropdown,
  mdiArrowUpDown,
  mdiArrowDown,
  mdiArrowUp,
  mdiFilter,
  mdiDelete,
  mdiEyePlus,
  mdiApplicationBracesOutline,
  mdiAccountPlus,
  mdiAccountEdit,
  mdiCancel
} from '@mdi/js'
import SectionMain from '@/components/SectionMain.vue'
import NotificationBar from '@/components/NotificationBar.vue'
import TableSampleClients from '@/components/TableSampleClients.vue'
import CardBox from '@/components/CardBox.vue'
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue'
import SectionTitleLineWithButton from '@/components/SectionTitleLineWithButton.vue'
import BaseButton from '@/components/BaseButton.vue'
import CardBoxComponentEmpty from '@/components/CardBoxComponentEmpty.vue'
import {
  VDataTable,
  VCheckbox,
  VSkeletonLoader,
  VIcon,
  VSelect
} from 'vuetify/lib/components/index.mjs'
import {
  mdiContrastCircle,
  mdiInformation,
  mdiCheckCircle,
  mdiAlert,
  mdiAlertCircle,
  mdiOpenInNew,
  mdiClose,
  mdiReload,
  mdiTrendingUp
} from '@mdi/js'

const columns = [
  { title: 'Titel', value: 'title' },
  { title: 'Description', value: 'description' },
  { title: 'Actions', key: 'actions' }
]
const delectedDocumetns = ref([])
const documents = ref({})
const isLoading = ref(false)
const showError = ref(false)
const pageNumber = ref(1)
const filterModel = ref({
  title: null,
  description: null,
  tags: [],
  categories: [],
  pageNumber: 1,
  pageSize: 30
})
const getDocumentsAsync = () => {
  isLoading.value = true
  filterModel.value.pageNumber = pageNumber.value
  get('api/Document/filter', filterModel.value)
    .then((response) => {
      isLoading.value = false
      showError.value = false
      documents.value = response.data
    })
    .catch((e) => {
      isLoading.value = false
      showError.value = true
    })
}
onMounted(() => {
  getDocumentsAsync()
  getTags()
  getCategories()
})
watch(pageNumber, getDocumentsAsync)

const showFilterForm = ref(false)
const toggelFilterForm = () => {
  showFilterForm.value = !showFilterForm.value
}

const addDocumetCarbox = ref(false)
const toggelAddUserCardBox = () => {
  addDocumetCarbox.value = !addDocumetCarbox.value
}
const newDocumentModel = reactive({
  title: null,
  description: null,
  categories: [],
  tags: []
})
const uploadedFile = ref({})
// const addNewDocument = () => {
//   console.log('newDocumentModel', uploadedFile.value)
//   post(
//     `api/Document?Title=${newDocumentModel.title}&Description=${
//       newDocumentModel.description
//     }&${newDocumentModel.tags.map((tag) => `tags=${tag}`).join('&')}&${newDocumentModel.categories
//       .map((cat) => `categories=${cat}`)
//       .join('&')}`,
//     uploadedFile.value
//   )
//     .then((response) => {
//       alert('document added')
//       getDocumentsAsync()
//     })
//     .catch((e) => {
//       showError.value = true
//     })
// }
const addNewDocument = () => {
  const formData = new FormData()
  console.log('uploadedFile', uploadedFile.value[0])
  console.log()
  formData.append('file', uploadedFile.value[0])
  postFile(
    `api/Document?Title=${newDocumentModel.title}&Description=${
      newDocumentModel.description
    }&${newDocumentModel.tags.map((tag) => `tags=${tag}`).join('&')}&${newDocumentModel.categories
      .map((cat) => `categories=${cat}`)
      .join('&')}`,
    formData
  ).then((response) => {
    alert('document added')
    getDocumentsAsync()
  })
}
const deleteDialog = ref(false)
const taggelDelete = () => {
  deleteDialog.value = !deleteDialog.value
}
const deleteDocument = (id) => {
  isLoading.value = true
  del(`api/document/${id}`)
    .then((response) => {
      taggelDelete()
      getDocumentsAsync()
    })
    .catch()
}

const selectedRoles = ref([])
const dialog = ref(false)
const closeDialog = () => {
  dialog.value = false
}
const userInfoCard = ref({ edit: false, loading: false })
const editUser = ref(false)
const documentDetailed = ref({})
const getDocumentDerails = (id) => {
  get(`api/Document/${id}`)
    .then((res) => {
      documentDetailed.value = res.data
    })
    .catch((e) => {
      showError.value = true
    })
}
const showDialog = (id) => {
  getDocumentDerails(id)
  console.log('showDialog', documentDetailed.value)
  dialog.value = true
  editUser.value = false
}
const showEditDialog = (id) => {
  if (dialog.value === false) {
    getDocumentDerails(id)
    dialog.value = true
  }
  editUser.value = true
}

const updateDocument = () => {
  put('api/document', documentDetailed.value).then((res) => {
    getDocumentsAsync()
  })
  closeDialog()
}

const tags = ref([])
const getTags = () => {
  get('api/Tag')
    .then((response) => {
      tags.value = response.data
    })
    .catch((e) => {
      showError.value = true
    })
}

const categories = ref([])
const getCategories = () => {
  get('api/Category')
    .then((response) => {
      categories.value = response.data
    })
    .catch((e) => {
      showError.value = true
    })
}
</script>

<template>
  <LayoutAuthenticated>
    <SectionMain>
      <SectionTitleLineWithButton :icon="mdiTableBorder" title="Documents" main />
      <CardBox class="mb-6" has-table>
        <CardBox v-if="showError" :class="cardClass">
          <div class="space-y-3">
            <h1 class="text-2xl">same thing went wrong</h1>

            <p>{{ errorMessege }}</p>
          </div>
          <template #footer>
            <BaseButtons>
              <BaseButton label="Reload" color="danger" @click="getDocumentsAsync" />
            </BaseButtons>
          </template>
        </CardBox>
        <CardBox v-else>
          <div class="filter-btm">
            <BaseButton :icon="mdiFilter" variant="plain" elevation="5" @click="toggelFilterForm">
            </BaseButton>
            <BaseButton :icon="mdiAccountPlus" @click="toggelAddUserCardBox"> </BaseButton>
          </div>
          <CardBox v-show="addDocumetCarbox"
            ><v-form v-model="valid">
              <v-container>
                <v-row>
                  <v-col>
                    <v-text-field
                      v-model="newDocumentModel.title"
                      label="Title"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col>
                    <v-text-field
                      v-model="newDocumentModel.description"
                      label="Description"
                      hide-details
                    ></v-text-field>
                  </v-col> </v-row
                ><v-row>
                  <v-col>
                    <v-select
                      v-model="newDocumentModel.categories"
                      :items="categories"
                      item-title="name"
                      item-value="id"
                      label="Categories"
                      multiple
                      persistent-hint
                    ></v-select>
                  </v-col>
                  <v-col>
                    <v-select
                      v-model="newDocumentModel.tags"
                      :items="tags"
                      item-title="name"
                      item-value="id"
                      label="Tags"
                      multiple
                      persistent-hint
                    ></v-select>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col> </v-col
                  ><v-col><v-file-input v-model="uploadedFile" label="File"></v-file-input></v-col>
                </v-row>
                <v-btn :loading="isLoading" @click="addNewDocument">Add</v-btn>
              </v-container>
            </v-form></CardBox
          >
          <CardBox v-show="showFilterForm">
            <v-form>
              <v-container>
                <v-row>
                  <v-col>
                    <v-text-field
                      v-model="filterModel.title"
                      label="Title"
                      hide-details
                      clearable
                    ></v-text-field>
                  </v-col>
                  <v-col>
                    <v-text-field
                      v-model="filterModel.description"
                      label="Description"
                      hide-details
                      clearable
                    ></v-text-field>
                  </v-col>
                  <v-col>
                    <v-select
                      v-model="filterModel.tags"
                      :items="tags"
                      item-title="name"
                      item-value="id"
                      label="Tags"
                      multiple
                    ></v-select>
                  </v-col>
                  <v-col>
                    <v-select
                      v-model="filterModel.categories"
                      :items="categories"
                      item-title="name"
                      item-value="id"
                      label="Categories"
                      multiple
                    ></v-select>
                  </v-col>
                </v-row>
                <v-btn :loading="isLoading" @click="getDocumentsAsync">Filter</v-btn>
              </v-container>
            </v-form></CardBox
          >
          <v-data-table
            v-model:items-per-page="filterModel.pageSize"
            :headers="columns"
            :items="documents.data"
            :loading="isLoading"
          >
            <template v-slot:top>
              <v-dialog v-model="dialog" max-width="1000px">
                <v-card>
                  <v-card-text>
                    <v-container>
                      <v-row>
                        <v-col cols="12" md="4" sm="6">
                          <v-text-field
                            v-model="documentDetailed.title"
                            label="Title"
                            :disabled="!editUser"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" md="4" sm="6">
                          <v-text-field
                            v-model="documentDetailed.description"
                            label="Description"
                            :disabled="!editUser"
                          ></v-text-field>
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col>
                          <v-select
                            v-model="documentDetailed.categories"
                            :items="categories"
                            item-title="name"
                            item-value="id"
                            label="Categories"
                            :disabled="!editUser"
                            multiple
                          ></v-select>
                        </v-col>
                        <v-col>
                          <v-select
                            v-model="documentDetailed.tags"
                            :items="tags"
                            item-title="name"
                            item-value="id"
                            label="Tags"
                            :disabled="!editUser"
                            multiple
                          ></v-select>
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-card-text>

                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue-darken-1" variant="text" @click="closeDialog">
                      Cancel
                    </v-btn>
                    <v-btn
                      v-show="editUser"
                      color="blue-darken-1"
                      variant="text"
                      @click="updateDocument"
                    >
                      Save
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
              <v-dialog v-model="deleteDialog" max-width="1000px">
                <v-card>
                  <v-card-title class="text-h5"
                    >Are you sure you want to delete this item?</v-card-title
                  >
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue-darken-1" variant="text" @click="taggelDelete">Cancel</v-btn>
                    <v-btn color="blue-darken-1" variant="text" @click="console.log('___')"
                      >Delete</v-btn
                    >
                    <v-spacer></v-spacer>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </template>
            <template v-slot:item.actions="{ item }">
              <div class="item-btm">
                <BaseButton :icon="mdiAccountEdit" @click="showEditDialog(item.id)"></BaseButton>
                <BaseButton :icon="mdiInformation" @click="showDialog(item.id)"></BaseButton>
              </div>
            </template>
            <template v-slot:loading>
              <v-skeleton-loader type="table-row@10"> </v-skeleton-loader>
            </template>
            <template v-slot:bottom>
              <div>
                <v-pagination
                  v-model="filterModel.pageNumber"
                  :length="documents.pageCount"
                  total-visible="5"
                ></v-pagination>
              </div>
            </template>
          </v-data-table>
        </CardBox>
      </CardBox>
    </SectionMain>
  </LayoutAuthenticated>
</template>
<style>
.filter-btm {
  display: flex;
  flex-direction: row-reverse;
  gap: 10px;
}
.item-btm {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
}
.v-selection-control__input input {
  opacity: 1 !important;
  -webkit-appearance: none;
  appearance: none;
  width: 22px;
  height: 22px;
  border: 2px solid #ddd;
  border-radius: 4px;
  background: #fff no-repeat center center;
}
.v-selection-control__input {
  width: unset;
  height: unset;
}
</style>
