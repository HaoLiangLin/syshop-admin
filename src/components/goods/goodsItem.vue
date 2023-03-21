<template>
  <div class="container">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/home/goodsList' }">商品列表</el-breadcrumb-item>
      <el-breadcrumb-item>商品库存</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="func">
      <table class="input">
        <tr>
          <td>
            <el-input
              size="small"
              placeholder="商品颜色"
              v-model="color"
              clearable>
            </el-input>
          </td>
          <td>
            <el-input
              size="small"
              placeholder="商品大小"
              v-model="size"
              clearable>
            </el-input>
          </td>
          <td>
            <el-select v-model="priceSort" placeholder="价格排序" size="small" clearable>
              <el-option
                v-for="item in sortOrder"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </td>
          <td>
            <el-select v-model="stockSort" placeholder="库存排序" size="small" clearable>
              <el-option
                v-for="item in sortOrder"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </td>
        </tr>
        <tr>
          <td>
            <el-input
              size="small"
              placeholder="商品套餐"
              v-model="combo"
              clearable>
            </el-input>
          </td>
          <td>
            <el-input
              size="small"
              placeholder="商品版本"
              v-model="edition"
              clearable>
            </el-input>
          </td>
          <td>
            <el-select v-model="salesSort" placeholder="销量排序" size="small" clearable>
              <el-option
                v-for="item in sortOrder"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </td>
          <td>
            <el-select v-model="status" placeholder="商品状态" size="small" clearable>
              <el-option
                v-for="item in statusOption"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </td>
        </tr>
      </table>
      <div class="btn">
        <el-button type="success" icon="el-icon-search" size="small" @click="onSearch">搜索</el-button>
      </div>
    </div>
    <el-table
      :data="goodsItemData"
      stripe
      :border="true"
      height="73vh">
      <el-table-column
        prop="id"
        label="ID"
        width="200"
        align="center">
      </el-table-column>
      <el-table-column
        prop="icon"
        label="商品图标"
        width="98px">
        <template slot-scope="scope">
          <el-image
            style="width: 75px; height: 75px"
            :src="setIcon(scope.row.icon)"
            fit="fit"
            :previewSrcList="setpreviewSrc(scope.row.icon)"></el-image>
        </template>
      </el-table-column>
      <el-table-column
        prop="status"
        label="商品状态 "
        width="100px"
        align="center">
        <template slot-scope="scope">
          <el-tag type="success" v-if="scope.row.status === 1">已上架</el-tag>
          <el-tag type="info" v-else-if="scope.row.status === 0">未上架</el-tag>
          <el-tag type="danger" v-else-if="scope.row.status === 2">已下架</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="stock"
        label="库存"
        align="center">
      </el-table-column>
      <el-table-column
        prop="color"
        label="颜色"
        align="center"
        :filters="colorOption"
        :filter-method="colorFilter">
      </el-table-column>
      <el-table-column
        prop="size"
        label="大小"
        align="center"
        :filters="sizeOption"
        :filter-method="sizeFilter">
      </el-table-column>
      <el-table-column
        prop="combo"
        label="套餐"
        align="center"
        :filters="comboOption"
        :filter-method="comboFilter">
      </el-table-column>
      <el-table-column
        prop="edition"
        label="版本"
        align="center"
        :filters="editionOption"
        :filter-method="editionFilter">
      </el-table-column>
      <el-table-column
        prop="price"
        label="价格"
        align="center">
      </el-table-column>
      <el-table-column
        prop="discount"
        label="折扣"
        align="center">
      </el-table-column>
      <el-table-column
        prop="sales"
        label="销量"
        width="100px"
        align="center">
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="120">
        <template slot="header" >
          <el-button type="primary" size="mini" @click="onSave" icon="el-icon-plus">新增库存</el-button>
        </template>
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
            v-if="scope.row.status === 1"
            @click="onSoldoOut(scope.row.id)"
            type="text"
            size="small">
            下架
          </el-button>
          <el-button
            v-if="scope.row.status === 2 || scope.row.status === 0"
            @click="onPutaway(scope.row)"
            type="text"
            size="small">
            上架
          </el-button>
          <el-button
            @click="onMore(scope.row)"
            type="text"
            size="small">
            更多
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="block">
      <el-pagination
        layout="total, prev, pager, next, jumper"
        background
        :total="total"
        :page-size="number"
        v-show="isHidePage"
        :current-page="current"
        @current-change="onChangePage">
      </el-pagination>
    </div>
    <el-dialog
      title="更多信息"
      :visible.sync="goodsItemMoreVisible"
      :before-close="onGoodItemMoreClose"
      width="65%">
      <el-descriptions title="库存信息" :column="4" size="" v-if="!Object.keys(updateGoodsItem).length==0" border>
        <template slot="extra">
          <el-button type="primary" size="mini" @click="onOpenUpdateGoods(updateGoodsItem)">修改商品信息</el-button>
        </template>
        <el-descriptions-item label="库存ID">{{updateGoodsItem.id}}</el-descriptions-item>
        <el-descriptions-item label="商品颜色">{{updateGoodsItem.color}}</el-descriptions-item>
        <el-descriptions-item label="商品大小">{{updateGoodsItem.size}}</el-descriptions-item>
        <el-descriptions-item label="商品套餐">{{updateGoodsItem.combo}}</el-descriptions-item>
        <el-descriptions-item label="商品版本">{{updateGoodsItem.edition}}</el-descriptions-item>
        <el-descriptions-item label="商品价格">{{updateGoodsItem.price}}</el-descriptions-item>
        <el-descriptions-item label="商品折扣">{{updateGoodsItem.discount}}</el-descriptions-item>
        <el-descriptions-item label="商品销量">{{updateGoodsItem.sales}}</el-descriptions-item>
        <el-descriptions-item label="商品备注">{{updateGoodsItem.remark}}</el-descriptions-item>
        <el-descriptions-item label="创建时间">{{updateGoodsItem.createTime}}</el-descriptions-item>
        <el-descriptions-item label="修改时间">{{updateGoodsItem.updateTime}}</el-descriptions-item>
        <el-descriptions-item label="商品状态">
          <el-tag type="success" v-if="updateGoodsItem.status === 1">已上架</el-tag>
          <el-tag type="info" v-else-if="updateGoodsItem.status === 0">未上架</el-tag>
        </el-descriptions-item>
      </el-descriptions>
    </el-dialog>
    <!-- 修改商品 -->
    <el-dialog
      title="修改商品"
      :visible.sync="isUpdate"
      width="45%">
      <el-form :model="updateGoodsItem" :inline="true">
        <el-form-item label="库存编号" :label-width="formLabelWidth">
          <el-input v-model="updateGoodsItem.id" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="商品颜色" :label-width="formLabelWidth">
          <el-autocomplete v-model="updateGoodsItem.color" :fetch-suggestions="queryColor"></el-autocomplete>
        </el-form-item>
        <el-form-item label="商品大小" :label-width="formLabelWidth">
          <el-autocomplete v-model="updateGoodsItem.size" :fetch-suggestions="querySize"></el-autocomplete>
        </el-form-item>
        <el-form-item label="商品套餐" :label-width="formLabelWidth">
          <el-autocomplete v-model="updateGoodsItem.combo" :fetch-suggestions="queryCombo"></el-autocomplete>
        </el-form-item>
        <el-form-item label="商品版本" :label-width="formLabelWidth">
          <el-autocomplete v-model="updateGoodsItem.edition" :fetch-suggestions="queryEdition"></el-autocomplete>
        </el-form-item>
        <el-form-item label="商品价格" :label-width="formLabelWidth">
          <el-input-number v-model="updateGoodsItem.price" :precision="2" :min="0.01" :step="0.01"></el-input-number>
        </el-form-item>
        <el-form-item label="商品折扣" :label-width="formLabelWidth">
          <el-input-number v-model="updateGoodsItem.discount" :precision="2" :min="0.01" :max="1" :step="0.01"></el-input-number>
        </el-form-item>
        <el-form-item label="商品库存" :label-width="formLabelWidth">
          <el-input-number v-model="updateGoodsItem.stock" :min="0"></el-input-number>
        </el-form-item>
        <el-form-item label="商品备注" :label-width="formLabelWidth">
          <el-input v-model="updateGoodsItem.remark" label="商品备注"></el-input>
        </el-form-item>
        <el-form-item label="是否上架" style="margin-left:30px">
          <el-radio-group v-model="updateGoodsItem.status">
            <el-radio :label="0">否</el-radio>
            <el-radio :label="1">是</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isUpdate = false">取 消</el-button>
        <el-button type="primary" @click="onUpdateGoods">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="新增库存"
      :visible.sync="isSave"
      width="45%"
      :before-close="onSaveClose">
      <el-form :model="saveGoodsItem" :inline="true">
        <el-form-item label="商品颜色" :label-width="formLabelWidth">
          <el-autocomplete v-model="saveGoodsItem.color" :fetch-suggestions="queryColor"></el-autocomplete>
        </el-form-item>
        <el-form-item label="商品大小" :label-width="formLabelWidth">
          <el-autocomplete v-model="saveGoodsItem.size" :fetch-suggestions="querySize"></el-autocomplete>
        </el-form-item>
        <el-form-item label="商品套餐" :label-width="formLabelWidth">
          <el-autocomplete v-model="saveGoodsItem.combo" :fetch-suggestions="queryCombo"></el-autocomplete>
        </el-form-item>
        <el-form-item label="商品版本" :label-width="formLabelWidth">
          <el-autocomplete v-model="saveGoodsItem.edition" :fetch-suggestions="queryEdition"></el-autocomplete>
        </el-form-item>
        <el-form-item label="商品价格" :label-width="formLabelWidth">
          <el-input-number v-model="saveGoodsItem.price" :precision="2" :min="0.01" :step="0.01"></el-input-number>
        </el-form-item>
        <el-form-item label="商品折扣" :label-width="formLabelWidth">
          <el-input-number v-model="saveGoodsItem.discount" :precision="2" :min="0.01" :max="1" :step="0.01"></el-input-number>
        </el-form-item>
        <el-form-item label="商品库存" :label-width="formLabelWidth">
          <el-input-number v-model="saveGoodsItem.stock" :min="0"></el-input-number>
        </el-form-item>
        <el-form-item label="商品备注" :label-width="formLabelWidth">
          <el-input v-model="saveGoodsItem.remark" label="商品备注"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isSave = false">取 消</el-button>
        <el-button type="primary" @click="onSaveGoodsItem">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { queryGoodsItemForPage, updateGoodsItem, saveGoodsItem } from '@/api/goods.js'
import { getImage, uploadOrUpdateGoodsItemIcon } from '@/utils/resources.js'
export default {
  name: 'Goods-Item',
  data() {
    return {
      goodsId: null,
      authorization: window.sessionStorage.getItem('authorization'),
      number: 7,
      goodsItemData: [], // 商品属性数据
      colorOption: [], // 颜色选项
      sizeOption: [], // 大小选项
      comboOption: [], // 套餐选项
      editionOption: [], // 版本选项
      isHidePage: true,
      total: 0,
      current: 1,
      isSearch: false,
      color: null,
      size: null,
      combo: null,
      edition: null,
      priceSort: null,
      stockSort: null,
      salesSort: null,
      status: null,
      sortOrder: [{ value: 'Asc', label: '升序' }, { value: 'Des', label: '降序' }],
      statusOption: [{ value: 0, label: '未上架' }, { value: 1, label: '已上架' }],
      goodsItemMoreVisible: false,
      formLabelWidth: '100px',
      updateGoodsItem: {},
      isUpdate: false,
      isSave: false,
      saveGoodsItem: { gid: '', color: '', size: '', combo: '', edition: '', price: null, discount: null, stock: null, remark: '' }
    }
  },
  methods: {
    initData() {
      this.goodsId = this.$route.params.id
      this.goodsItemData = []
      this.goodsItemData = [] // 商品属性数据
      this.colorOption = [] // 颜色选项
      this.sizeOption = [] // 大小选项
      this.comboOption = [] // 套餐选项
      this.editionOption = [] // 版本选项
      this.isSearch = false
      this.color = null
      this.size = null
      this.combo = null
      this.edition = null
      this.priceSort = null
      this.stockSort = null
      this.salesSort = null
      this.status = null
      this.updateGoodsItem = {}
      this.isUpdate = false
      this.isSave = false
      this.saveGoodsItem = { gid: '', color: '', size: '', combo: '', edition: '', price: null, discount: null, stock: null, remark: '' }
      // page, number, gid, color, combo, size, edition, priceSort, stockSort, salesSort, status
      queryGoodsItemForPage(1, this.number, this.goodsId, null, null, null, null, null, null, null, null).then(res => {
        this.setGoodsItemData(res)
      }).catch((err) => {
        this.$notify.error({
          title: '错误',
          message: err.message
        })
      })
    },
    setGoodsItemData(res) {
      this.goodsItemData = []
      const data = res.data
      if (data.code === 20011) {
        const resultData = data.data
        this.goodsItemData = resultData.data.records
        this.total = resultData.data.total
        this.current = resultData.data.current
        if (resultData.colorOption !== null && 'colorOption' in resultData) {
          resultData.colorOption.forEach(val => {
            this.colorOption.push({ text: val, value: val })
          })
        }
        if (resultData.sizeOption !== null && 'sizeOption' in resultData) {
          resultData.sizeOption.forEach(val => {
            this.sizeOption.push({ text: val, value: val })
          })
        }
        if (resultData.comboOption !== null && 'comboOption' in resultData) {
          resultData.comboOption.forEach(val => {
            this.comboOption.push({ text: val, value: val })
          })
        }
        if (resultData.editionOption !== null && 'editionOption' in resultData) {
          resultData.editionOption.forEach(val => {
            this.editionOption.push({ text: val, value: val })
          })
        }
      } else {
        this.$notify({
          title: '失败',
          message: data.message,
          type: 'warning'
        })
      }
    },
    onSearch() {
      this.isSearch = true
      queryGoodsItemForPage(1, this.number, this.goodsId, this.color, this.combo, this.size, this.edition, this.priceSort, this.stockSort, this.salesSort, this.status).then(res => {
        this.setGoodsItemData(res)
      }).catch((err) => {
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
      return uploadOrUpdateGoodsItemIcon(id)
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
      this.saveGoodsItem.gid = this.goodsId
      this.isSave = true
    },
    colorFilter(value, row) {
      return row.color === value
    },
    sizeFilter(value, row) {
      return row.size === value
    },
    comboFilter(value, row) {
      return row.combo === value
    },
    editionFilter(value, row) {
      return row.edition === value
    },
    // 下架
    onSoldoOut(id) {
      this.$confirm('此操作将下架该商品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // id, gid, color, size, combo, edition, price, discount, stock, remark, status
        updateGoodsItem(id, this.goodsId, null, null, null, null, null, null, null, null, 0).then(res => {
          const data = res.data
          if (data.code === 20011) {
            this.$message({
              message: data.message,
              type: 'success'
            })
            this.goodsItemData.forEach(goodsItem => {
              if (goodsItem.id === id) {
                goodsItem.status = 0
              }
            })
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
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    },
    // 上架
    onPutaway(row) {
      this.$confirm('此操作将上架该商品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        updateGoodsItem(row.id, this.goodsId, row.color, row.size, row.combo, row.edition, null, null, null, null, 1).then(res => {
          const data = res.data
          if (data.code === 20011) {
            this.$message({
              message: data.message,
              type: 'success'
            })
            this.goodsItemData.forEach(goodsItem => {
              if (goodsItem.id === row.id) {
                goodsItem.status = 0
              }
            })
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
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    },
    // 更多
    onMore(row) {
      this.updateGoodsItem = row
      this.goodsItemMoreVisible = true
    },
    onGoodItemMoreClose(done) {
      this.updateGoodsItem = {}
      done()
    },
    onOpenUpdateGoods(goodsItem) {
      this.isUpdate = true
      this.updateGoodsItem = goodsItem
    },
    onUpdateGoods() {
      // id, gid, color, size, combo, edition, price, discount, stock, remark, status
      updateGoodsItem(this.updateGoodsItem.id, this.goodsId, this.updateGoodsItem.color, this.updateGoodsItem.size, this.updateGoodsItem.combo, this.updateGoodsItem.edition, this.updateGoodsItem.price, this.updateGoodsItem.discount, this.updateGoodsItem.stock, this.updateGoodsItem.remark, this.updateGoodsItem.status).then(res => {
        const data = res.data
        if (data.code === 20011) {
          this.$message({
            message: data.message,
            type: 'success'
          })
          this.goodsItemData.forEach(goodsItem => {
            if (goodsItem.id === this.updateGoodsItem.id) {
              goodsItem.color = this.updateGoodsItem.color
              goodsItem.size = this.updateGoodsItem.size
              goodsItem.combo = this.updateGoodsItem.combo
              goodsItem.edition = this.updateGoodsItem.edition
              goodsItem.price = this.updateGoodsItem.price
              goodsItem.discount = this.updateGoodsItem.discount
              goodsItem.stock = this.updateGoodsItem.stock
              goodsItem.status = this.updateGoodsItem.status
            }
          })
          this.isUpdate = false
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
    queryColor(str, cb) {
      const result = str ? this.colorOption.filter(val => val.value.toLowerCase().indexOf(str.toLowerCase()) === 0) : this.colorOption
      cb(result)
    },
    querySize(str, cb) {
      const result = str ? this.sizeOption.filter(val => val.value.toLowerCase().indexOf(str.toLowerCase()) === 0) : this.sizeOption
      cb(result)
    },
    queryCombo(str, cb) {
      const result = str ? this.comboOption.filter(val => val.value.toLowerCase().indexOf(str.toLowerCase()) === 0) : this.comboOption
      cb(result)
    },
    queryEdition(str, cb) {
      const result = str ? this.editionOption.filter(val => val.value.toLowerCase().indexOf(str.toLowerCase()) === 0) : this.editionOption
      cb(result)
    },
    // 切页
    onChangePage(page) {
      if (this.isSearch) {
        queryGoodsItemForPage(page, this.number, this.goodsId, this.color, this.combo, this.size, this.edition, this.priceSort, this.stockSort, this.salesSort, this.status).then(res => {
          this.setGoodsItemData(res)
        }).catch((err) => {
          this.$notify.error({
            title: '错误',
            message: err.message
          })
        })
      } else {
        queryGoodsItemForPage(1, this.number, this.goodsId, null, null, null, null, null, null, null, null).then(res => {
          this.setGoodsItemData(res)
        }).catch((err) => {
          this.$notify.error({
            title: '错误',
            message: err.message
          })
        })
      }
    },
    // 新增
    onSaveClose(done) {
      this.saveGoodsItem = {}
      done()
    },
    onSaveGoodsItem() {
      saveGoodsItem(this.saveGoodsItem.gid, this.saveGoodsItem.color, this.saveGoodsItem.size, this.saveGoodsItem.combo, this.saveGoodsItem.edition, this.saveGoodsItem.price, this.saveGoodsItem.discount, this.saveGoodsItem.stock, this.saveGoodsItem.remark).then(res => {
        const data = res.data
        if (data.code === 20011) {
          this.$message({
            message: data.message,
            type: 'success'
          })
          this.goodsItemData.unshift(data.data)
          this.isSave = false
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
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    .input{
      width: 80%;
    }
    .btn{
      width: 20%;
      text-align: center;
    }
  }
  /deep/.el-table{
    .success-row{
      background: #f0f9eb;
    }
    .warning-row{
      background: #ffda8b;
    }
    .danger-row{
      background: #f49292;
    }
  }
}
</style>
