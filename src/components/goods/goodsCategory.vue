<template>
  <div class="container">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="func">
      <el-button type="primary" size="small" @click="onSave" icon="el-icon-plus">新增分类</el-button>
    </div>
    <el-table
      :data="goodsCategory"
      ref="goodsCategory"
      style="width: 100%;"
      height="81vh"
      row-key="id"
      border
      :default-expand-all="false"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
      <el-table-column
        prop="id"
        label="ID"
        sortable
        width="220"
        align="right">
      </el-table-column>
      <el-table-column
          prop="icon"
          label="图标"
          width="58px">
          <template slot-scope="scope">
            <el-image
              style="width: 35px; height: 35px"
              :src="setIcon(scope.row.icon)"
              fit="fit"
              :previewSrcList="setpreviewSrc(scope.row.icon)"></el-image>
          </template>
        </el-table-column>
      <el-table-column
        prop="name"
        label="名称"
        sortable
        align="center">
      </el-table-column>
      <el-table-column
        prop="fid"
        label="上级分类ID"
        width="200"
        align="center">
      </el-table-column>
      <el-table-column
        prop="remark"
        label="分类备注"
        width="220"
        align="center">
      </el-table-column>
      <el-table-column
        label="操作">
        <template slot-scope="scope">
          <el-upload
            :action="setUploadAction(scope.row.id)"
            :multiple="false"
            :limit="1"
            :show-file-list="false"
            accept="image/*"
            :headers="{authorization}"
            :on-success="onUploadSuccess"
            :on-error="onUploadError">
            <el-button size="small" type="text">上传或修改图标</el-button>
          </el-upload>
          <el-button
            @click="onSaveSunCategory(scope.row)"
            type="text"
            size="small">
            新增子类
          </el-button>
          <el-button
            @click="onEdit(scope.row)"
            type="text"
            size="small">
            编辑
          </el-button>
          <el-button
            @click="onRemove(scope.row)"
            type="text"
            size="small">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 新增分类 -->
    <el-dialog
      title="新增分类"
      :visible.sync="isSave"
      width="30%"
      :before-close="onSaveClose">
      <el-form :model="saveGoodsCategory">
        <el-form-item label="分类名称" :label-width="formLabelWidth">
          <el-input v-model="saveGoodsCategory.name"></el-input>
        </el-form-item>
        <el-form-item label="上级分类编号" :label-width="formLabelWidth">
          <el-input v-model="saveGoodsCategory.fid" :disabled="isSaveSunCategory"></el-input>
        </el-form-item>
        <el-form-item label="分类备注" :label-width="formLabelWidth">
          <el-input v-model="saveGoodsCategory.remark"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isSave = false">取 消</el-button>
        <el-button type="primary" @click="onSaveGoodsCategory">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑分类 -->
    <el-dialog
      title="编辑分类"
      :visible.sync="isEdit"
      width="30%">
      <el-form :model="updateGoodsCategory">
        <el-form-item label="分类编号" :label-width="formLabelWidth">
          <el-input v-model="updateGoodsCategory.id" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="分类名称" :label-width="formLabelWidth">
          <el-input v-model="updateGoodsCategory.name"></el-input>
        </el-form-item>
        <el-form-item label="上级分类编号" :label-width="formLabelWidth">
          <el-input v-model="updateGoodsCategory.fid"></el-input>
        </el-form-item>
        <el-form-item label="分类备注" :label-width="formLabelWidth">
          <el-input v-model="updateGoodsCategory.remark"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isEdit = false">取 消</el-button>
        <el-button type="primary" @click="onUpdateGoodsCategory">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { findSelectCategory, updateGoodsCategory, saveGoodsCategory, deleteGoodsCategory } from '@/api/goods.js'
import { getImage, uploadOrUpdateGoodsCategoryIcon } from '@/utils/resources.js'
export default {
  name: 'Goods-Category',
  data() {
    return {
      authorization: window.sessionStorage.getItem('authorization'),
      isSave: false, // 是否新增
      saveGoodsCategory: {
        name: '',
        fid: null,
        remark: null
      },
      goodsCategory: [],
      updateGoodsCategory: {},
      isSaveSunCategory: false,
      isEdit: false,
      formLabelWidth: '100px',
      updateName: ''
    }
  },
  methods: {
    initData() {
      this.goodsCategory = []
      findSelectCategory().then(res => {
        const data = res.data
        if (data.code === 20011) {
          this.goodsCategory = data.data
        } else {
          this.$notify({
            title: '失败',
            message: data.message,
            type: 'warning'
          })
        }
      }).catch(err => {
        this.$notify.error({
          title: '错误',
          message: err.message
        })
      })
    },
    setIcon(icon) {
      return getImage(icon)
    },
    setpreviewSrc(icon) {
      return [getImage(icon)]
    },
    // ############上传图片（起始）###############
    setUploadAction(id) {
      return uploadOrUpdateGoodsCategoryIcon(id)
    },
    onUploadSuccess(res) {
      if (res.code === 20011) {
        this.$notify({
          title: '成功',
          message: res.message,
          type: 'success'
        })
      } else {
        this.$notify({
          title: '失败',
          message: res.message,
          type: 'warning'
        })
      }
    },
    onUploadError(err) {
      this.$notify.error({
        title: '错误',
        message: err.message
      })
    },
    onSave() {
      this.isSave = true
      this.saveGoodsCategory = { name: '', fid: null, remark: null }
      this.isSaveSunCategory = false
    },
    onSaveClose(done) {
      this.saveGoodsCategory = { name: '', fid: null, remark: null }
      this.isSaveSunCategory = false
      done()
    },
    onSaveGoodsCategory() {
      saveGoodsCategory(this.saveGoodsCategory.name, this.saveGoodsCategory.fid, this.saveGoodsCategory.remark).then(res => {
        const data = res.data
        if (data.code === 20011) {
          this.$notify({
            title: '成功',
            message: data.message,
            type: 'success'
          })
          const category = data.data
          // 判断是否一级分类
          if (category.fid == null || category.fid === '') {
            this.goodsCategory.push(category)
          }
          if (this.isSaveSunCategory) {
            this.saveGoodsCategory.name = ''
            this.saveGoodsCategory.remark = null
          } else {
            this.saveGoodsCategory = { name: '', fid: null, remark: null }
          }
        } else {
          this.$notify({
            title: '失败',
            message: data.message,
            type: 'warning'
          })
        }
      }).catch(err => {
        this.$notify.error({
          title: '错误',
          message: err.message
        })
      })
    },
    onSaveSunCategory(row) {
      this.saveGoodsCategory.fid = row.id
      this.isSave = true
      this.isSaveSunCategory = true
    },
    // 编辑
    onEdit(row) {
      this.updateGoodsCategory = row
      this.updateName = row.name
      this.isEdit = true
    },
    // 修改商品分类
    onUpdateGoodsCategory() {
      let name = null
      if (this.name !== this.updateGoodsCategory.name) {
        name = this.updateGoodsCategory.name
      }
      updateGoodsCategory(this.updateGoodsCategory.id, name, this.updateGoodsCategory.fid, this.updateGoodsCategory.remark).then(res => {
        const data = res.data
        if (data.code === 20011) {
          this.$notify({
            title: '成功',
            message: data.message,
            type: 'success'
          })
          this.isEdit = false
        } else {
          this.$notify({
            title: '失败',
            message: data.message,
            type: 'warning'
          })
        }
      }).catch(err => {
        this.$notify.error({
          title: '错误',
          message: err.message
        })
      })
    },
    onRemove(row) {
      console.log('删除', row)
      deleteGoodsCategory(row.id).then(res => {
        const data = res.data
        if (data.code) {
          this.$notify({
            title: '成功',
            message: data.message,
            type: 'success'
          })
          this.initData()
        } else {
          this.$notify({
            title: '失败',
            message: data.message,
            type: 'warning'
          })
        }
      }).catch(err => {
        this.$notify.error({
          title: '错误',
          message: err.message
        })
      })
    }
  },
  created() {
    this.initData()
  },
  mounted() {
    this.$bus.$on('init', (val) => {
      if (val) {
        this.initData()
      }
    })
  },
  beforeDestroy() {
    this.$bus.$off('init')
  }
}
</script>

<style lang="less" scoped>
.container{
  .func{
    padding: 10px;
    text-align: right;
  }
}
</style>
