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
  { title: 'Name', value: 'name' },
  { title: 'Description', value: 'description' },
  { title: 'Actions', key: 'actions' }
]
const selectedCategories = ref([])
const Categories = ref({})
const isLoading = ref(false)
const showError = ref(false)
const filterModel = ref({
  name: null,
  tags: [],
  pageNumber: 1,
  pageSize: 30
})
const tags = ref([])
const getTags = () => {
  get('api/tag').then((res) => (tags.value = res.data))
}
const pageNumber = ref(1)
const getCategoriesAsync = () => {
  isLoading.value = true
  filterModel.value.pageNumber = pageNumber.value
  get('api/Category/filter', filterModel.value)
    .then((response) => {
      isLoading.value = false
      showError.value = false
      Categories.value = response.data
    })
    .catch((e) => {
      isLoading.value = false
      showError.value = true
    })
}
onMounted(() => {
  getCategoriesAsync()
  getTags()
})
watch(filterModel.pageNumber, getCategoriesAsync)

const showFilterForm = ref(false)
const toggelFilterForm = () => {
  showFilterForm.value = !showFilterForm.value
}

const addCategoryBox = ref(false)
const toggelAddCategoryBox = () => {
  addCategoryBox.value = !addCategoryBox.value
}
const newCategoryModel = reactive({
  name: null,
  description: null,
  tags: []
})
const addNewCategory = () => {
  post('api/category', newCategoryModel)
    .then((response) => {
      alert('category added')
      getCategoriesAsync()
    })
    .catch((e) => {
      showError.value = true
    })
}

const deleteDialog = ref(false)
const taggelDelete = () => {
  deleteDialog.value = !deleteDialog.value
}
const deleteCategory = () => {
  isLoading.value = true
  del('api/category', selectedCategories.value)
    .then((response) => {
      taggelDelete()
      getCategoriesAsync()
    })
    .catch()
}

const dialog = ref(false)
const closeDialog = () => {
  dialog.value = false
}
const userInfoCard = ref({ edit: false, loading: false })
const editUser = ref(false)
const categoryDetailed = ref({})
const getCategory = (id) => {
  get(`api/category/${id}`)
    .then((res) => {
      categoryDetailed.value = res.data
      console.log(res.data)
    })
    .catch((e) => {
      showError.value = true
    })
}
const showDialog = (id) => {
  getCategory(id)
  dialog.value = true
  editUser.value = false
}
const showEditDialog = (id) => {
  if (dialog.value === false) {
    getCategory(id)
    dialog.value = true
  }
  editUser.value = true
}

const updateCategory = () => {
  put('api/category', categoryDetailed.value).then((res) => {
    getCategoriesAsync()
  })
  closeDialog()
}
</script>

<template>
  <LayoutAuthenticated>
    <SectionMain>
      <SectionTitleLineWithButton :icon="mdiTableBorder" title="Categories" main />
      <CardBox class="mb-6" has-table>
        <CardBox v-if="showError" :class="cardClass">
          <div class="space-y-3">
            <h1 class="text-2xl">same thing went wrong</h1>

            <p>{{ errorMessege }}</p>
          </div>
          <template #footer>
            <BaseButtons>
              <BaseButton label="Reload" color="danger" @click="getCategoriesAsync" />
            </BaseButtons>
          </template>
        </CardBox>
        <CardBox v-else>
          <div class="filter-btm">
            <BaseButton :icon="mdiFilter" variant="plain" elevation="5" @click="toggelFilterForm">
            </BaseButton>
            <BaseButton :icon="mdiAccountPlus" @click="toggelAddCategoryBox"> </BaseButton>

            <div v-if="selectedCategories.length" class="filter-btm">
              <BaseButton :icon="mdiDelete" @click="taggelDelete"> </BaseButton>
            </div>
          </div>
          <CardBox v-show="addCategoryBox"
            ><v-form v-model="valid">
              <v-container>
                <v-row>
                  <v-col>
                    <v-text-field
                      v-model="newCategoryModel.name"
                      label="Name"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col>
                    <v-text-field
                      v-model="newCategoryModel.description"
                      label="Description"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col>
                    <v-select
                      v-model="newCategoryModel.tags"
                      :items="tags"
                      item-title="name"
                      item-value="id"
                      label="Tags"
                      multiple
                    ></v-select>
                  </v-col>
                </v-row>
                <v-btn :loading="isLoading" @click="addNewCategory">Add</v-btn>
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
                </v-row>
                <v-btn :loading="isLoading" @click="getCategoriesAsync">Filter</v-btn>
              </v-container>
            </v-form></CardBox
          >
          <v-data-table
            v-model:items-per-page="filterModel.pageSize"
            :headers="columns"
            :items="Categories.data"
            v-model="selectedCategories"
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
                            v-model="categoryDetailed.name"
                            label="Name"
                            :disabled="!editUser"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" md="4" sm="6">
                          <v-text-field
                            v-model="categoryDetailed.description"
                            label="Description"
                            :disabled="!editUser"
                          ></v-text-field>
                        </v-col>
                        <v-col>
                          <v-select
                            v-model="categoryDetailed.tags"
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
                      @click="updateCategory"
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
                    <v-btn color="blue-darken-1" variant="text" @click="deleteCategory"
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
            <template v-slot:no-data>
              <v-btn color="primary" @click="initialize"> Reset </v-btn>
            </template>
            <template v-slot:loading>
              <v-skeleton-loader type="table-row@10"> </v-skeleton-loader>
            </template>
            <template v-slot:item.isEnabled="{ item }">
              <v-checkbox v-model="item.isEnabled" disabled></v-checkbox>
            </template>

            <template v-slot:bottom>
              <div>
                <v-pagination
                  v-model="filterModel.pageNumber"
                  :length="Categories.pageCount"
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
