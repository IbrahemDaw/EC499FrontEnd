<script setup>
import { computed, ref, onMounted, watch, reactive } from 'vue'
import { get, post, put, del } from '@/services/apiServices'
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
  mdiCancel,
  mdiCodeTags
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
  { title: 'Name', value: 'name' },
  { title: 'Description', value: 'description' },
  { title: 'Enabled', value: 'isEnable' },
  { title: 'Actions', key: 'actions' }
]
const selectedTags = ref([])
const tags = ref({})
const isLoading = ref(false)
const showError = ref(false)
const filterModel = ref({
  name: null,
  description: null,
  isEnable: null,
  pageNumber: 1,
  pageSize: 30
})
const getTagsAsync = () => {
  isLoading.value = true
  filterModel.value.pageNumber = pageNumber.value
  get('api/Tag/filter', filterModel.value)
    .then((response) => {
      isLoading.value = false
      showError.value = false
      tags.value = response.data
    })
    .catch((e) => {
      isLoading.value = false
      showError.value = true
    })
}
onMounted(() => {
  getTagsAsync()
})
const pageNumber = ref(1)
watch(pageNumber, getTagsAsync)

const showFilterForm = ref(false)
const toggelFilterForm = () => {
  showFilterForm.value = !showFilterForm.value
}

const addTagCardBox = ref(false)
const toggelAddCard = () => {
  addTagCardBox.value = !addTagCardBox.value
}
const newTagModel = reactive({
  name: null,
  description: null,
  isEnable: true
})
const addNewTag = () => {
  post('api/Tag', newTagModel)
    .then((response) => {
      alert('tag added')
      getTagsAsync()
    })
    .catch((e) => {
      showError.value = true
    })
}

const deleteDialog = ref(false)
const taggelDelete = () => {
  deleteDialog.value = !deleteDialog.value
}
const deleteTags = () => {
  isLoading.value = true
  del('api/Tag', selectedTags.value)
    .then((response) => {
      taggelDelete()
      getTagsAsync()
    })
    .catch()
}

const disableTags = () => {
  put('api/Tag/Disable', null, selectedTags.value)
    .then((response) => {
      getTagsAsync()
    })
    .catch()
}

const enableTags = () => {
  put('api/Tag/Enable', null, selectedTags.value)
    .then((response) => {
      getTagsAsync()
    })
    .catch((e) => {
      console.log(e)
    })
}
const dialog = ref(false)
const closeDialog = () => {
  dialog.value = false
}
const editTag = ref(false)
const tagDetailed = ref({})
const getTag = (id) => {
  get(`api/tag/${id}`)
    .then((res) => {
      tagDetailed.value = res.data
    })
    .catch((e) => {
      showError.value = true
    })
}
const showDialog = (id) => {
  getTag(id)
  dialog.value = true
  editTag.value = false
}
const showEditDialog = (id) => {
  if (dialog.value === false) {
    getTag(id)
    dialog.value = true
  }
  editTag.value = true
}

const updateTag = () => {
  put('api/tag', tagDetailed.value).then((res) => {
    getTagsAsync()
  })
  closeDialog()
}
</script>

<template>
  <LayoutAuthenticated>
    <SectionMain>
      <SectionTitleLineWithButton :icon="mdiCodeTags" title="Tags" main />
      <CardBox class="mb-6" has-table>
        <CardBox v-if="showError" :class="cardClass">
          <div class="space-y-3">
            <h1 class="text-2xl">same thing went wrong</h1>

            <p>{{ errorMessege }}</p>
          </div>
          <template #footer>
            <BaseButtons>
              <BaseButton label="Reload" color="danger" @click="getTagsAsync" />
            </BaseButtons>
          </template>
        </CardBox>
        <CardBox v-else>
          <div class="filter-btm">
            <BaseButton :icon="mdiFilter" variant="plain" elevation="5" @click="toggelFilterForm">
            </BaseButton>
            <BaseButton :icon="mdiAccountPlus" @click="toggelAddCard"> </BaseButton>

            <div v-if="selectedTags.length" class="filter-btm">
              <BaseButton :icon="mdiDelete" @click="taggelDelete"> </BaseButton>
              <BaseButton :icon="mdiCheckCircle" @click="enableTags"> </BaseButton>
              <BaseButton :icon="mdiCancel" @click="disableTags"> </BaseButton>
            </div>
          </div>
          <CardBox v-show="addTagCardBox"
            ><v-form v-model="valid">
              <v-container>
                <v-row>
                  <v-col>
                    <v-text-field
                      v-model="newTagModel.name"
                      label="Name"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col>
                    <v-text-field
                      v-model="newTagModel.description"
                      label="Description"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col>
                    <v-checkbox v-model="newTagModel.isEnable"> Enable </v-checkbox>
                  </v-col>
                </v-row>
                <v-btn :loading="isLoading" @click="addNewTag">Add</v-btn>
              </v-container>
            </v-form></CardBox
          >
          <CardBox v-show="showFilterForm">
            <v-form>
              <v-container>
                <v-row>
                  <v-col>
                    <v-text-field
                      v-model="filterModel.name"
                      label="Name"
                      hide-details
                      clearable
                    ></v-text-field>
                  </v-col>
                  <v-col>
                    <v-text-field
                      v-model="filterModel.description"
                      label="description"
                      hide-details
                      clearable
                    ></v-text-field>
                  </v-col>
                  <v-col>
                    <v-select
                      v-model="filterModel.isEnable"
                      :items="[
                        { title: 'Enabled', value: true },
                        { title: 'Disabled', value: false }
                      ]"
                      label="State"
                      clearable
                    ></v-select
                  ></v-col>
                </v-row>
                <v-btn :loading="isLoading" @click="getTagsAsync">Filter</v-btn>
              </v-container>
            </v-form></CardBox
          >
          <v-data-table
            v-model:tags-per-page="filterModel.pageSize"
            :headers="columns"
            :items="tags.data"
            v-model="selectedTags"
            show-select
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
                            v-model="tagDetailed.name"
                            label="name"
                            :disabled="!editTag"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" md="4" sm="6">
                          <v-text-field
                            v-model="tagDetailed.description"
                            label="User Name"
                            :disabled="!editTag"
                          ></v-text-field>
                        </v-col>
                        <v-col class="item-btm" cols="12" md="4" sm="6">
                          <v-checkbox v-model="tagDetailed.isEnable" :disabled="!editTag"
                            >Enabled</v-checkbox
                          >
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-card-text>

                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue-darken-1" variant="text" @click="closeDialog">
                      Cancel
                    </v-btn>
                    <v-btn v-show="editTag" color="blue-darken-1" variant="text" @click="updateTag">
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
                    <v-btn color="blue-darken-1" variant="text" @click="deleteTags">Delete</v-btn>
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
            <template v-slot:no-data>
              <v-btn color="primary" @click="initialize"> Reset </v-btn>
            </template>
            <template v-slot:loading>
              <v-skeleton-loader type="table-row@10"> </v-skeleton-loader>
            </template>
            <template v-slot:item.isEnable="{ item }">
              <v-checkbox v-model="item.isEnable" disabled></v-checkbox>
            </template>

            <template v-slot:bottom>
              <div>
                <v-pagination
                  v-model="pageNumber"
                  :length="tags.pageCount"
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
